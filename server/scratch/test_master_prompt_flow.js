const http = require('http');
const { QuizRound, Participant, QuizAttempt, Question, QuizAnswer } = require('../server/src/models');

function postJSON(path, data, token = null) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'POST',
      headers: headers
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(payload);
    req.end();
  });
}

async function testMasterPromptFlow() {
  console.log('=== RUNNING MASTER PROMPT VERIFICATION TESTS ===\n');

  // Fetch sample active round
  const activeRound = await QuizRound.findOne({
    where: { status: 'ACTIVE' },
    attributes: ['id', 'title', 'accessCode', 'category', 'course', 'year', 'setNumber']
  });

  if (!activeRound) {
    console.error('Error: No active round found.');
    process.exit(1);
  }

  // TEST 1: Valid Code & Automated Set Resolution
  console.log('--- TEST 1: Valid Code Submission ---');
  const validRes = await postJSON('/api/quiz/public-start', {
    name: 'Ravi Kumar',
    rollNumber: '23CST001',
    department: 'CST',
    section: 'A',
    year: '1st Year',
    accessCode: activeRound.accessCode
  });

  console.log(`HTTP Status: ${validRes.status}`);
  console.log(`Resolved Set Title: ${validRes.data?.quiz?.title}`);
  console.log(`Attempt ID Created: ${validRes.data?.attempt?.id}`);

  if (validRes.status === 201 && validRes.data?.quiz?.title === activeRound.title) {
    console.log('✅ TEST 1 PASSED: Valid code automatically resolved and opened exact matching quiz set!');
  } else {
    console.error('❌ TEST 1 FAILED:', validRes.data);
    process.exit(1);
  }

  // TEST 2: Invalid Code Rejection
  console.log('\n--- TEST 2: Invalid Code Submission ---');
  const invalidRes = await postJSON('/api/quiz/public-start', {
    name: 'Ravi Kumar',
    rollNumber: '23CST001',
    department: 'CST',
    section: 'A',
    year: '1st Year',
    accessCode: 'INVALID-123'
  });

  console.log(`HTTP Status: ${invalidRes.status}`);
  console.log(`Message: ${invalidRes.data?.message}`);

  if (invalidRes.status === 401 && invalidRes.data?.message === 'Invalid Exam Code. Please enter a valid code.') {
    console.log('✅ TEST 2 PASSED: Invalid code rejected with exact required message!');
  } else {
    console.error('❌ TEST 2 FAILED:', invalidRes.data);
    process.exit(1);
  }

  // TEST 3: Repeat Attempt Protection
  console.log('\n--- TEST 3: Repeat Attempt Protection ---');
  // Mark the attempt as SUBMITTED directly for testing
  const attemptId = validRes.data.attempt.id;
  await QuizAttempt.update({ status: 'SUBMITTED' }, { where: { id: attemptId } });

  const repeatRes = await postJSON('/api/quiz/public-start', {
    name: 'Ravi Kumar',
    rollNumber: '23CST001',
    department: 'CST',
    section: 'A',
    year: '1st Year',
    accessCode: activeRound.accessCode
  });

  console.log(`HTTP Status: ${repeatRes.status}`);
  console.log(`Message: ${repeatRes.data?.message}`);

  if (repeatRes.status === 409 && repeatRes.data?.message === 'You have already completed this examination.') {
    console.log('✅ TEST 3 PASSED: Repeat attempt prevented with completion message!');
  } else {
    console.error('❌ TEST 3 FAILED:', repeatRes.data);
    process.exit(1);
  }

  // TEST 4: Student Details Association
  console.log('\n--- TEST 4: Student Details Storage ---');
  const p = await Participant.findOne({ where: { rollNumber: '23CST001' } });
  console.log(`Stored Student Name: ${p?.name}`);
  console.log(`Stored Roll No: ${p?.rollNumber}`);
  console.log(`Stored Department: ${p?.department}`);
  console.log(`Stored Section: ${p?.section}`);

  if (p && p.name === 'Ravi Kumar' && p.department === 'CST' && p.section === 'A') {
    console.log('✅ TEST 4 PASSED: Student details successfully saved and associated with attempt!');
  } else {
    console.error('❌ TEST 4 FAILED: Student details mismatch');
    process.exit(1);
  }

  // TEST 5: Admin Code Uniqueness & Display
  console.log('\n--- TEST 5: Admin Code Uniqueness & Display Check ---');
  const totalRounds = await QuizRound.count();
  const uniqueCodes = await QuizRound.count({ distinct: true, col: 'accessCode' });
  console.log(`Total Sets in Database: ${totalRounds}`);
  console.log(`Unique Access Codes: ${uniqueCodes}`);

  if (totalRounds === uniqueCodes) {
    console.log('✅ TEST 5 PASSED: 100% of quiz sets have unique, distinct Exam Codes!');
  } else {
    console.error('❌ TEST 5 FAILED: Duplicate codes found.');
    process.exit(1);
  }

  // Cleanup test attempt & participant
  await QuizAttempt.destroy({ where: { id: attemptId } });
  await Participant.destroy({ where: { rollNumber: '23CST001' } });

  console.log('\n=== ALL 5 MASTER PROMPT VERIFICATION TESTS PASSED SUCCESSFULLY ===');
}

testMasterPromptFlow().catch((err) => {
  console.error('Master test failed:', err);
  process.exit(1);
});
