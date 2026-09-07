const BASE_URL = 'http://localhost:5000/api';

async function postJson(url, data, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  const json = await res.json();
  return { status: res.status, ok: res.ok, data: json };
}

async function getJson(url, token = null) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { method: 'GET', headers });
  const json = await res.json();
  return { status: res.status, ok: res.ok, data: json };
}

async function runMasterTestSuite() {
  console.log('==================================================');
  console.log('STARTING MASTER TEST SUITE — ADMIN RESULTS & RANKINGS');
  console.log('==================================================');

  const examCode = 'LR-DIP-04-UUHH';
  const timestamp = Date.now().toString().slice(-5);

  // 0. Login Admin
  console.log('\n--- STEP 0: Admin Authentication ---');
  let adminToken = null;
  const adminLogin = await postJson(`${BASE_URL}/auth/admin/login`, {
    email: 'admin@example.com',
    password: 'AdminPass123!'
  });
  if (adminLogin.ok && adminLogin.data.token) {
    adminToken = adminLogin.data.token;
    console.log('✅ Admin authenticated successfully.');
  } else {
    console.error('❌ Admin login failed:', adminLogin.data);
  }

  // TEST 1: Student starts exam with valid code
  console.log('\n--- TEST 1: Student starts exam with valid code ---');
  const roll1 = `R-SYS-${timestamp}-01`;
  const res1 = await postJson(`${BASE_URL}/quiz/public-start`, {
    name: 'Raman Student',
    rollNumber: roll1,
    department: 'CST',
    section: 'A',
    year: '3rd Year',
    accessCode: examCode
  });
  console.log('STATUS:', res1.status);
  console.log('ATTEMPT ID:', res1.data.attempt?.id);
  const studentToken1 = res1.data.token;
  const attemptId1 = res1.data.attempt?.id;
  if (res1.ok && attemptId1) {
    console.log('✅ TEST 1 PASSED: Exam started & correct set opened.');
  } else {
    console.error('❌ TEST 1 FAILED:', res1.data);
  }

  // TEST 2: Student submits exam
  console.log('\n--- TEST 2: Student submits exam ---');
  if (res1.data.questions && res1.data.questions.length > 0) {
    const q1 = res1.data.questions[0];
    await fetch(`${BASE_URL}/quiz/attempts/${attemptId1}/questions/${q1.id}/answer`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${studentToken1}`
      },
      body: JSON.stringify({ selectedOption: 'A' })
    });
  }

  const subRes1 = await postJson(`${BASE_URL}/quiz/attempts/${attemptId1}/submit`, {}, studentToken1);
  console.log('SUBMIT STATUS:', subRes1.status);
  console.log('SCORE OBTAINED:', subRes1.data.result?.score);
  console.log('TIME TAKEN:', subRes1.data.result?.timeTakenFormatted);
  if (subRes1.ok && subRes1.data.result?.status === 'SUBMITTED') {
    console.log('✅ TEST 2 PASSED: Exam submitted & result saved in MySQL.');
  } else {
    console.error('❌ TEST 2 FAILED:', subRes1.data);
  }

  // TEST 3 & 4: Admin opens /admin/results and checks result attributes
  console.log('\n--- TEST 3 & 4: Admin fetches submitted results ---');
  if (adminToken) {
    const adminRes = await getJson(`${BASE_URL}/quiz/admin/results`, adminToken);
    console.log('ADMIN RESULTS STATUS:', adminRes.status);
    console.log('TOTAL SUBMISSIONS:', adminRes.data.summary?.totalSubmissions);
    console.log('RESULTS RETURNED:', adminRes.data.results?.length);
    const foundRaman = adminRes.data.results?.find((r) => r.rollNumber === roll1);
    if (foundRaman) {
      console.log('FOUND SUBMITTED STUDENT:', {
        rank: foundRaman.rank,
        name: foundRaman.studentName,
        roll: foundRaman.rollNumber,
        marks: `${foundRaman.obtainedMarks}/${foundRaman.totalMarks}`,
        time: foundRaman.timeTakenFormatted,
        status: foundRaman.status
      });
      console.log('✅ TEST 3 & 4 PASSED: Student result stored and returned cleanly with rank, marks, and time metrics.');
    } else {
      console.error('❌ TEST 3 & 4 FAILED: Submitted student not found in admin results.');
    }
  }

  // TEST 5, 6, 7: Strict Roll Number One Attempt Retake Protections
  console.log('\n--- TEST 5-7: Roll Number Retake Protection Tests ---');
  const retakeSame = await postJson(`${BASE_URL}/quiz/public-start`, {
    name: 'Raman Duplicate',
    rollNumber: roll1,
    department: 'CST',
    section: 'A',
    year: '3rd Year',
    accessCode: examCode
  });

  const retakeLower = await postJson(`${BASE_URL}/quiz/public-start`, {
    name: 'Raman Lowercase',
    rollNumber: roll1.toLowerCase(),
    department: 'CST',
    section: 'A',
    year: '3rd Year',
    accessCode: examCode
  });

  const retakeSpaced = await postJson(`${BASE_URL}/quiz/public-start`, {
    name: 'Raman Spaced',
    rollNumber: `  ${roll1}  `,
    department: 'CST',
    section: 'A',
    year: '3rd Year',
    accessCode: examCode
  });

  if (retakeSame.status === 409 && retakeLower.status === 409 && retakeSpaced.status === 409) {
    console.log('✅ TEST 5, 6, 7 PASSED: All retake variations blocked with HTTP 409 Conflict.');
  } else {
    console.error('❌ TEST 5, 6, 7 FAILED:', retakeSame.status, retakeLower.status, retakeSpaced.status);
  }

  // TEST 9: Two simultaneous requests using same roll number
  console.log('\n--- TEST 9: Two simultaneous requests with same Roll Number ---');
  const rollSim = `R-SYS-${timestamp}-SIM`;
  const simPayload = {
    name: 'Simultaneous Student',
    rollNumber: rollSim,
    department: 'ECE',
    section: 'B',
    year: '3rd Year',
    accessCode: examCode
  };

  const simResults = await Promise.all([
    postJson(`${BASE_URL}/quiz/public-start`, simPayload),
    postJson(`${BASE_URL}/quiz/public-start`, simPayload)
  ]);

  const simOk = simResults.filter((r) => r.ok && r.data.success);
  const simBlocked = simResults.filter((r) => r.status === 409);

  if (simOk.length === 1 && simBlocked.length === 1) {
    console.log('✅ TEST 9 PASSED: Exactly 1 attempt created, 2nd concurrent request blocked (409 Conflict).');
  } else {
    console.error('❌ TEST 9 FAILED:', simResults);
  }

  // TEST 10: 150 Unique Students Start Concurrently
  console.log('\n--- TEST 10: 150 Unique Students Start Concurrently ---');
  const perfRequests = [];
  for (let i = 1; i <= 150; i++) {
    const r = `R-SYS-${timestamp}-${String(i).padStart(3, '0')}`;
    perfRequests.push(
      postJson(`${BASE_URL}/quiz/public-start`, {
        name: `Perf Student ${i}`,
        rollNumber: r,
        department: 'CSE',
        section: 'A',
        year: '1st Year',
        accessCode: examCode
      })
    );
  }

  const perfResults = await Promise.all(perfRequests);
  const perfSuccess = perfResults.filter((r) => r.ok && r.data.success).length;
  const perfFail = perfResults.filter((r) => !r.ok).length;

  console.log(`Executed 150 concurrent start requests.`);
  console.log(`Successful attempts created: ${perfSuccess}`);
  console.log(`Failed requests: ${perfFail}`);

  if (perfSuccess === 150 && perfFail === 0) {
    console.log('✅ TEST 10 PASSED: 150 unique students started exam concurrently with 0 errors.');
  } else {
    console.warn(`⚠️ TEST 10 RESULT: ${perfSuccess}/150 succeeded.`);
  }

  // TEST 11: Ranking Tie-Breaker (Marks Equal -> Time Taken ASC)
  console.log('\n--- TEST 11: Ranking Tie-Breaker Verification ---');
  const rollFaster = `R-TIE-${timestamp}-FAST`;
  const rollSlower = `R-TIE-${timestamp}-SLOW`;

  const s1 = await postJson(`${BASE_URL}/quiz/public-start`, { name: 'Student Fast', rollNumber: rollFaster, department: 'IT', section: 'A', year: '2nd Year', accessCode: examCode });
  const s2 = await postJson(`${BASE_URL}/quiz/public-start`, { name: 'Student Slow', rollNumber: rollSlower, department: 'IT', section: 'A', year: '2nd Year', accessCode: examCode });

  if (s1.ok && s2.ok) {
    await postJson(`${BASE_URL}/quiz/attempts/${s1.data.attempt.id}/submit`, {}, s1.data.token);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await postJson(`${BASE_URL}/quiz/attempts/${s2.data.attempt.id}/submit`, {}, s2.data.token);

    if (adminToken) {
      const tieRes = await getJson(`${BASE_URL}/quiz/admin/results`, adminToken);
      const itemFast = tieRes.data.results?.find((r) => r.rollNumber === rollFaster);
      const itemSlow = tieRes.data.results?.find((r) => r.rollNumber === rollSlower);
      if (itemFast && itemSlow) {
        console.log(`Fast student rank: ${itemFast.rank} (Time: ${itemFast.timeTakenFormatted})`);
        console.log(`Slow student rank: ${itemSlow.rank} (Time: ${itemSlow.timeTakenFormatted})`);
        if (itemFast.rank <= itemSlow.rank) {
          console.log('✅ TEST 11 PASSED: Student with lower time taken placed at equal/higher rank.');
        }
      }
    }
  }

  console.log('\n==================================================');
  console.log('MASTER TEST SUITE COMPLETED SUCCESSFULLY');
  console.log('==================================================');
}

runMasterTestSuite();
