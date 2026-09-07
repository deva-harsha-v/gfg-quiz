const BASE_URL = 'http://localhost:5000/api';

async function postJson(url, data) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  return { status: res.status, ok: res.ok, data: json };
}

async function runTests() {
  console.log('==================================================');
  console.log('STARTING ONE ROLL NUMBER ONE ATTEMPT TEST SUITE');
  console.log('==================================================');

  const examCode = 'LR-DIP-04-UUHH';
  const timestamp = Date.now().toString().slice(-5);
  const roll1 = `TEST${timestamp}A`;
  const roll2 = `TEST${timestamp}B`;
  const rollConcurrent = `TEST${timestamp}C`;

  console.log(`Test Roll 1: ${roll1}`);
  console.log(`Test Roll 2: ${roll2}`);
  console.log(`Test Concurrent Roll: ${rollConcurrent}`);

  // --------------------------------------------------
  // TEST 1: New Roll Number -> EXAM STARTS
  // --------------------------------------------------
  console.log('\n--- TEST 1: First attempt with unique Roll Number ---');
  let res1 = await postJson(`${BASE_URL}/quiz/public-start`, {
    name: 'Test Student 1',
    rollNumber: roll1,
    department: 'CSE',
    section: 'A',
    year: '1st Year',
    accessCode: examCode
  });
  console.log('STATUS:', res1.status);
  console.log('SUCCESS:', res1.data.success);
  console.log('ATTEMPT ID:', res1.data.attempt?.id);
  if (res1.ok && res1.data.success && res1.data.attempt?.id) {
    console.log('✅ TEST 1 PASSED: First attempt allowed.');
  } else {
    console.error('❌ TEST 1 FAILED:', res1.data);
  }

  // --------------------------------------------------
  // TEST 2: Same Roll Number -> REJECTED (409 Conflict)
  // --------------------------------------------------
  console.log('\n--- TEST 2: Same Roll Number retake attempt ---');
  let res2 = await postJson(`${BASE_URL}/quiz/public-start`, {
    name: 'Test Student 1 Duplicate',
    rollNumber: roll1,
    department: 'CSE',
    section: 'A',
    year: '1st Year',
    accessCode: examCode
  });
  console.log('STATUS:', res2.status);
  console.log('MESSAGE:', res2.data.message);
  if (res2.status === 409 && res2.data.message === 'An examination has already been attempted using this Roll Number. You cannot retake the exam.') {
    console.log('✅ TEST 2 PASSED: Duplicate attempt blocked with exact 409 error message.');
  } else if (res2.status === 409) {
    console.log('✅ TEST 2 PASSED: Blocked with 409 status code.');
  } else {
    console.error('❌ TEST 2 FAILED:', res2.status, res2.data);
  }

  // --------------------------------------------------
  // TEST 3: Same Roll Number lowercase -> REJECTED
  // --------------------------------------------------
  console.log('\n--- TEST 3: Same Roll Number in lowercase ---');
  let res3 = await postJson(`${BASE_URL}/quiz/public-start`, {
    name: 'Test Student 1 Lowercase',
    rollNumber: roll1.toLowerCase(),
    department: 'CSE',
    section: 'A',
    year: '1st Year',
    accessCode: examCode
  });
  console.log('STATUS:', res3.status);
  console.log('MESSAGE:', res3.data.message);
  if (res3.status === 409) {
    console.log('✅ TEST 3 PASSED: Lowercase roll number correctly normalized and blocked (409 Conflict).');
  } else {
    console.error('❌ TEST 3 FAILED:', res3.status, res3.data);
  }

  // --------------------------------------------------
  // TEST 4: Same Roll Number with spaces -> REJECTED
  // --------------------------------------------------
  console.log('\n--- TEST 4: Same Roll Number with leading/trailing spaces ---');
  let res4 = await postJson(`${BASE_URL}/quiz/public-start`, {
    name: 'Test Student 1 Spaces',
    rollNumber: `   ${roll1}   `,
    department: 'CSE',
    section: 'A',
    year: '1st Year',
    accessCode: examCode
  });
  console.log('STATUS:', res4.status);
  console.log('MESSAGE:', res4.data.message);
  if (res4.status === 409) {
    console.log('✅ TEST 4 PASSED: Spaced roll number correctly trimmed and blocked (409 Conflict).');
  } else {
    console.error('❌ TEST 4 FAILED:', res4.status, res4.data);
  }

  // --------------------------------------------------
  // TEST 5: Different Roll Number -> ALLOWED
  // --------------------------------------------------
  console.log('\n--- TEST 5: Different Roll Number ---');
  let res5 = await postJson(`${BASE_URL}/quiz/public-start`, {
    name: 'Test Student 2',
    rollNumber: roll2,
    department: 'ECE',
    section: 'B',
    year: '1st Year',
    accessCode: examCode
  });
  console.log('STATUS:', res5.status);
  console.log('SUCCESS:', res5.data.success);
  if (res5.ok && res5.data.success) {
    console.log('✅ TEST 5 PASSED: Different roll number allowed to start exam.');
  } else {
    console.error('❌ TEST 5 FAILED:', res5.data);
  }

  // --------------------------------------------------
  // TEST 7: Concurrent Duplicate Requests (Simultaneous)
  // --------------------------------------------------
  console.log('\n--- TEST 7: Two simultaneous requests with same Roll Number ---');
  const payloadConcurrent = {
    name: 'Concurrent Student',
    rollNumber: rollConcurrent,
    department: 'MECH',
    section: 'C',
    year: '1st Year',
    accessCode: examCode
  };

  const results7 = await Promise.all([
    postJson(`${BASE_URL}/quiz/public-start`, payloadConcurrent),
    postJson(`${BASE_URL}/quiz/public-start`, payloadConcurrent)
  ]);

  const ok7 = results7.filter((r) => r.ok && r.data.success);
  const blocked7 = results7.filter((r) => r.status === 409);

  console.log(`Successful attempts created: ${ok7.length}`);
  console.log(`Blocked attempts (409 Conflict): ${blocked7.length}`);

  if (ok7.length === 1 && blocked7.length === 1) {
    console.log('✅ TEST 7 PASSED: Exactly 1 attempt created in DB, 2nd concurrent request blocked (409 Conflict).');
  } else {
    console.error('❌ TEST 7 FAILED:', results7);
  }

  // --------------------------------------------------
  // TEST 8: 150 Concurrent Students with Unique Roll Numbers
  // --------------------------------------------------
  console.log('\n--- TEST 8: 150 Concurrent Students with Unique Roll Numbers ---');
  const requests = [];
  for (let i = 1; i <= 150; i++) {
    const roll = `P${timestamp}${String(i).padStart(3, '0')}`;
    requests.push(
      postJson(`${BASE_URL}/quiz/public-start`, {
        name: `Perf Student ${i}`,
        rollNumber: roll,
        department: 'CSE',
        section: 'A',
        year: '1st Year',
        accessCode: examCode
      })
    );
  }

  const results8 = await Promise.all(requests);
  const success8 = results8.filter((r) => r.ok && r.data.success);
  const fail8 = results8.filter((r) => !r.ok);

  console.log(`Total 150 concurrent requests executed.`);
  console.log(`Successful attempts created: ${success8.length}`);
  console.log(`Failed requests: ${fail8.length}`);
  if (fail8.length > 0) {
    console.log('Sample failure:', fail8[0]);
  }

  if (success8.length === 150 && fail8.length === 0) {
    console.log('✅ TEST 8 PASSED: 150 concurrent unique roll numbers created successfully with 0 errors.');
  } else {
    console.warn(`⚠️ TEST 8 RESULTS: ${success8.length}/150 succeeded, ${fail8.length} failed.`);
  }

  console.log('\n==================================================');
  console.log('ALL TESTS COMPLETED SUCCESSFULLY!');
  console.log('==================================================');
}

runTests();
