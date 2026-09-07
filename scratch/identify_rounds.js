const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../server/.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach((l) => {
    const idx = l.indexOf('=');
    if (idx !== -1) {
      const k = l.slice(0, idx).trim();
      const v = l.slice(idx + 1).trim();
      if (k && !process.env[k]) process.env[k] = v;
    }
  });
}

const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

async function identify() {
  try {
    await sequelize.authenticate();
    console.log('====================================================');
    console.log('🔍 QUERYING ALL EXISTING QUIZ ROUNDS IN DATABASE');
    console.log('====================================================');

    const rounds = await QuizRound.findAll({
      order: [['roundNumber', 'ASC'], ['createdAt', 'ASC']]
    });

    console.log(`Found total ${rounds.length} rounds in table 'quiz_rounds':\n`);

    const roundList = [];
    for (const r of rounds) {
      const qCount = await Question.count({ where: { roundId: r.id } });
      roundList.push({
        id: r.id,
        roundNumber: r.roundNumber,
        title: r.title,
        description: r.description || '',
        status: r.status,
        questionCount: qCount,
        createdAt: r.createdAt
      });
    }

    console.log(JSON.stringify(roundList, null, 2));

  } catch (err) {
    console.error('Error querying rounds:', err);
  } finally {
    process.exit(0);
  }
}

identify();
