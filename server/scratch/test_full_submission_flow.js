const BASE_URL = 'http://localhost:5000/api';

async function testFullSubmissionFlow() {
  try {
    console.log('=== TESTING FULL STUDENT EXAM & SUBMISSION FLOW ===\n');

    // 1. Participant Exam Entry
    console.log('Step 1: Exam Entry / Registration...');
    const entryRes = await fetch(`${BASE_URL}/auth/participant/exam-entry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Student',
        rollNumber: 'TEST12345',
        department: 'CSE',
        section: 'A'
      })
    });
    const entryData = await entryRes.json();
    console.log('✓ Exam Entry Status:', entryRes.status, '| Success:', entryData.success);

    if (!entryData.success) throw new Error(entryData.message);

    const token = entryData.token;
    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // 2. Fetch Available Quizzes
    console.log('\nStep 2: Get Available Quizzes...');
    const availableRes = await fetch(`${BASE_URL}/quiz/available`, { headers: authHeaders });
    const availableData = await availableRes.json();
    console.log(`✓ Total Quizzes Available: ${availableData.quizzes.length}`);

    // Pick active quiz (e.g. Round #16 - B.Tech 3rd Year Set 1)
    const activeQuiz = availableData.quizzes.find(q => q.status === 'ACTIVE' && q.totalQuestions > 0);
    if (!activeQuiz) {
      throw new Error('No active quiz found for testing!');
    }
    console.log(`✓ Picked Active Quiz: "${activeQuiz.title}" (ID: ${activeQuiz.id})`);

    // 3. Start Quiz Attempt
    console.log('\nStep 3: Start Quiz Attempt...');
    const startRes = await fetch(`${BASE_URL}/quiz/rounds/${activeQuiz.id}/start`, {
      method: 'POST',
      headers: authHeaders
    });
    const startData = await startRes.json();
    console.log('✓ Start Quiz Status:', startRes.status, '| Success:', startData.success);

    if (!startData.success) throw new Error(startData.message);

    const attempt = startData.attempt;
    const questions = startData.questions;
    console.log(`✓ Attempt ID: ${attempt.id} | Total Questions Received: ${questions.length}`);

    // 4. Save Answer for Q1
    console.log('\nStep 4: Save Answer for Q1...');
    const q1 = questions[0];
    const saveRes = await fetch(`${BASE_URL}/quiz/attempts/${attempt.id}/questions/${q1.id}/answer`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ selectedOption: 'B' })
    });
    const saveData = await saveRes.json();
    console.log('✓ Save Answer Status:', saveRes.status, '| Success:', saveData.success);

    // 5. Submit Quiz
    console.log('\nStep 5: Submit Quiz...');
    const submitRes = await fetch(`${BASE_URL}/quiz/attempts/${attempt.id}/submit`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({})
    });
    const submitData = await submitRes.json();
    console.log('✓ Submit Quiz Status:', submitRes.status, '| Success:', submitData.success);
    console.log('  Result Data:', JSON.stringify(submitData.result, null, 2));

    if (!submitData.success) throw new Error(submitData.message);

    // 6. Get Result
    console.log('\nStep 6: Get Quiz Result...');
    const resultRes = await fetch(`${BASE_URL}/quiz/attempts/${attempt.id}/result`, { headers: authHeaders });
    const resultData = await resultRes.json();
    console.log('✓ Result Response Status:', resultRes.status, '| Success:', resultData.success);
    console.log('  Score:', resultData.result.score, '/', resultData.result.totalMarks);

    console.log('\n=== FULL SUBMISSION FLOW TEST PASSED PERFECTLY! ===');

    // Clean up test attempt & participant from DB
    require('../server/node_modules/dotenv').config({ path: './server/.env' });
    const { QuizAttempt, QuizAnswer, Participant } = require('../server/src/models');
    const { sequelize } = require('../server/src/config/database');
    await QuizAnswer.destroy({ where: { attemptId: attempt.id } });
    await QuizAttempt.destroy({ where: { id: attempt.id } });
    await Participant.destroy({ where: { rollNumber: 'TEST12345' } });
    await sequelize.close();
    console.log('✓ Cleaned up test data.');

  } catch (err) {
    console.error('❌ Test Failed:', err.message);
    process.exit(1);
  }
}

testFullSubmissionFlow();
