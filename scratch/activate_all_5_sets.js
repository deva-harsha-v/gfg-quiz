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

async function activateAll5Sets() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // 1. Activate Sets 1 through 5
    await sequelize.query(
      `UPDATE quiz_rounds 
       SET status = 'ACTIVE', startTime = COALESCE(startTime, NOW()) 
       WHERE roundNumber BETWEEN 1 AND 5`
    );

    console.log('Set status to ACTIVE for all 5 competition sets.');

    // 2. Fetch and display updated records
    const [sets] = await sequelize.query(`
      SELECT r.id, r.roundNumber, r.title, r.status, r.duration, r.totalMarks, COUNT(q.id) as questionCount
      FROM quiz_rounds r
      LEFT JOIN questions q ON r.id = q.roundId
      WHERE r.roundNumber BETWEEN 1 AND 5
      GROUP BY r.id, r.roundNumber, r.title, r.status, r.duration, r.totalMarks
      ORDER BY r.roundNumber ASC
    `);

    console.log('\n===================================================================');
    console.log('ACTIVE LOGICAL REASONING COMPETITION SETS REPORT');
    console.log('===================================================================');
    sets.forEach(s => {
      console.log(`Set #${s.roundNumber} | Title: "${s.title}" | Status: ${s.status} | Questions: ${s.questionCount} | Marks: ${s.totalMarks} | Duration: ${s.duration} mins`);
    });
    console.log('===================================================================\n');

  } catch (err) {
    console.error('Activation failed:', err);
  } finally {
    await sequelize.close();
  }
}

activateAll5Sets();
