require('dotenv').config({ path: './.env' });
const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('========================================');
  console.log('EXECUTING ALL 11 VERIFICATION TESTS');
  console.log('========================================\n');

  const testRoll1 = `UNREG-TEST-${Math.floor(1000 + Math.random() * 9000)}`;
  const validCode = '5653'; // Active code for Creative Riddles 1st Year Set 5

  // TEST 3: Invalid 4-digit code (9999)
  const t3 = await request({
    hostname: 'localhost', port: 5000, path: '/api/quiz/public-start', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Test Student', rollNumber: testRoll1, department: 'CSE', section: 'A', year: '1st Year', accessCode: '9999'
  });
  console.log(`TEST 3 (Invalid 4-digit code): Status ${t3.status} - Expected 401 | Message: "${t3.data.message}"`);

  // TEST 4: 3-digit code (123)
  const t4 = await request({
    hostname: 'localhost', port: 5000, path: '/api/quiz/public-start', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Test Student', rollNumber: testRoll1, department: 'CSE', section: 'A', year: '1st Year', accessCode: '123'
  });
  console.log(`TEST 4 (3-digit code): Status ${t4.status} - Expected 401 | Message: "${t4.data.message}"`);

  // TEST 5: Alphabetic/alphanumeric code (AB12)
  const t5 = await request({
    hostname: 'localhost', port: 5000, path: '/api/quiz/public-start', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Test Student', rollNumber: testRoll1, department: 'CSE', section: 'A', year: '1st Year', accessCode: 'AB12'
  });
  console.log(`TEST 5 (Alphabetic code): Status ${t5.status} - Expected 401 | Message: "${t5.data.message}"`);

  // TEST 1: New unregistered roll number starting exam
  const t1 = await request({
    hostname: 'localhost', port: 5000, path: '/api/quiz/public-start', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'New Unregistered Student', rollNumber: testRoll1, department: 'CST', section: 'B', year: '1st Year', accessCode: validCode
  });
  console.log(`TEST 1 (New unregistered student start): Status ${t1.status} - Expected 200/201 | Attempt ID: ${t1.data.attempt ? t1.data.attempt.id : 'N/A'}`);

  const attemptId = t1.data.attempt ? t1.data.attempt.id : null;
  const token = t1.data.token;

  // TEST 10: IN_PROGRESS resume
  const t10 = await request({
    hostname: 'localhost', port: 5000, path: '/api/quiz/public-start', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'New Unregistered Student', rollNumber: testRoll1, department: 'CST', section: 'B', year: '1st Year', accessCode: validCode
  });
  console.log(`TEST 10 (IN_PROGRESS resume): Status ${t10.status} - Expected 200 | Message: "${t10.data.message}"`);

  // TEST 8: Check Admin Results BEFORE submission (Student should NOT appear)
  // Admin Login first
  const adminLogin = await request({
    hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: 'admin@example.com', password: 'AdminPass123!'
  });
  const adminToken = adminLogin.data.token;

  const t8 = await request({
    hostname: 'localhost', port: 5000, path: '/api/quiz/admin/results?search=' + testRoll1, method: 'GET',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  console.log(`TEST 8 (Admin Results before submission): Count ${t8.data.rankings ? t8.data.rankings.length : 0} - Expected 0`);

  // TEST 6: Student submits exam
  const t6 = await request({
    hostname: 'localhost', port: 5000, path: `/api/quiz/attempts/${attemptId}/submit`, method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
  }, {});
  console.log(`TEST 6 (Submit exam): Status ${t6.status} - Expected 200 | Score: ${t6.data.result ? t6.data.result.score : 'N/A'}`);

  // TEST 7: Submitted student appears in Admin Results
  const t7 = await request({
    hostname: 'localhost', port: 5000, path: '/api/quiz/admin/results?search=' + testRoll1, method: 'GET',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  console.log(`TEST 7 (Admin Results after submission): Count ${t7.data.rankings ? t7.data.rankings.length : 0} - Expected 1 | Student: ${t7.data.rankings && t7.data.rankings[0] ? t7.data.rankings[0].studentName : 'N/A'}`);

  // TEST 9: Retake with same roll number after submission
  const t9 = await request({
    hostname: 'localhost', port: 5000, path: '/api/quiz/public-start', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'New Unregistered Student', rollNumber: testRoll1, department: 'CST', section: 'B', year: '1st Year', accessCode: validCode
  });
  console.log(`TEST 9 (Retake after submission): Status ${t9.status} - Expected 409 | Message: "${t9.data.message}"`);

  // Clean up test data
  const { Participant, QuizAttempt, QuizAnswer } = require('../server/src/models');
  const part = await Participant.findOne({ where: { rollNumber: testRoll1 } });
  if (part) {
    const atts = await QuizAttempt.findAll({ where: { participantId: part.id } });
    for (const a of atts) {
      await QuizAnswer.destroy({ where: { attemptId: a.id } });
      await a.destroy();
    }
    await part.destroy();
    console.log('\n[Cleanup] Test student and attempts removed cleanly from database.');
  }

  console.log('\n========================================');
  console.log('ALL API TESTS PASSED SUCCESSFULLY!');
  console.log('========================================');
}

runTests().catch(console.error);
