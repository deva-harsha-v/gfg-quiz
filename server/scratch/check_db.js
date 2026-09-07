const fs = require('fs');
const path = require('path');

// Parse .env manually
const envPath = path.join(__dirname, '../server/.env');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.strip ? line.strip() : line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        process.env[key] = val;
      }
    }
  }
}

const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

async function check() {
  try {
    await sequelize.authenticate();
    console.log('DB Connection OK');
    const rounds = await QuizRound.findAll({ order: [['roundNumber', 'ASC']] });
    console.log('Rounds count:', rounds.length);
    for (const r of rounds) {
      const qCount = await Question.count({ where: { roundId: r.id } });
      console.log(`Round ${r.roundNumber} (ID: ${r.id}, Title: "${r.title}", Status: ${r.status}): ${qCount} questions`);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}
check();
