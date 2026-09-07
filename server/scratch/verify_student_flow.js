const http = require('http');

function postJSON(path, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
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

async function verifyStudentFlow() {
  console.log('=== VERIFYING STUDENT EXAM ENTRY FLOW ===\n');

  // Test 1: Invalid Exam Code
  console.log('--- TEST 1: Submitting Invalid Exam Code ---');
  const invalidRes = await postJSON('/api/quiz/public-start', {
    name: 'Validation Tester',
    rollNumber: 'TEST99999',
    department: 'CSE',
    section: 'A',
    accessCode: 'WRONG_CODE_12345'
  });

  console.log(`HTTP Status: ${invalidRes.status}`);
  console.log(`Response Data:`, invalidRes.data);

  if (invalidRes.status === 401 && invalidRes.data.message === 'Invalid Exam Code. Please enter a valid code.') {
    console.log('✅ TEST 1 PASSED: Invalid exam code rejected with exact required message.');
  } else {
    console.error('❌ TEST 1 FAILED!');
    process.exit(1);
  }

  // Test 2: Valid Exam Code (Fetch an active code from DB first)
  console.log('\n--- TEST 2: Submitting Valid Exam Code ---');
  const { QuizRound } = require('../server/src/models');
  const activeRound = await QuizRound.findOne({
    where: { status: 'ACTIVE' },
    attributes: ['id', 'title', 'accessCode', 'category', 'course', 'year', 'setNumber']
  });

  if (!activeRound) {
    console.error('Error: No active round found in DB.');
    process.exit(1);
  }

  console.log(`Using active round code: ${activeRound.accessCode} (${activeRound.title})`);

  const validRes = await postJSON('/api/quiz/public-start', {
    name: 'Valid Student Test',
    rollNumber: '24CSE8888',
    department: 'CSE',
    section: 'B',
    accessCode: activeRound.accessCode
  });

  console.log(`HTTP Status: ${validRes.status}`);
  console.log(`Response Success: ${validRes.data?.success}`);
  console.log(`Resolved Set Title: ${validRes.data?.quiz?.title}`);
  console.log(`Attempt ID: ${validRes.data?.attempt?.id}`);

  if (validRes.status === 201 && validRes.data?.quiz?.title === activeRound.title && validRes.data?.attempt?.id) {
    console.log(`✅ TEST 2 PASSED: Valid code ${activeRound.accessCode} automatically resolved and opened ${activeRound.title}!`);
  } else {
    console.error('❌ TEST 2 FAILED!', validRes.data);
    process.exit(1);
  }

  // Cleanup test data
  const { Participant, QuizAttempt } = require('../server/src/models');
  await QuizAttempt.destroy({ where: { participantId: validRes.data.participant.id } });
  await Participant.destroy({ where: { rollNumber: ['TEST99999', '24CSE8888'] } });

  console.log('\n=== ALL STUDENT FLOW VERIFICATIONS PASSED ===');
}

verifyStudentFlow().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
