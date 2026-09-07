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

async function testYearFieldFlow() {
  console.log('=== VERIFYING YEAR FIELD & EXAM FLOW ===\n');

  // Test 1: Missing Year Validation Error
  console.log('--- TEST 1: Submitting without Year ---');
  const missingYearRes = await postJSON('/api/quiz/public-start', {
    name: 'Year Validation Student',
    rollNumber: '24CSE777',
    department: 'CSE',
    section: 'A',
    year: '',
    accessCode: 'CR-DIP-05-ZQRW'
  });

  console.log(`HTTP Status: ${missingYearRes.status}`);
  console.log(`Response Message: ${missingYearRes.data?.message}`);

  if (missingYearRes.status === 400 && missingYearRes.data?.message === 'Please select your Year.') {
    console.log('✅ TEST 1 PASSED: Missing year rejected with validation error.');
  } else {
    console.error('❌ TEST 1 FAILED!', missingYearRes.data);
    process.exit(1);
  }

  // Test 2: Invalid Exam Code with Year
  console.log('\n--- TEST 2: Submitting Invalid Exam Code with Year ---');
  const invalidCodeRes = await postJSON('/api/quiz/public-start', {
    name: 'Year Validation Student',
    rollNumber: '24CSE777',
    department: 'CSE',
    section: 'A',
    year: '2nd Year',
    accessCode: 'WRONG_CODE_999'
  });

  console.log(`HTTP Status: ${invalidCodeRes.status}`);
  console.log(`Response Message: ${invalidCodeRes.data?.message}`);

  if (invalidCodeRes.status === 401 && invalidCodeRes.data?.message === 'Invalid Exam Code. Please enter a valid code.') {
    console.log('✅ TEST 2 PASSED: Invalid code rejected with exact required message.');
  } else {
    console.error('❌ TEST 2 FAILED!', invalidCodeRes.data);
    process.exit(1);
  }

  // Test 3: Valid Exam Code with Year
  console.log('\n--- TEST 3: Submitting Valid Exam Code with Year (3rd Year) ---');
  const { QuizRound } = require('../server/src/models');
  const activeRound = await QuizRound.findOne({
    where: { status: 'ACTIVE' },
    attributes: ['id', 'title', 'accessCode']
  });

  const validRes = await postJSON('/api/quiz/public-start', {
    name: 'Year Test Student',
    rollNumber: '24CSE888',
    department: 'CSE',
    section: 'C',
    year: '3rd Year',
    accessCode: activeRound.accessCode
  });

  console.log(`HTTP Status: ${validRes.status}`);
  console.log(`Resolved Set: ${validRes.data?.quiz?.title}`);
  console.log(`Returned Participant Year: ${validRes.data?.participant?.year}`);

  if (validRes.status === 201 && validRes.data?.quiz?.title === activeRound.title) {
    console.log(`✅ TEST 3 PASSED: Valid exam code ${activeRound.accessCode} opened exact set "${activeRound.title}"!`);
  } else {
    console.error('❌ TEST 3 FAILED!', validRes.data);
    process.exit(1);
  }

  // Cleanup test records
  const { Participant, QuizAttempt } = require('../server/src/models');
  await QuizAttempt.destroy({ where: { participantId: validRes.data.participant.id } });
  await Participant.destroy({ where: { rollNumber: ['24CSE777', '24CSE888'] } });

  console.log('\n=== ALL YEAR FIELD TESTS PASSED ===');
}

testYearFieldFlow().catch((err) => {
  console.error('Error running year field test:', err);
  process.exit(1);
});
