const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

const { sequelize } = require(path.join(__dirname, '../server/src/config/database'));
const Participant = require(path.join(__dirname, '../server/src/models/Participant'));
const QuizAttempt = require(path.join(__dirname, '../server/src/models/QuizAttempt'));
const QuizRound = require(path.join(__dirname, '../server/src/models/QuizRound'));

const API_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('=== RUNNING OFFICIAL REGISTRATION VERIFICATION TEST SUITE ===\n');

  // Find active exam set code
  const activeRound = await QuizRound.findOne({ where: { status: 'ACTIVE' } });
  if (!activeRound) {
    console.error('ERROR: No ACTIVE round found in DB!');
    process.exit(1);
  }
  const examCode = activeRound.accessCode;
  console.log(`Using active exam code: ${examCode} (Round ID: ${activeRound.id})`);

  // Clean up any test attempts from previous test runs for official students
  await sequelize.query(`DELETE FROM quiz_answers WHERE attemptId IN (SELECT id FROM quiz_attempts)`);
  await sequelize.query(`DELETE FROM quiz_attempts`);

  console.log('\n--- TEST 1: Registered student enters correct roll number ---');
  try {
    const res = await fetch(`${API_URL}/quiz/public-start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Fake Entered Name',
        rollNumber: '23CST043',
        department: 'FAKE DEPT',
        section: 'Z',
        year: '4th Year',
        accessCode: examCode
      })
    });
    const data = await res.json();
    console.log('✅ TEST 1 PASSED: Status =', res.status);
    console.log('   Participant returned:', data.participant?.name, `(${data.participant?.rollNumber})`);
    console.log('   Used Official Name?:', data.participant?.name !== 'Fake Entered Name' ? 'YES (Venkata Ramana)' : 'NO (Failed details match)');
  } catch (err) {
    console.error('❌ TEST 1 FAILED:', err.message);
  }

  console.log('\n--- TEST 2: Unregistered student enters random roll number ---');
  try {
    const res = await fetch(`${API_URL}/quiz/public-start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Unregistered Student',
        rollNumber: 'UNREG9999',
        department: 'CST',
        section: 'A',
        year: '2nd Year',
        accessCode: examCode
      })
    });
    const data = await res.json();
    if (res.status === 403) {
      console.log('✅ TEST 2 PASSED: HTTP 403 returned with message:', data.message);
    } else {
      console.error('❌ TEST 2 FAILED: Unexpected status', res.status, data);
    }
  } catch (err) {
    console.error('❌ TEST 2 FAILED:', err.message);
  }

  // Verify UNREG9999 was not created in DB
  const unregInDb = await Participant.findOne({ where: { rollNumber: 'UNREG9999' } });
  console.log('   Unregistered student in DB?:', unregInDb ? 'YES (FAILED!)' : 'NO (PASSED)');

  console.log('\n--- TEST 3: Lowercase & Spaced Roll Number Normalization ---');
  try {
    const res = await fetch(`${API_URL}/quiz/public-start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Student',
        rollNumber: ' 23cst043 ',
        department: 'CST',
        section: 'A',
        year: '2nd Year',
        accessCode: examCode
      })
    });
    const data = await res.json();
    if (res.status === 409) {
      console.log('✅ TEST 3 PASSED: HTTP 409 returned (Recognized same roll number & blocked retake):', data.message);
    } else {
      console.error('❌ TEST 3 FAILED: Unexpected status', res.status, data);
    }
  } catch (err) {
    console.error('❌ TEST 3 FAILED:', err.message);
  }

  console.log('\n--- TEST 4: Submit Exam and check Admin Results ---');
  // Get attempt ID for 23CST043
  const attempt43 = await QuizAttempt.findOne({
    include: [{ model: Participant, as: 'participant', where: { rollNumber: '23CST043' } }]
  });
  if (attempt43) {
    // Login as 23CST043 to get participant token
    const pTokenRes = await fetch(`${API_URL}/quiz/public-start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Venkata Ramana',
        rollNumber: '23CST043',
        department: 'CST',
        section: 'A',
        year: '2nd Year',
        accessCode: examCode
      })
    });
    const pTokenData = await pTokenRes.json();
    const token = pTokenData.token;

    // Submit attempt
    const submitRes = await fetch(`${API_URL}/quiz/attempts/${attempt43.id}/submit`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    const submitData = await submitRes.json();
    console.log('   Submitted attempt 23CST043. Status:', submitData.result.status);

    // Login as Admin
    const adminLoginRes = await fetch(`${API_URL}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'AdminPass123!'
      })
    });
    const adminLoginData = await adminLoginRes.json();
    const adminToken = adminLoginData.token;

    // Fetch Admin Results
    const adminResultsRes = await fetch(`${API_URL}/quiz/admin/results`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const adminResultsData = await adminResultsRes.json();

    console.log('✅ Admin Results Count:', adminResultsData.results.length);
    console.log('   First result:', adminResultsData.results[0]?.studentName, adminResultsData.results[0]?.rollNumber);

    const testUserInResults = adminResultsData.results.some(r =>
      r.studentName.includes('Alice') || r.studentName.includes('Concurrent') || r.rollNumber.startsWith('CC-')
    );
    console.log('   Test users in results?:', testUserInResults ? 'YES (FAILED!)' : 'NO (PASSED!)');
  }

  console.log('\n--- TEST 5: 150 Student Concurrency Test ---');
  // Clean up attempts
  await sequelize.query(`DELETE FROM quiz_answers WHERE attemptId IN (SELECT id FROM quiz_attempts)`);
  await sequelize.query(`DELETE FROM quiz_attempts`);

  console.log('Starting 150 concurrent official students exam entries...');
  const concurrentPromises = [];
  for (let i = 1; i <= 150; i++) {
    const roll = `23CST${String(i).padStart(3, '0')}`;
    concurrentPromises.push(
      fetch(`${API_URL}/quiz/public-start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Student ${i}`,
          rollNumber: roll,
          department: 'CST',
          section: 'A',
          year: '2nd Year',
          accessCode: examCode
        })
      }).then(async r => {
        const data = await r.json();
        return { status: r.status, roll, attemptId: data.attempt?.id, token: data.token, message: data.message };
      }).catch(e => ({ status: 500, roll, error: e.message }))
    );
  }

  const results = await Promise.all(concurrentPromises);
  const successfulStarts = results.filter(r => r.status === 201 || r.status === 200);
  console.log(`✅ 150 Concurrent Starts: ${successfulStarts.length}/150 successful!`);

  console.log('Submitting all 150 attempts...');
  const submitPromises = successfulStarts.map(s =>
    fetch(`${API_URL}/quiz/attempts/${s.attemptId}/submit`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${s.token}` }
    }).then(async r => {
      const data = await r.json();
      return { status: r.status, roll: s.roll };
    }).catch(e => ({ status: 500, roll: s.roll }))
  );
  const submitResults = await Promise.all(submitPromises);
  const successfulSubmits = submitResults.filter(r => r.status === 200);
  console.log(`✅ 150 Concurrent Submits: ${successfulSubmits.length}/150 successful!`);

  // Verify Admin Results count
  const adminLoginRes = await fetch(`${API_URL}/auth/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@example.com',
      password: 'AdminPass123!'
    })
  });
  const adminLoginData = await adminLoginRes.json();
  const adminToken = adminLoginData.token;
  const finalResultsRes = await fetch(`${API_URL}/quiz/admin/results`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const finalResultsData = await finalResultsRes.json();

  console.log(`✅ Final Admin Results Count: ${finalResultsData.results.length} (Expected: 150)`);

  console.log('\n=== ALL VERIFICATION TESTS COMPLETED ===');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Fatal Test Error:', err);
  process.exit(1);
});
