require('dotenv').config();
const { QuizRound } = require('../server/src/models');

async function listCodes() {
  const rounds = await QuizRound.findAll({
    attributes: ['id', 'title', 'category', 'course', 'year', 'setNumber', 'accessCode'],
    order: [['category', 'ASC'], ['course', 'ASC'], ['year', 'ASC'], ['setNumber', 'ASC']]
  });

  console.log(`Found ${rounds.length} total quiz rounds:`);
  rounds.slice(0, 10).forEach((r) => {
    console.log(`- ${r.category} | ${r.course} | ${r.year} | SET ${r.setNumber} -> AccessCode: ${r.accessCode}`);
  });
  process.exit(0);
}

listCodes();
