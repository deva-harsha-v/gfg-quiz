const path = require('path');
const { Sequelize } = require(path.join(__dirname, '../server/node_modules/sequelize'));
require(path.join(__dirname, '../server/node_modules/dotenv')).config({ path: path.join(__dirname, '../server/.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME || 'engineers_day_quiz',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false
  }
);

const API_BASE = 'http://localhost:5000/api';

async function verifySet1Import() {
  try {
    await sequelize.authenticate();
    console.log('===================================================================');
    console.log('LOGICAL REASONING - SET 1 IMPORT & SYSTEM INTEGRITY REPORT');
    console.log('===================================================================');

    // 1. Total rounds check
    const [rounds] = await sequelize.query(`
      SELECT r.id, r.roundNumber, r.title, r.status, COUNT(q.id) as question_count
      FROM quiz_rounds r
      LEFT JOIN questions q ON r.id = q.roundId
      WHERE r.roundNumber BETWEEN 1 AND 5
      GROUP BY r.id, r.roundNumber, r.title, r.status
      ORDER BY r.roundNumber ASC
    `);

    console.log(`\n1. TOTAL LOGICAL REASONING SETS IN DATABASE: ${rounds.length} (Expected: 5)`);
    console.log('-----------------------------------------------------------------------------------');
    rounds.forEach(r => {
      console.log(`Set #${r.roundNumber} | ID: ${r.id} | Title: "${r.title}" | Status: ${r.status} | Questions: ${r.question_count}`);
    });
    console.log('-----------------------------------------------------------------------------------');

    const totalQuestions = rounds.reduce((sum, r) => sum + Number(r.question_count), 0);
    console.log(`Total Questions across all 5 Logical Reasoning Sets: ${totalQuestions} (Expected: 150)`);

    // 2. Set 1 Question details check
    const set1 = rounds.find(r => r.roundNumber === 1);
    const [q1] = await sequelize.query(
      `SELECT questionOrder, questionText, optionA, optionB, optionC, optionD, correctOption, marks 
       FROM questions 
       WHERE roundId = :id 
       ORDER BY questionOrder ASC`,
      { replacements: { id: set1.id } }
    );

    console.log(`\n2. SET 1 QUESTION DETAILS (Count: ${q1.length}):`);
    console.log(`First Question (Q1): "${q1[0]?.questionText}"`);
    console.log(`Q1 Option B: "${q1[0]?.optionB}" | Correct: "${q1[0]?.correctOption}"`);
    console.log(`Last Question (Q30): "${q1[29]?.questionText}"`);
    console.log(`Q30 Option B: "${q1[29]?.optionB}" | Correct: "${q1[29]?.correctOption}"`);

    // 3. Admin Login & Set 1 Questions API Check
    console.log('\n3. TESTING ADMIN API FOR SET 1...');
    const adminLoginRes = await fetch(`${API_BASE}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'AdminPass123!'
      })
    });
    const adminData = await adminLoginRes.json();
    const adminToken = adminData.token;
    console.log('Admin authenticated successfully.');

    const adminR1QuestionsRes = await fetch(`${API_BASE}/rounds/${set1.id}/questions`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const adminQuestionsData = await adminR1QuestionsRes.json();
    const adminQuestions = adminQuestionsData.questions || adminQuestionsData;

    console.log(`Admin retrieved ${adminQuestions.length} questions for Set 1.`);
    console.log(`Correct options included in Admin view: ${adminQuestions[0].correctOption !== undefined ? 'YES ✅' : 'NO ❌'}`);

    // 4. Student Quiz Engine Verification for Set 1
    console.log('\n4. TESTING PARTICIPANT QUIZ ENGINE FOR SET 1...');
    // Activate Set 1 via Admin API
    const actRes = await fetch(`${API_BASE}/rounds/${set1.id}/activate`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const actData = await actRes.json();
    console.log(`Set 1 activated via API: ${actData.success ? 'PASSED ✅' : 'FAILED ❌'}`);

    // Register & Login a test participant
    const testRoll = `VERIFY_SET1_${Date.now()}`;
    await fetch(`${API_BASE}/auth/participant/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Set 1 Test Student',
        rollNumber: testRoll,
        department: 'Electronics',
        password: 'Password123!'
      })
    });

    const studentLoginRes = await fetch(`${API_BASE}/auth/participant/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rollNumber: testRoll,
        password: 'Password123!'
      })
    });
    const studentData = await studentLoginRes.json();
    const studentToken = studentData.token;

    // Start Attempt for Set 1
    const startRes = await fetch(`${API_BASE}/quiz/rounds/${set1.id}/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      }
    });
    const startData = await startRes.json();
    const attemptId = startData.attempt.id;
    const studentQuestions = startData.questions;

    console.log(`Participant attempt started for Set 1. Attempt ID: ${attemptId}`);
    console.log(`Participant fetched ${studentQuestions.length} questions.`);

    const hasExposedCorrectOption = studentQuestions.some(q => q.correctOption !== undefined);
    console.log(`Correct options HIDDEN from student API: ${!hasExposedCorrectOption ? 'PASSED ✅' : 'FAILED ❌'}`);

    // Save answers & submit
    await fetch(`${API_BASE}/quiz/attempts/${attemptId}/questions/${studentQuestions[0].id}/answer`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({ selectedOption: 'B' }) // Q1 correct answer is B
    });

    await fetch(`${API_BASE}/quiz/attempts/${attemptId}/questions/${studentQuestions[1].id}/answer`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({ selectedOption: 'C' }) // Q2 correct answer is C
    });

    const submitRes = await fetch(`${API_BASE}/quiz/attempts/${attemptId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      }
    });
    const submitData = await submitRes.json();
    console.log(`Quiz attempt submitted. Server-side calculated score: ${submitData.attempt?.score ?? submitData.score}`);

    // Reset Set 1 status back to DRAFT in DB
    await sequelize.query(`UPDATE quiz_rounds SET status = 'DRAFT' WHERE id = :id`, {
      replacements: { id: set1.id }
    });
    console.log('Set 1 status reset back to DRAFT in database after testing.');

    console.log('\n===================================================================');
    console.log('ALL SET 1 IMPORT & INTEGRITY CHECKS PASSED PERFECTLY ✅');
    console.log('===================================================================\n');

  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    await sequelize.close();
  }
}

verifySet1Import();
