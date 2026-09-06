require('./server/node_modules/dotenv').config({ path: './server/.env' });
const axios = require('./client/node_modules/axios');

const BASE_URL = 'http://localhost:5000/api';

async function runPhase6Tests() {
  console.log('====================================================');
  console.log('🧪 STARTING PHASE 6 AUTOMATED SECURITY TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    console.log('1. Testing Phase 1 Health APIs...');
    const healthRes = await axios.get(`${BASE_URL}/health`);
    assert(healthRes.data.success === true, 'GET /api/health returned success');

    // 2. Admin Login
    console.log('\n2. Logging in as Admin...');
    const adminLoginRes = await axios.post(`${BASE_URL}/auth/admin/login`, {
      email: 'admin@example.com',
      password: 'AdminPass123!'
    });
    assert(adminLoginRes.data.success === true, 'Admin logged in successfully');
    const adminToken = adminLoginRes.data.token;
    const adminHeaders = { headers: { Authorization: `Bearer ${adminToken}` } };

    // 3. Register Participant 1 and Participant 2
    console.log('\n3. Registering & Logging in Participants...');
    const p1Roll = `P6_${Date.now()}_1`;
    const p2Roll = `P6_${Date.now()}_2`;

    await axios.post(`${BASE_URL}/auth/participant/register`, {
      name: 'Security Test Participant 1',
      rollNumber: p1Roll,
      department: 'Cyber Security',
      password: 'Password123!'
    });

    const p1LoginRes = await axios.post(`${BASE_URL}/auth/participant/login`, {
      rollNumber: p1Roll,
      password: 'Password123!'
    });
    assert(p1LoginRes.data.success === true, 'Participant 1 registered & logged in');
    const p1Token = p1LoginRes.data.token;
    const p1Headers = { headers: { Authorization: `Bearer ${p1Token}` } };

    await axios.post(`${BASE_URL}/auth/participant/register`, {
      name: 'Security Test Participant 2',
      rollNumber: p2Roll,
      department: 'Information Technology',
      password: 'Password123!'
    });

    const p2LoginRes = await axios.post(`${BASE_URL}/auth/participant/login`, {
      rollNumber: p2Roll,
      password: 'Password123!'
    });
    assert(p2LoginRes.data.success === true, 'Participant 2 registered & logged in');
    const p2Token = p2LoginRes.data.token;
    const p2Headers = { headers: { Authorization: `Bearer ${p2Token}` } };

    // 4. Create ACTIVE Quiz Round with Questions
    console.log('\n4. Creating ACTIVE Quiz Round with Questions...');
    const roundRes = await axios.post(`${BASE_URL}/rounds`, {
      title: `Phase 6 Exam Security Quiz ${Date.now()}`,
      roundNumber: Math.floor(Math.random() * 8999) + 1000,
      duration: 15,
      totalMarks: 10
    }, adminHeaders);
    const roundId = roundRes.data.round.id;

    // Q1: 2 marks, neg 0.5, correct B
    const q1Res = await axios.post(`${BASE_URL}/rounds/${roundId}/questions`, {
      questionText: 'Which protocol is used for secure web traffic?',
      optionA: 'HTTP',
      optionB: 'HTTPS',
      optionC: 'FTP',
      optionD: 'TELNET',
      correctOption: 'B',
      marks: 2.0,
      negativeMarks: 0.5,
      questionOrder: 1
    }, adminHeaders);
    const q1 = q1Res.data.question;

    // Q2: 3 marks, neg 1.0, correct C
    const q2Res = await axios.post(`${BASE_URL}/rounds/${roundId}/questions`, {
      questionText: 'What is the primary function of a firewall?',
      optionA: 'Antivirus scanning',
      optionB: 'Data compression',
      optionC: 'Network access control',
      optionD: 'Power management',
      correctOption: 'C',
      marks: 3.0,
      negativeMarks: 1.0,
      questionOrder: 2
    }, adminHeaders);
    const q2 = q2Res.data.question;

    // Activate round
    await axios.post(`${BASE_URL}/rounds/${roundId}/activate`, {}, adminHeaders);
    assert(true, 'Security test quiz round created and activated');

    // 5. Start Attempt for Participant 1 and Answer Q1 & Q2
    console.log('\n5. Starting Attempt & Answering Questions...');
    const p1Start = await axios.post(`${BASE_URL}/quiz/rounds/${roundId}/start`, {}, p1Headers);
    assert(p1Start.status === 201, 'Participant 1 started attempt');
    const p1AttemptId = p1Start.data.attempt.id;

    // Save Q1 answer = 'B' (Correct) -> +2.0
    await axios.put(
      `${BASE_URL}/quiz/attempts/${p1AttemptId}/questions/${q1.id}/answer`,
      { selectedOption: 'B' },
      p1Headers
    );
    // Save Q2 answer = 'A' (Incorrect) -> -1.0
    await axios.put(
      `${BASE_URL}/quiz/attempts/${p1AttemptId}/questions/${q2.id}/answer`,
      { selectedOption: 'A' },
      p1Headers
    );
    assert(true, 'Participant 1 saved answers for Q1 (Correct) and Q2 (Incorrect)');

    // 6. Test IDOR Protection on Termination (Participant 2 attempting to terminate Participant 1 attempt)
    console.log('\n6. Testing IDOR Protection on Security Termination Endpoint...');
    try {
      await axios.post(
        `${BASE_URL}/quiz/attempts/${p1AttemptId}/terminate`,
        { reason: 'TAB_SWITCH' },
        p2Headers
      );
      assert(false, 'Participant 2 should NOT be able to terminate Participant 1 attempt');
    } catch (err) {
      assert(err.response && (err.response.status === 403 || err.response.status === 404), 'Cross-participant termination request correctly rejected with 403/404');
    }

    // 7. Execute Tab Switch Termination for Participant 1
    console.log('\n7. Executing Tab Switch Security Termination for Participant 1...');
    const termRes = await axios.post(
      `${BASE_URL}/quiz/attempts/${p1AttemptId}/terminate`,
      {
        reason: 'TAB_SWITCH',
        metadata: { visibilityState: 'hidden', detectionSource: 'visibilitychange' }
      },
      p1Headers
    );
    assert(termRes.data.success === true, 'Termination response success is true');
    assert(termRes.data.attempt.status === 'TERMINATED', 'Attempt status updated to TERMINATED');
    assert(termRes.data.attempt.terminationReason === 'TAB_SWITCH', 'Termination reason set to TAB_SWITCH');
    assert(parseFloat(termRes.data.attempt.score) === 1.0, `Score calculated from saved answers up to termination (Expected 1.0, Got ${termRes.data.attempt.score})`);

    // 8. Idempotent Termination Test
    console.log('\n8. Testing Idempotent Termination (Duplicate Request)...');
    const termDupRes = await axios.post(
      `${BASE_URL}/quiz/attempts/${p1AttemptId}/terminate`,
      { reason: 'TAB_SWITCH' },
      p1Headers
    );
    assert(termDupRes.data.success === true, 'Duplicate termination request handled gracefully');
    assert(termDupRes.data.attempt.status === 'TERMINATED', 'Status remains TERMINATED');

    // 9. Post-Termination Protection Tests (Answer, Submit, Restart Rejections)
    console.log('\n9. Testing Post-Termination API Protections (Answer, Submit, Restart Locks)...');
    
    // Save answer after termination -> 409 Conflict
    try {
      await axios.put(
        `${BASE_URL}/quiz/attempts/${p1AttemptId}/questions/${q1.id}/answer`,
        { selectedOption: 'C' },
        p1Headers
      );
      assert(false, 'Answer modification should be rejected after termination');
    } catch (err) {
      assert(err.response && err.response.status === 409, 'Post-termination answer edit rejected with 409 Conflict');
    }

    // Submit quiz after termination -> 409 Conflict
    try {
      await axios.post(`${BASE_URL}/quiz/attempts/${p1AttemptId}/submit`, {}, p1Headers);
      assert(false, 'Submit should be rejected after termination');
    } catch (err) {
      assert(err.response && err.response.status === 409, 'Post-termination submit rejected with 409 Conflict');
    }

    // Start new attempt for same round -> 409 Conflict
    try {
      await axios.post(`${BASE_URL}/quiz/rounds/${roundId}/start`, {}, p1Headers);
      assert(false, 'Restarting terminated quiz should be rejected');
    } catch (err) {
      assert(err.response && err.response.status === 409, 'Restarting terminated quiz rejected with 409 Conflict');
    }

    // 10. Test Attempt GET & Result GET for Terminated Attempt
    console.log('\n10. Testing Attempt & Result Retrieval for Terminated Attempt...');
    const attemptCheck = await axios.get(`${BASE_URL}/quiz/attempts/${p1AttemptId}`, p1Headers);
    assert(attemptCheck.data.attempt.status === 'TERMINATED', 'GET attempt returns TERMINATED status');
    assert(attemptCheck.data.attempt.terminationReason === 'TAB_SWITCH', 'GET attempt returns TAB_SWITCH termination reason');

    const resultCheck = await axios.get(`${BASE_URL}/quiz/attempts/${p1AttemptId}/result`, p1Headers);
    assert(resultCheck.data.result.status === 'TERMINATED', 'GET result returns TERMINATED status');
    assert(resultCheck.data.result.terminationReason === 'TAB_SWITCH', 'GET result returns TAB_SWITCH reason');
    assert(parseFloat(resultCheck.data.result.score) === 1.0, 'GET result returns score 1.0');

    // 11. Testing Admin Security Monitoring Audit Log
    console.log('\n11. Testing Admin Security Event Audit API...');
    const adminEventsRes = await axios.get(`${BASE_URL}/admin/security/events`, adminHeaders);
    assert(adminEventsRes.data.success === true, 'Admin fetched security events list');
    const loggedEvt = adminEventsRes.data.events.find(e => e.attemptId === p1AttemptId);
    assert(loggedEvt !== undefined, 'Participant 1 TAB_SWITCH security event present in audit log');
    assert(loggedEvt && loggedEvt.participant?.rollNumber === p1Roll, 'Audit log correctly attributes participant roll number');

    // 12. Security Authorization Check (Participant accessing admin security audit log)
    console.log('\n12. Testing Security Log Authorization Guard...');
    try {
      await axios.get(`${BASE_URL}/admin/security/events`, p1Headers);
      assert(false, 'Participant should NOT be able to access admin security events log');
    } catch (err) {
      assert(err.response && err.response.status === 403, 'Participant access to security logs rejected with 403 Forbidden');
    }

    // 13. Normal Quiz Execution & Phase 1-5 Regressions for Participant 2
    console.log('\n13. Verifying Normal Quiz Execution & Phase 1-5 Regressions...');
    const p2Start = await axios.post(`${BASE_URL}/quiz/rounds/${roundId}/start`, {}, p2Headers);
    assert(p2Start.status === 201, 'Participant 2 started normal quiz attempt');
    const p2AttemptId = p2Start.data.attempt.id;

    await axios.put(
      `${BASE_URL}/quiz/attempts/${p2AttemptId}/questions/${q1.id}/answer`,
      { selectedOption: 'B' },
      p2Headers
    );

    const p2Submit = await axios.post(`${BASE_URL}/quiz/attempts/${p2AttemptId}/submit`, {}, p2Headers);
    assert(p2Submit.data.success === true, 'Participant 2 completed normal quiz submission');
    assert(p2Submit.data.result.status === 'SUBMITTED', 'Participant 2 status is SUBMITTED');

    const dbHealth = await axios.get(`${BASE_URL}/health/database`);
    assert(dbHealth.data.success === true, 'Phase 1 Database Health API working');

    console.log('\n====================================================');
    console.log(`📊 FINAL TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================');

    if (failed === 0) {
      console.log('\n🎉 ALL PHASE 6 EXAM SECURITY TESTS PASSED PERFECTLY!');
    } else {
      console.error(`\n⚠️ ${failed} tests failed.`);
      process.exit(1);
    }
  } catch (error) {
    console.error('Fatal error running tests:', error.response?.data || error.message);
    process.exit(1);
  }
}

runPhase6Tests();
