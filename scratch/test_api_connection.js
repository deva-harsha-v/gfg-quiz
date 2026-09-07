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

async function testApiConnection() {
  console.log('=== API & PORT 5000 CONNECTION DIAGNOSTICS ===\n');

  // 1. Health API Check
  console.log('--- 1. Testing GET /api/health ---');
  const healthRes = await getJSON('/api/health');
  console.log(`HTTP Status: ${healthRes.status}`);
  console.log(`Payload:`, healthRes.data);

  if (healthRes.status === 200 && healthRes.data?.success) {
    console.log('✅ Health API test passed on port 5000.');
  } else {
    console.error('❌ Health API failed!');
    process.exit(1);
  }

  // 2. Exam Access Code Verification Endpoint
  console.log('\n--- 2. Testing POST /api/quiz/verify-access-code ---');
  const verifyRes = await postJSON('/api/quiz/verify-access-code', {
    accessCode: 'CR-DIP-05-ZQRW'
  });
  console.log(`HTTP Status: ${verifyRes.status}`);
  console.log(`Payload:`, verifyRes.data);

  if (verifyRes.status === 200 && verifyRes.data?.success) {
    console.log(`✅ Exam Code Verification Endpoint (/api/quiz/verify-access-code) connected & working! Matched round: ${verifyRes.data?.round?.title}`);
  } else {
    console.error('❌ Verify endpoint failed!', verifyRes.data);
    process.exit(1);
  }

  // 3. Public Exam Start Endpoint
  console.log('\n--- 3. Testing POST /api/quiz/public-start ---');
  const startRes = await postJSON('/api/quiz/public-start', {
    name: 'API Test Student',
    rollNumber: '24CSE999',
    department: 'CSE',
    section: 'A',
    year: '1st Year',
    accessCode: 'CR-DIP-05-ZQRW'
  });
  console.log(`HTTP Status: ${startRes.status}`);
  console.log(`Payload:`, startRes.data);

  if (startRes.status === 201 && startRes.data?.success) {
    console.log(`✅ Public Start Endpoint (/api/quiz/public-start) connected & working! Opened: ${startRes.data?.quiz?.title}`);
  } else {
    console.error('❌ Public start endpoint failed!', startRes.data);
    process.exit(1);
  }

  // Cleanup test record
  const { Participant, QuizAttempt } = require('../server/src/models');
  await QuizAttempt.destroy({ where: { id: startRes.data.attempt.id } });
  await Participant.destroy({ where: { rollNumber: '24CSE999' } });

  console.log('\n=== ALL API DIAGNOSTICS COMPLETED SUCCESSFULLY ===');
}

testApiConnection().catch(err => {
  console.error('API Test Error:', err);
  process.exit(1);
});
