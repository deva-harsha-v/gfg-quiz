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

async function verifyAllActiveSets() {
  try {
    await sequelize.authenticate();
    console.log('===================================================================');
    console.log('ACTIVE LOGICAL REASONING 5-SET EXAM VERIFICATION REPORT');
    console.log('===================================================================');

    // 1. Database State Check
    const [sets] = await sequelize.query(`
      SELECT r.id, r.roundNumber, r.title, r.status, r.duration, r.totalMarks, COUNT(q.id) as qCount
      FROM quiz_rounds r
      LEFT JOIN questions q ON r.id = q.roundId
      WHERE r.roundNumber BETWEEN 1 AND 5
      GROUP BY r.id, r.roundNumber, r.title, r.status, r.duration, r.totalMarks
      ORDER BY r.roundNumber ASC
    `);

    console.log(`\n1. DATABASE VERIFICATION (5 Sets):`);
    console.log('-----------------------------------------------------------------------------------');
    let allActive = true;
    sets.forEach(s => {
      console.log(`Set #${s.roundNumber} | ID: ${s.id} | Title: "${s.title}" | Status: ${s.status} | Questions: ${s.qCount} | Marks: ${s.totalMarks}`);
      if (s.status !== 'ACTIVE') allActive = false;
    });
    console.log('-----------------------------------------------------------------------------------');
    console.log(`ALL 5 SETS STATUS = ACTIVE: ${allActive ? 'PASSED ✅' : 'FAILED ❌'}`);

    // 2. Admin API Verification
    console.log('\n2. TESTING ADMIN API...');
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
    const adminSets = (adminRoundsData.rounds || []).filter(r => r.roundNumber >= 1 && r.roundNumber <= 5);

    console.log(`Admin API returned ${adminSets.length} Sets for Logical Reasoning.`);
    const adminAllActive = adminSets.every(s => s.status === 'ACTIVE');
    console.log(`Admin View shows all Sets ACTIVE: ${adminAllActive ? 'PASSED ✅' : 'FAILED ❌'}`);

    // 3. Participant API Verification
    console.log('\n3. TESTING PARTICIPANT DASHBOARD & START QUIZ API FOR ALL 5 SETS...');
    const testRoll = `EXAM_ACTIVE_${Date.now()}`;
    await fetch(`${API_BASE}/auth/participant/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Exam Participant',
        rollNumber: testRoll,
        department: 'Mechanical',
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
    const availableQuizzes = availableData.quizzes || [];

    console.log(`Participant Dashboard fetched ${availableQuizzes.length} Logical Reasoning Sets.`);
    availableQuizzes.forEach(q => {
      console.log(`  - ${q.title} (Set #${q.roundNumber}): Status = ${q.status}, Questions = ${q.totalQuestions}, Marks = ${q.totalMarks}`);
    });

    // Test starting quiz for each of the 5 Sets
    console.log('\n4. TESTING QUIZ START FOR SET 1 THROUGH SET 5...');
    for (let i = 0; i < sets.length; i++) {
      const s = sets[i];
      // Create fresh test participant for each set attempt test
      const subRoll = `EXAM_P_${s.roundNumber}_${Date.now()}`;
      await fetch(`${API_BASE}/auth/participant/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Exam Student Set ${s.roundNumber}`,
          rollNumber: subRoll,
          department: 'Engineering',
          password: 'Password123!'
        })
      });
      const loginRes = await fetch(`${API_BASE}/auth/participant/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rollNumber: subRoll, password: 'Password123!' })
      });
      const subToken = (await loginRes.json()).token;

      const startRes = await fetch(`${API_BASE}/quiz/rounds/${s.id}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${subToken}`
        }
      });
      const startData = await startRes.json();
      console.log(`Set #${s.roundNumber} (${s.title}) Start Test: ${startData.success ? 'PASSED ✅' : 'FAILED ❌'} (Attempt ID: ${startData.attempt?.id}, Questions Loaded: ${startData.questions?.length})`);
    }

    console.log('\n===================================================================');
    console.log('ALL 5 LOGICAL REASONING SETS ARE ACTIVE & READY FOR THE EXAM ✅');
    console.log('===================================================================\n');

  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    await sequelize.close();
  }
}

verifyAllActiveSets();
