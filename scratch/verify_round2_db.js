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

const { sequelize } = require('../server/src/config/database');

async function verify() {
  const [results] = await sequelize.query(`
    SELECT
      questionOrder,
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
      marks,
      negativeMarks,
      roundId
    FROM questions
    WHERE roundId = '252d32d6-3796-4827-94ac-1b67fcba131a'
    ORDER BY questionOrder ASC;
  `);

  console.log(`Total Round 2 Questions Queried: ${results.length}`);
  console.log('----------------------------------------------------');
  results.forEach(q => {
    console.log(`Order ${q.questionOrder}: ${q.questionText.slice(0, 50)}... | Correct: ${q.correctOption}`);
  });
  process.exit(0);
}

verify();
