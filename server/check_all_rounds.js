require('dotenv').config();
const { QuizRound } = require('./src/models');
const { sequelize } = require('./src/config/database');

async function checkAllRounds() {
  try {
    await sequelize.authenticate();
    const rounds = await QuizRound.findAll({
      order: [['roundNumber', 'ASC']]
    });
    console.log('=== ALL QUIZ ROUNDS IN DB ===');
    rounds.forEach(r => {
      console.log(`ID: ${r.id} | Round#: ${r.roundNumber} | Title: "${r.title}" | Status: ${r.status} | Marks: ${r.totalMarks}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

checkAllRounds();
