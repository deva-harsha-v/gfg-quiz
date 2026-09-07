const http = require('http');
const { QuizRound, Participant, QuizAttempt } = require('../server/src/models');

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
        try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
        catch (e) { resolve({ status: res.statusCode, data: body }); }
      });
    });
    req.on('error', (err) => reject(err));
    req.write(payload);
    req.end();
  });
}

async function testRuntimeAndFlow() {
  console.log('=== VERIFYING FRONTEND RUNTIME & EXAM CODE FLOW ===\n');

  // 1. Fetch active round
  const round = await QuizRound.findOne({ where: { status: 'ACTIVE' } });
  if (!round) {
    console.error('Error: No active round found');
    process.exit(1);
  }

  // 2. Test Invalid Code Flow
  console.log('--- Test 1: Invalid Exam Code Submission ---');
  const invalidRes = await postJSON('/api/quiz/public-start', {
    name: 'Diagnostic Student',
    rollNumber: 'DIAG9999',
    department: 'CSE',
    section: 'A',
    year: '1st Year',
    accessCode: 'INVALID-99999'
  });
  console.log(`Status: ${invalidRes.status}, Message: ${invalidRes.data?.message}`);

  if (invalidRes.status === 401 && invalidRes.data?.message === 'Invalid Exam Code. Please enter a valid code.') {
    console.log('✅ Test 1 Passed: Invalid code correctly rejected without creating attempt.');
  } else {
    console.error('❌ Test 1 Failed!', invalidRes.data);
    process.exit(1);
  }

  // 3. Test Valid Code Flow
  console.log('\n--- Test 2: Valid Exam Code Submission ---');
  const validRes = await postJSON('/api/quiz/public-start', {
    name: 'Diagnostic Student',
    rollNumber: 'DIAG8888',
    department: 'ECE',
    section: 'B',
    year: '2nd Year',
    accessCode: round.accessCode
  });
  console.log(`Status: ${validRes.status}, Opened Set: ${validRes.data?.quiz?.title}`);

  if (validRes.status === 201 && validRes.data?.quiz?.title === round.title) {
    console.log(`✅ Test 2 Passed: Valid code ${round.accessCode} automatically resolved and opened ${round.title}!`);
  } else {
    console.error('❌ Test 2 Failed!', validRes.data);
    process.exit(1);
  }

  // Cleanup
  await QuizAttempt.destroy({ where: { id: validRes.data.attempt.id } });
  await Participant.destroy({ where: { rollNumber: ['DIAG9999', 'DIAG8888'] } });

  console.log('\n=== ALL DIAGNOSTIC TESTS PASSED SUCCESSFULLY ===');
}

testRuntimeAndFlow().catch((err) => {
  console.error('Runtime test error:', err);
  process.exit(1);
});
