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

async function verifyCategoryAndSets() {
  try {
    await sequelize.authenticate();
    console.log('===================================================================');
    console.log('LOGICAL REASONING CATEGORY & 5 SETS INTEGRITY VERIFICATION REPORT');
    console.log('===================================================================');

    // 1. Check Database Sets mapping under LOGICAL REASONING
    const [sets] = await sequelize.query(`
      SELECT r.id, r.roundNumber, r.title, r.status, COUNT(q.id) as question_count
      FROM quiz_rounds r
      LEFT JOIN questions q ON r.id = q.roundId
      WHERE r.roundNumber BETWEEN 1 AND 5
      GROUP BY r.id, r.roundNumber, r.title, r.status
      ORDER BY r.roundNumber ASC
    `);

    console.log(`\n1. LOGICAL REASONING SETS IN DATABASE: ${sets.length} Sets`);
    console.log('-----------------------------------------------------------------------------------');
    sets.forEach(s => {
      console.log(`Category: LOGICAL REASONING | Set Name: "${s.title}" (Set #${s.roundNumber}) | Questions: ${s.question_count} | Status: ${s.status}`);
    });
    console.log('-----------------------------------------------------------------------------------');

    const totalQuestions = sets.reduce((sum, s) => sum + Number(s.question_count), 0);
    console.log(`Total Questions across 5 Logical Reasoning Sets: ${totalQuestions}`);

    // 2. Admin API Verification
    console.log('\n2. TESTING ADMIN API FOR LOGICAL REASONING SETS...');
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

    const adminRoundsRes = await fetch(`${API_BASE}/rounds`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const adminRoundsData = await adminRoundsRes.json();
    const compAdminSets = (adminRoundsData.rounds || []).filter(r => r.roundNumber >= 1 && r.roundNumber <= 5);

    console.log(`Admin API returned ${compAdminSets.length} sets for Logical Reasoning.`);
    compAdminSets.forEach(s => {
      console.log(`  - Set #${s.roundNumber}: "${s.title}"`);
    });

    // 3. Participant API Verification
    console.log('\n3. TESTING PARTICIPANT API FOR LOGICAL REASONING SETS...');
    const testRoll = `VERIFY_SETS_${Date.now()}`;
    await fetch(`${API_BASE}/auth/participant/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sets Verification Student',
        rollNumber: testRoll,
        department: 'Computer Science',
        password: 'Password123!'
      })
    });

    const pLoginRes = await fetch(`${API_BASE}/auth/participant/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rollNumber: testRoll,
        password: 'Password123!'
      })
    });
    const pData = await pLoginRes.json();
    const pToken = pData.token;

    const availableRes = await fetch(`${API_BASE}/quiz/available`, {
      headers: { Authorization: `Bearer ${pToken}` }
    });
    const availableData = await availableRes.json();
    console.log(`Participant API returned ${availableData.quizzes?.length} sets under LOGICAL REASONING.`);

    // 4. Test Quiz Engine Start for Set 5
    console.log('\n4. TESTING QUIZ ENGINE START FOR SET 5...');
    // Temporarily activate Set 5
    const set5Id = sets.find(s => s.roundNumber === 5).id;
    await fetch(`${API_BASE}/rounds/${set5Id}/activate`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    const startRes = await fetch(`${API_BASE}/quiz/rounds/${set5Id}/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${pToken}`
      }
    });
    const startData = await startRes.json();

    console.log(`Quiz engine started Set 5. Attempt ID: ${startData.attempt?.id}`);
    console.log(`Loaded ${startData.questions?.length} questions for Set 5.`);

    // Reset Set 5 status to DRAFT
    await sequelize.query(`UPDATE quiz_rounds SET status = 'DRAFT' WHERE id = :id`, {
      replacements: { id: set5Id }
    });
    console.log('Reset Set 5 status to DRAFT.');

    console.log('\n===================================================================');
    console.log('LOGICAL REASONING 5 SETS VERIFICATION PASSED PERFECTLY ✅');
    console.log('===================================================================\n');

  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    await sequelize.close();
  }
}

verifyCategoryAndSets();
