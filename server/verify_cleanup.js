const { Sequelize } = require('sequelize');
require('dotenv').config();

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

async function verifyDB() {
  try {
    await sequelize.authenticate();
    console.log('===================================================================');
    console.log('DATABASE VERIFICATION REPORT - POST CLEANUP');
    console.log('===================================================================');

    // Query all remaining rounds
    const [rounds] = await sequelize.query(`
      SELECT r.id, r.roundNumber, r.title, r.description, r.status, COUNT(q.id) as question_count
      FROM quiz_rounds r
      LEFT JOIN questions q ON r.id = q.roundId
      GROUP BY r.id, r.roundNumber, r.title, r.description, r.status
      ORDER BY r.roundNumber ASC
    `);

    console.log(`\nTOTAL REMAINING ROUNDS IN DATABASE: ${rounds.length}`);
    console.log('-----------------------------------------------------------------------------------');
    rounds.forEach(r => {
      console.log(`Round ${r.roundNumber} | ID: ${r.id} | Title: "${r.title}" | Status: ${r.status} | Question Count: ${r.question_count}`);
    });
    console.log('-----------------------------------------------------------------------------------');

    // Counts
    const [[{ total_questions }]] = await sequelize.query(`SELECT COUNT(*) as total_questions FROM questions`);
    const [[{ total_participants }]] = await sequelize.query(`SELECT COUNT(*) as total_participants FROM participants`);
    const [[{ total_attempts }]] = await sequelize.query(`SELECT COUNT(*) as total_attempts FROM quiz_attempts`);
    const [[{ total_answers }]] = await sequelize.query(`SELECT COUNT(*) as total_answers FROM quiz_answers`);
    const [[{ total_security_events }]] = await sequelize.query(`SELECT COUNT(*) as total_security_events FROM security_events`);

    console.log('\n--- SYSTEM DATA SUMMARY ---');
    console.log(`Total Questions: ${total_questions}`);
    console.log(`Total Student Participants: ${total_participants}`);
    console.log(`Total Quiz Attempts: ${total_attempts}`);
    console.log(`Total Submitted Answers: ${total_answers}`);
    console.log(`Total Security Events: ${total_security_events}`);

    console.log('\n--- VERIFICATION CHECKS ---');
    console.log(`1. EXACTLY 5 REAL COMPETITION ROUNDS: ${rounds.length === 5 ? 'PASSED ✅' : 'FAILED ❌'}`);
    console.log(`2. Round 1 Preserved (2 questions):   ${rounds.find(r => r.roundNumber === 1)?.question_count === 2 ? 'PASSED ✅' : 'FAILED ❌'}`);
    console.log(`3. Round 2 Preserved (30 questions):  ${rounds.find(r => r.roundNumber === 2)?.question_count === 30 ? 'PASSED ✅' : 'FAILED ❌'}`);
    console.log(`4. Round 3 Preserved (30 questions):  ${rounds.find(r => r.roundNumber === 3)?.question_count === 30 ? 'PASSED ✅' : 'FAILED ❌'}`);
    console.log(`5. Round 4 Preserved (30 questions):  ${rounds.find(r => r.roundNumber === 4)?.question_count === 30 ? 'PASSED ✅' : 'FAILED ❌'}`);
    console.log(`6. Round 5 Preserved (0 questions):   ${rounds.find(r => r.roundNumber === 5)?.question_count === 0 ? 'PASSED ✅' : 'FAILED ❌'}`);
    console.log(`7. Total Questions Preserved (92):    ${total_questions === 92 ? 'PASSED ✅' : 'FAILED ❌'}`);
    console.log(`8. Student Participants Intact (44): ${total_participants === 44 ? 'PASSED ✅' : 'FAILED ❌'}`);
    console.log(`9. Quiz Attempts Intact (3):          ${total_attempts === 3 ? 'PASSED ✅' : 'FAILED ❌'}`);
    console.log('===================================================================\n');

  } catch (err) {
    console.error('Verification error:', err);
  } finally {
    await sequelize.close();
  }
}

verifyDB();
