require('./server/node_modules/dotenv').config({ path: './server/.env' });
const axios = require('./client/node_modules/axios');

const BASE_URL = 'http://localhost:5000/api';

async function runPhase5Tests() {
  console.log('====================================================');
  console.log('🧪 STARTING PHASE 5 AUTOMATED VERIFICATION TEST SUITE');
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

    // 3. Register Participant 1 and Participant 2 & Login
    console.log('\n3. Registering & Logging in Participants...');
    const p1Roll = `P5_${Date.now()}_1`;
    const p2Roll = `P5_${Date.now()}_2`;

    await axios.post(`${BASE_URL}/auth/participant/register`, {
      name: 'Test Participant 1',
      rollNumber: p1Roll,
      department: 'Computer Science',
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
      name: 'Test Participant 2',
      rollNumber: p2Roll,
      department: 'Electrical',
      password: 'Password123!'
    });

    const p2LoginRes = await axios.post(`${BASE_URL}/auth/participant/login`, {
      rollNumber: p2Roll,
      password: 'Password123!'
    });
    assert(p2LoginRes.data.success === true, 'Participant 2 registered & logged in');
    const p2Token = p2LoginRes.data.token;
    const p2Headers = { headers: { Authorization: `Bearer ${p2Token}` } };

    // 4. Test Starting Quiz on Non-ACTIVE Round & Empty Round
    console.log('\n4. Testing Round State Rules (DRAFT / PAUSED / COMPLETED / Empty ACTIVE)...');
    
    // Create DRAFT Round
    const draftRoundRes = await axios.post(`${BASE_URL}/rounds`, {
      title: `Draft Round ${Date.now()}`,
      roundNumber: Math.floor(Math.random() * 8999) + 1000,
      duration: 10,
      totalMarks: 50
    }, adminHeaders);
    const draftRoundId = draftRoundRes.data.round.id;

    try {
      await axios.post(`${BASE_URL}/quiz/rounds/${draftRoundId}/start`, {}, p1Headers);
      assert(false, 'Should not allow starting DRAFT round');
    } catch (err) {
      assert(err.response && err.response.status === 409, 'Start DRAFT round correctly rejected with 409 Conflict');
    }

    // Activate empty round (0 active questions)
    await axios.post(`${BASE_URL}/rounds/${draftRoundId}/activate`, {}, adminHeaders);
    try {
      await axios.post(`${BASE_URL}/quiz/rounds/${draftRoundId}/start`, {}, p1Headers);
      assert(false, 'Should not allow starting ACTIVE round with 0 questions');
    } catch (err) {
      assert(err.response && err.response.status === 409, 'Start empty ACTIVE round correctly rejected with 409 Conflict');
    }

    // 5. Create ACTIVE Round with Questions for Quiz Engine Testing
    console.log('\n5. Creating ACTIVE Quiz Round with Questions...');
    const mainRoundRes = await axios.post(`${BASE_URL}/rounds`, {
      title: `Phase 5 Main Quiz ${Date.now()}`,
      roundNumber: Math.floor(Math.random() * 8999) + 1000,
      duration: 15,
      totalMarks: 10
    }, adminHeaders);
    const mainRoundId = mainRoundRes.data.round.id;

    // Add 3 Questions to main round
    // Q1: marks=2, negativeMarks=0.5, correctOption=B
    const q1Res = await axios.post(`${BASE_URL}/rounds/${mainRoundId}/questions`, {
      questionText: 'Which data structure follows FIFO?',
      optionA: 'Stack',
      optionB: 'Queue',
      optionC: 'Tree',
      optionD: 'Graph',
      correctOption: 'B',
      marks: 2.0,
      negativeMarks: 0.5,
      questionOrder: 1
    }, adminHeaders);
    const q1 = q1Res.data.question;

    // Q2: marks=3, negativeMarks=1.0, correctOption=C
    const q2Res = await axios.post(`${BASE_URL}/rounds/${mainRoundId}/questions`, {
      questionText: 'What is the time complexity of binary search?',
      optionA: 'O(n)',
      optionB: 'O(n log n)',
      optionC: 'O(log n)',
      optionD: 'O(1)',
      correctOption: 'C',
      marks: 3.0,
      negativeMarks: 1.0,
      questionOrder: 2
    }, adminHeaders);
    const q2 = q2Res.data.question;

    // Q3: marks=1, negativeMarks=0.0, correctOption=A
    const q3Res = await axios.post(`${BASE_URL}/rounds/${mainRoundId}/questions`, {
      questionText: 'Which language is executed in the browser?',
      optionA: 'JavaScript',
      optionB: 'Python',
      optionC: 'C++',
      optionD: 'Java',
      correctOption: 'A',
      marks: 1.0,
      negativeMarks: 0.0,
      questionOrder: 3
    }, adminHeaders);
    const q3 = q3Res.data.question;

    // Activate the main round
    await axios.post(`${BASE_URL}/rounds/${mainRoundId}/activate`, {}, adminHeaders);
    assert(true, 'Main quiz round created and activated with 3 questions');

    // 6. Test GET /api/quiz/available
    console.log('\n6. Testing GET /api/quiz/available...');
    const availRes = await axios.get(`${BASE_URL}/quiz/available`, p1Headers);
    assert(availRes.data.success === true, 'Available quizzes retrieved successfully');
    const matchedQuiz = availRes.data.quizzes.find(q => q.id === mainRoundId);
    assert(matchedQuiz !== undefined, 'Main active quiz present in available list');
    assert(matchedQuiz && matchedQuiz.correctOption === undefined, 'Available quizzes list DOES NOT expose correctOption');

    // 7. Start Quiz Attempt for Participant 1 & Verify Sanitization
    console.log('\n7. Starting Quiz Attempt & Verifying Security Sanitization...');
    const startRes = await axios.post(`${BASE_URL}/quiz/rounds/${mainRoundId}/start`, {}, p1Headers);
    assert(startRes.status === 201, 'Quiz attempt created with 201 Created');
    assert(startRes.data.success === true, 'Start response success is true');
    const attempt = startRes.data.attempt;
    assert(attempt.status === 'IN_PROGRESS', 'Attempt status is IN_PROGRESS');
    assert(attempt.expiresAt !== undefined, 'Server-calculated expiresAt is present');

    const receivedQuestions = startRes.data.questions;
    assert(receivedQuestions.length === 3, 'Received 3 active questions');

    // CRITICAL SECURITY ASSERTION: correctOption and explanation MUST NEVER be returned!
    let leakedAnswer = false;
    receivedQuestions.forEach((q) => {
      if (q.correctOption !== undefined || q.explanation !== undefined) {
        leakedAnswer = true;
      }
    });
    assert(!leakedAnswer, 'CRITICAL SECURITY: correctOption and explanation ARE NOT EXPOSED in start API!');

    // 8. Duplicate Start Attempt Rule (Resume IN_PROGRESS attempt)
    console.log('\n8. Testing Duplicate Start Attempt Rule...');
    const resumeStartRes = await axios.post(`${BASE_URL}/quiz/rounds/${mainRoundId}/start`, {}, p1Headers);
    assert(resumeStartRes.status === 200, 'Duplicate start returned existing attempt with 200 OK');
    assert(resumeStartRes.data.attempt.id === attempt.id, 'Resumed attempt ID matches original attempt ID');

    // 9. Ownership Security Test (Participant 2 accessing Participant 1 attempt)
    console.log('\n9. Testing Attempt Ownership Security (IDOR Protection)...');
    try {
      await axios.get(`${BASE_URL}/quiz/attempts/${attempt.id}`, p2Headers);
      assert(false, 'Participant 2 should NOT be able to access Participant 1 attempt');
    } catch (err) {
      assert(err.response && (err.response.status === 403 || err.response.status === 404), 'Cross-participant attempt access correctly rejected with 403/404');
    }

    // 10. Valid Option & Answer Saving
    console.log('\n10. Testing Answer Saving & Validation...');
    
    // Save Q1 answer as 'A' (Incorrect)
    const ans1Res = await axios.put(
      `${BASE_URL}/quiz/attempts/${attempt.id}/questions/${q1.id}/answer`,
      { selectedOption: 'A' },
      p1Headers
    );
    assert(ans1Res.data.success === true, 'Q1 answer saved as A');

    // Update Q1 answer to 'B' (Correct)
    const ans1UpdateRes = await axios.put(
      `${BASE_URL}/quiz/attempts/${attempt.id}/questions/${q1.id}/answer`,
      { selectedOption: 'B' },
      p1Headers
    );
    assert(ans1UpdateRes.data.success === true, 'Q1 answer updated to B');

    // Save Q2 answer as 'A' (Incorrect)
    const ans2Res = await axios.put(
      `${BASE_URL}/quiz/attempts/${attempt.id}/questions/${q2.id}/answer`,
      { selectedOption: 'A' },
      p1Headers
    );
    assert(ans2Res.data.success === true, 'Q2 answer saved as A (Incorrect)');

    // Leave Q3 unanswered

    // Invalid option validation test (reject E, 1, null)
    try {
      await axios.put(
        `${BASE_URL}/quiz/attempts/${attempt.id}/questions/${q1.id}/answer`,
        { selectedOption: 'E' },
        p1Headers
      );
      assert(false, 'Option E should be rejected');
    } catch (err) {
      assert(err.response && err.response.status === 400, 'Invalid option E rejected with 400 Bad Request');
    }

    // 11. GET Attempt Questions Verification
    console.log('\n11. Testing GET /api/quiz/attempts/:attemptId/questions...');
    const questionsRes = await axios.get(`${BASE_URL}/quiz/attempts/${attempt.id}/questions`, p1Headers);
    assert(questionsRes.data.success === true, 'Attempt questions fetched successfully');
    const q1Obj = questionsRes.data.questions.find(q => q.id === q1.id);
    const q2Obj = questionsRes.data.questions.find(q => q.id === q2.id);
    const q3Obj = questionsRes.data.questions.find(q => q.id === q3.id);
    assert(q1Obj.selectedOption === 'B', 'Q1 selectedOption correctly restored as B');
    assert(q2Obj.selectedOption === 'A', 'Q2 selectedOption correctly restored as A');
    assert(q3Obj.selectedOption === null, 'Q3 selectedOption is null (unanswered)');

    // 12. Submit Quiz & Score Calculation Test
    // Expected Score Calculation:
    // Q1: B (Correct) -> +2.0
    // Q2: A (Incorrect, correct is C) -> -1.0
    // Q3: Unanswered -> 0.0
    // Total Score: 2.0 - 1.0 + 0 = 1.0
    console.log('\n12. Submitting Quiz & Verifying Server-Side Score Calculation...');
    const submitRes = await axios.post(`${BASE_URL}/quiz/attempts/${attempt.id}/submit`, {}, p1Headers);
    assert(submitRes.data.success === true, 'Quiz submitted successfully');
    const result = submitRes.data.result;
    assert(result.status === 'SUBMITTED', 'Result status is SUBMITTED');
    assert(parseFloat(result.score) === 1.0, `Calculated score is 1.0 (Received: ${result.score})`);
    assert(result.answeredCount === 2, 'Answered count is 2');
    assert(result.correctCount === 1, 'Correct count is 1');
    assert(result.incorrectCount === 1, 'Incorrect count is 1');
    assert(result.unansweredCount === 1, 'Unanswered count is 1');

    // 13. Submission Idempotency Test
    console.log('\n13. Testing Submission Idempotency...');
    const secondSubmitRes = await axios.post(`${BASE_URL}/quiz/attempts/${attempt.id}/submit`, {}, p1Headers);
    assert(secondSubmitRes.data.success === true, 'Second submit request handled gracefully');
    assert(parseFloat(secondSubmitRes.data.result.score) === 1.0, 'Second submit returned same score without recalculating');

    // 14. Post-Submission Lock Test
    console.log('\n14. Testing Post-Submission Lock (Preventing Answer Edit)...');
    try {
      await axios.put(
        `${BASE_URL}/quiz/attempts/${attempt.id}/questions/${q1.id}/answer`,
        { selectedOption: 'C' },
        p1Headers
      );
      assert(false, 'Should not allow saving answer after submission');
    } catch (err) {
      assert(err.response && err.response.status === 409, 'Post-submission answer edit rejected with 409 Conflict');
    }

    // 15. GET Quiz Result Test
    console.log('\n15. Testing GET /api/quiz/attempts/:attemptId/result...');
    const resultRes = await axios.get(`${BASE_URL}/quiz/attempts/${attempt.id}/result`, p1Headers);
    assert(resultRes.data.success === true, 'Result fetched successfully');
    assert(parseFloat(resultRes.data.result.score) === 1.0, 'Result API returns score 1.0');

    // 16. Timer Expiration Test
    console.log('\n16. Testing Expiration Handling on Short Duration Round...');
    const shortRoundRes = await axios.post(`${BASE_URL}/rounds`, {
      title: `Short Expiring Round ${Date.now()}`,
      roundNumber: Math.floor(Math.random() * 8999) + 1000,
      duration: 1,
      totalMarks: 5
    }, adminHeaders);
    const shortRoundId = shortRoundRes.data.round.id;

    await axios.post(`${BASE_URL}/rounds/${shortRoundId}/questions`, {
      questionText: 'Quick question for timer test?',
      optionA: 'Yes',
      optionB: 'No',
      optionC: 'Maybe',
      optionD: 'Never',
      correctOption: 'A',
      marks: 5.0,
      negativeMarks: 0.0,
      questionOrder: 1
    }, adminHeaders);

    await axios.post(`${BASE_URL}/rounds/${shortRoundId}/activate`, {}, adminHeaders);

    const p2Start = await axios.post(`${BASE_URL}/quiz/rounds/${shortRoundId}/start`, {}, p2Headers);
    const p2AttemptId = p2Start.data.attempt.id;

    // Manually force expiry by setting expiresAt in the past via database model require
    const QuizAttempt = require('./server/src/models/QuizAttempt');
    await QuizAttempt.update(
      { expiresAt: new Date(Date.now() - 5000) },
      { where: { id: p2AttemptId } }
    );

    // Now try to save an answer on expired attempt
    try {
      await axios.put(
        `${BASE_URL}/quiz/attempts/${p2AttemptId}/questions/${p2Start.data.questions[0].id}/answer`,
        { selectedOption: 'A' },
        p2Headers
      );
      assert(false, 'Should reject answer on expired attempt');
    } catch (err) {
      assert(err.response && err.response.status === 409, 'Expired attempt answer edit rejected with 409 Conflict');
    }

    const p2Check = await axios.get(`${BASE_URL}/quiz/attempts/${p2AttemptId}`, p2Headers);
    assert(p2Check.data.attempt.status === 'EXPIRED', 'Attempt automatically converted to EXPIRED state upon backend check');

    // 17. Phase 1-4 Regression Checks
    console.log('\n17. Performing Phase 1-4 Regression Verification...');
    const dbHealth = await axios.get(`${BASE_URL}/health/database`);
    assert(dbHealth.data.success === true, 'Phase 1 Database Health API working');

    const adminMe = await axios.get(`${BASE_URL}/auth/admin/me`, adminHeaders);
    assert(adminMe.data.success === true, 'Phase 3 Admin Me API working');

    const participantMe = await axios.get(`${BASE_URL}/auth/participant/me`, p1Headers);
    assert(participantMe.data.success === true, 'Phase 2 Participant Me API working');

    console.log('\n====================================================');
    console.log(`📊 FINAL TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================');

    if (failed === 0) {
      console.log('\n🎉 ALL PHASE 5 PARTICIPANT QUIZ ENGINE TESTS PASSED PERFECTLY!');
    } else {
      console.error(`\n⚠️ ${failed} tests failed.`);
      process.exit(1);
    }
  } catch (error) {
    console.error('Fatal error running tests:', error.response?.data || error.message);
    process.exit(1);
  }
}

runPhase5Tests();
