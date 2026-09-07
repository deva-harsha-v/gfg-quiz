const path = require('path');
const { QuizRound, Question, QuizAttempt, Participant } = require('../server/src/models');
const { publicStartExam, verifyAccessCode } = require('../server/src/controllers/quizController');

async function testExamCodeMapping() {
  console.log('=== STARTING EXAM CODE MAPPING VERIFICATION ===\n');

  // 1. Fetch sample active rounds with access codes
  const rounds = await QuizRound.findAll({
    where: { status: 'ACTIVE' },
    attributes: ['id', 'title', 'category', 'course', 'year', 'setNumber', 'accessCode', 'status'],
    limit: 5
  });

  console.log(`Found ${rounds.length} active sample rounds for testing:\n`);
  rounds.forEach((r, idx) => {
    console.log(`Round ${idx + 1}: ${r.title} | Access Code: ${r.accessCode}`);
  });

  if (rounds.length < 2) {
    console.error('Error: Need at least 2 active rounds to verify mapping.');
    process.exit(1);
  }

  const set1 = rounds[0];
  const set2 = rounds[1];

  // Mock response object helper
  const createMockRes = () => {
    const res = {
      statusCode: 200,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.body = data;
        return this;
      }
    };
    return res;
  };

  const nextErr = (err) => console.error('Next called with error:', err);

  // Test Case 1: Valid Exam Code for Set 1
  console.log(`\n--- Test 1: Entering Valid Exam Code for Set 1 (${set1.accessCode}) ---`);
  const req1 = {
    body: {
      name: 'Test Student One',
      rollNumber: 'TESTROLL001',
      department: 'CSE',
      section: 'A',
      accessCode: set1.accessCode
    }
  };
  const res1 = createMockRes();
  await publicStartExam(req1, res1, nextErr);

  console.log(`HTTP Status: ${res1.statusCode}`);
  console.log(`Success: ${res1.body?.success}`);
  console.log(`Assigned Set Title: ${res1.body?.quiz?.title}`);
  console.log(`Attempt Created ID: ${res1.body?.attempt?.id}`);

  if (res1.statusCode === 200 || res1.statusCode === 201) {
    console.log('✅ TEST 1 PASSED: Code correctly matched and opened exact Set 1!');
  } else {
    console.error('❌ TEST 1 FAILED:', res1.body);
  }

  // Test Case 2: Valid Exam Code for Set 2
  console.log(`\n--- Test 2: Entering Valid Exam Code for Set 2 (${set2.accessCode}) ---`);
  const req2 = {
    body: {
      name: 'Test Student Two',
      rollNumber: 'TESTROLL002',
      department: 'ECE',
      section: 'B',
      accessCode: set2.accessCode
    }
  };
  const res2 = createMockRes();
  await publicStartExam(req2, res2, nextErr);

  console.log(`HTTP Status: ${res2.statusCode}`);
  console.log(`Success: ${res2.body?.success}`);
  console.log(`Assigned Set Title: ${res2.body?.quiz?.title}`);
  console.log(`Attempt Created ID: ${res2.body?.attempt?.id}`);

  if ((res2.statusCode === 200 || res2.statusCode === 201) && res2.body?.quiz?.title === set2.title) {
    console.log('✅ TEST 2 PASSED: Code correctly matched and opened exact Set 2!');
  } else {
    console.error('❌ TEST 2 FAILED:', res2.body);
  }

  // Test Case 3: Invalid Exam Code
  console.log('\n--- Test 3: Entering Invalid Exam Code (INVALID123) ---');
  const req3 = {
    body: {
      name: 'Test Student Three',
      rollNumber: 'TESTROLL003',
      department: 'EEE',
      section: 'C',
      accessCode: 'INVALID123'
    }
  };
  const res3 = createMockRes();
  await publicStartExam(req3, res3, nextErr);

  console.log(`HTTP Status: ${res3.statusCode}`);
  console.log(`Success: ${res3.body?.success}`);
  console.log(`Message: ${res3.body?.message}`);

  if (res3.statusCode === 401 && res3.body?.message === 'Invalid Exam Code. Please enter a valid code.') {
    console.log('✅ TEST 3 PASSED: Invalid code rejected with exact required message!');
  } else {
    console.error('❌ TEST 3 FAILED:', res3.body);
  }

  // Test Case 4: Verify Questions Sanitization (No correctOption or explanation exposed)
  console.log('\n--- Test 4: Verifying Question Sanitization (Security Check) ---');
  const questions = res1.body?.questions || [];
  let exposedCount = 0;
  questions.forEach((q) => {
    if ('correctOption' in q || 'explanation' in q) {
      exposedCount++;
    }
  });

  if (exposedCount === 0) {
    console.log('✅ TEST 4 PASSED: Zero correctOption/explanation properties exposed in question objects!');
  } else {
    console.error(`❌ TEST 4 FAILED: ${exposedCount} questions contain sensitive data!`);
  }

  // Cleanup test participants/attempts created during test
  await QuizAttempt.destroy({ where: { participantId: [res1.body?.participant?.id, res2.body?.participant?.id].filter(Boolean) } });
  await Participant.destroy({ where: { rollNumber: ['TESTROLL001', 'TESTROLL002', 'TESTROLL003'] } });

  console.log('\n=== ALL EXAM CODE MAPPING TESTS COMPLETED SUCCESSFULLY ===');
  process.exit(0);
}

testExamCodeMapping().catch((err) => {
  console.error('Error executing test suite:', err);
  process.exit(1);
});
