const http = require('http');

function getJSON(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'GET'
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
    req.end();
  });
}

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

async function testEnvAndApis() {
  console.log('=== RUNNING API TEST SUITE ===\n');

  // Test 1: GET /api/health
  console.log('--- TEST 1: GET /api/health ---');
  const healthRes = await getJSON('/api/health');
  console.log(`Status: ${healthRes.status}, Message: ${healthRes.data?.message}`);
  if (healthRes.status !== 200) throw new Error('GET /api/health failed');

  // Test 2: POST /api/quiz/verify-access-code (Invalid)
  console.log('\n--- TEST 2: POST /api/quiz/verify-access-code (INVALID) ---');
  const verifyInvRes = await postJSON('/api/quiz/verify-access-code', { accessCode: 'INVALID-999' });
  console.log(`Status: ${verifyInvRes.status}, Message: ${verifyInvRes.data?.message}`);
  if (verifyInvRes.status !== 401) throw new Error('Invalid code check failed');

  // Test 3: POST /api/quiz/verify-access-code (Valid)
  console.log('\n--- TEST 3: POST /api/quiz/verify-access-code (VALID) ---');
  const { QuizRound } = require('../server/src/models');
  const activeRound = await QuizRound.findOne({ where: { status: 'ACTIVE' } });
  const verifyValRes = await postJSON('/api/quiz/verify-access-code', { accessCode: activeRound.accessCode });
  console.log(`Status: ${verifyValRes.status}, Matched Round: ${verifyValRes.data?.round?.title}`);
  if (verifyValRes.status !== 200) throw new Error('Valid code check failed');

  // Test 4: POST /api/quiz/public-start
  console.log('\n--- TEST 4: POST /api/quiz/public-start ---');
  const startRes = await postJSON('/api/quiz/public-start', {
    name: 'Env Tester',
    rollNumber: 'ENVTEST100',
    department: 'CSE',
    section: 'B',
    year: '2nd Year',
    accessCode: activeRound.accessCode
  });
  console.log(`Status: ${startRes.status}, Opened Quiz: ${startRes.data?.quiz?.title}`);
  if (startRes.status !== 201) throw new Error('Public start failed');

  // Cleanup
  const { Participant, QuizAttempt } = require('../server/src/models');
  await QuizAttempt.destroy({ where: { id: startRes.data.attempt.id } });
  await Participant.destroy({ where: { rollNumber: 'ENVTEST100' } });

  console.log('\n=== ALL API TESTS PASSED SUCCESSFULLY ===');
}

testEnvAndApis().catch(err => {
  console.error('API Test Error:', err);
  process.exit(1);
});
