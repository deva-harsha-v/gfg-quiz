require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const creativeRiddlesRounds = [
  // Creative Riddles - 1st Year Diploma (SET 1 to SET 5, roundNumbers 21 to 25)
  { roundNumber: 21, setNumber: 1, title: 'Creative Riddles - 1st Year Diploma — SET 1', category: 'Creative Riddles', course: 'Diploma', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'DRAFT', description: 'Creative Riddles competition set 1 for 1st Year Diploma students.' },
  { roundNumber: 22, setNumber: 2, title: 'Creative Riddles - 1st Year Diploma — SET 2', category: 'Creative Riddles', course: 'Diploma', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'DRAFT', description: 'Creative Riddles competition set 2 for 1st Year Diploma students.' },
  { roundNumber: 23, setNumber: 3, title: 'Creative Riddles - 1st Year Diploma — SET 3', category: 'Creative Riddles', course: 'Diploma', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'DRAFT', description: 'Creative Riddles competition set 3 for 1st Year Diploma students.' },
  { roundNumber: 24, setNumber: 4, title: 'Creative Riddles - 1st Year Diploma — SET 4', category: 'Creative Riddles', course: 'Diploma', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'DRAFT', description: 'Creative Riddles competition set 4 for 1st Year Diploma students.' },
  { roundNumber: 25, setNumber: 5, title: 'Creative Riddles - 1st Year Diploma — SET 5', category: 'Creative Riddles', course: 'Diploma', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'DRAFT', description: 'Creative Riddles competition set 5 for 1st Year Diploma students.' },

  // Creative Riddles - B.Tech 1st Year (SET 1 to SET 5, roundNumbers 26 to 30)
  { roundNumber: 26, setNumber: 1, title: 'Creative Riddles - B.Tech 1st Year — SET 1', category: 'Creative Riddles', course: 'B.Tech', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'DRAFT', description: 'Creative Riddles competition set 1 for B.Tech 1st Year students.' },
  { roundNumber: 27, setNumber: 2, title: 'Creative Riddles - B.Tech 1st Year — SET 2', category: 'Creative Riddles', course: 'B.Tech', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'DRAFT', description: 'Creative Riddles competition set 2 for B.Tech 1st Year students.' },
  { roundNumber: 28, setNumber: 3, title: 'Creative Riddles - B.Tech 1st Year — SET 3', category: 'Creative Riddles', course: 'B.Tech', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'DRAFT', description: 'Creative Riddles competition set 3 for B.Tech 1st Year students.' },
  { roundNumber: 29, setNumber: 4, title: 'Creative Riddles - B.Tech 1st Year — SET 4', category: 'Creative Riddles', course: 'B.Tech', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'DRAFT', description: 'Creative Riddles competition set 4 for B.Tech 1st Year students.' },
  { roundNumber: 30, setNumber: 5, title: 'Creative Riddles - B.Tech 1st Year — SET 5', category: 'Creative Riddles', course: 'B.Tech', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'DRAFT', description: 'Creative Riddles competition set 5 for B.Tech 1st Year students.' },

  // Creative Riddles - B.Tech 2nd Year (SET 1 to SET 5, roundNumbers 31 to 35)
  { roundNumber: 31, setNumber: 1, title: 'Creative Riddles - B.Tech 2nd Year — SET 1', category: 'Creative Riddles', course: 'B.Tech', year: '2nd Year', duration: 40, totalMarks: 30.00, status: 'DRAFT', description: 'Creative Riddles competition set 1 for B.Tech 2nd Year students.' },
  { roundNumber: 32, setNumber: 2, title: 'Creative Riddles - B.Tech 2nd Year — SET 2', category: 'Creative Riddles', course: 'B.Tech', year: '2nd Year', duration: 40, totalMarks: 30.00, status: 'DRAFT', description: 'Creative Riddles competition set 2 for B.Tech 2nd Year students.' },
  { roundNumber: 33, setNumber: 3, title: 'Creative Riddles - B.Tech 2nd Year — SET 3', category: 'Creative Riddles', course: 'B.Tech', year: '2nd Year', duration: 40, totalMarks: 30.00, status: 'DRAFT', description: 'Creative Riddles competition set 3 for B.Tech 2nd Year students.' },
  { roundNumber: 34, setNumber: 4, title: 'Creative Riddles - B.Tech 2nd Year — SET 4', category: 'Creative Riddles', course: 'B.Tech', year: '2nd Year', duration: 40, totalMarks: 30.00, status: 'DRAFT', description: 'Creative Riddles competition set 4 for B.Tech 2nd Year students.' },
  { roundNumber: 35, setNumber: 5, title: 'Creative Riddles - B.Tech 2nd Year — SET 5', category: 'Creative Riddles', course: 'B.Tech', year: '2nd Year', duration: 40, totalMarks: 30.00, status: 'DRAFT', description: 'Creative Riddles competition set 5 for B.Tech 2nd Year students.' },

  // Creative Riddles - B.Tech 3rd Year (SET 1 to SET 5, roundNumbers 36 to 40)
  { roundNumber: 36, setNumber: 1, title: 'Creative Riddles - B.Tech 3rd Year — SET 1', category: 'Creative Riddles', course: 'B.Tech', year: '3rd Year', duration: 40, totalMarks: 30.00, status: 'DRAFT', description: 'Creative Riddles competition set 1 for B.Tech 3rd Year students.' },
  { roundNumber: 37, setNumber: 2, title: 'Creative Riddles - B.Tech 3rd Year — SET 2', category: 'Creative Riddles', course: 'B.Tech', year: '3rd Year', duration: 40, totalMarks: 30.00, status: 'DRAFT', description: 'Creative Riddles competition set 2 for B.Tech 3rd Year students.' },
  { roundNumber: 38, setNumber: 3, title: 'Creative Riddles - B.Tech 3rd Year — SET 3', category: 'Creative Riddles', course: 'B.Tech', year: '3rd Year', duration: 40, totalMarks: 30.00, status: 'DRAFT', description: 'Creative Riddles competition set 3 for B.Tech 3rd Year students.' },
  { roundNumber: 39, setNumber: 4, title: 'Creative Riddles - B.Tech 3rd Year — SET 4', category: 'Creative Riddles', course: 'B.Tech', year: '3rd Year', duration: 40, totalMarks: 30.00, status: 'DRAFT', description: 'Creative Riddles competition set 4 for B.Tech 3rd Year students.' },
  { roundNumber: 40, setNumber: 5, title: 'Creative Riddles - B.Tech 3rd Year — SET 5', category: 'Creative Riddles', course: 'B.Tech', year: '3rd Year', duration: 40, totalMarks: 30.00, status: 'DRAFT', description: 'Creative Riddles competition set 5 for B.Tech 3rd Year students.' }
];

async function seedCreativeRiddlesRounds() {
  const transaction = await sequelize.transaction();
  try {
    let createdCount = 0;
    let existingCount = 0;

    for (const data of creativeRiddlesRounds) {
      const existing = await QuizRound.findOne({
        where: { title: data.title },
        transaction
      });

      if (existing) {
        console.log(`[EXISTS] "${data.title}" already exists (ID: ${existing.id}).`);
        existingCount++;
      } else {
        const created = await QuizRound.create(data, { transaction });
        console.log(`[CREATED] "${created.title}" (Round #${created.roundNumber}, ID: ${created.id})`);
        createdCount++;
      }
    }

    await transaction.commit();
    console.log(`\nCreative Riddles rounds seeding completed!`);
    console.log(`Created: ${createdCount}`);
    console.log(`Already existed: ${existingCount}`);
    console.log(`Total Creative Riddles sets target: 20`);
  } catch (err) {
    await transaction.rollback();
    console.error('❌ Failed to seed Creative Riddles rounds:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

seedCreativeRiddlesRounds();
