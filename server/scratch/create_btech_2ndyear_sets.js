require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

async function createBtech2ndYearSets() {
  const transaction = await sequelize.transaction();
  try {
    console.log('=== CREATING LOGICAL REASONING - B.TECH 2ND YEAR SETS ===');

    const setsToCreate = [
      { roundNumber: 11, setNumber: 1, title: 'Logical Reasoning - B.Tech 2nd Year — SET 1' },
      { roundNumber: 12, setNumber: 2, title: 'Logical Reasoning - B.Tech 2nd Year — SET 2' },
      { roundNumber: 13, setNumber: 3, title: 'Logical Reasoning - B.Tech 2nd Year — SET 3' },
      { roundNumber: 14, setNumber: 4, title: 'Logical Reasoning - B.Tech 2nd Year — SET 4' },
      { roundNumber: 15, setNumber: 5, title: 'Logical Reasoning - B.Tech 2nd Year — SET 5' }
    ];

    for (const setInfo of setsToCreate) {
      const existing = await QuizRound.findOne({
        where: { roundNumber: setInfo.roundNumber },
        transaction
      });

      if (existing) {
        console.log(`[EXISTS] Round #${setInfo.roundNumber}: "${existing.title}" already exists (ID: ${existing.id}).`);
      } else {
        const created = await QuizRound.create(
          {
            title: setInfo.title,
            category: 'Logical Reasoning',
            course: 'B.Tech',
            year: '2nd Year',
            setNumber: setInfo.setNumber,
            roundNumber: setInfo.roundNumber,
            duration: 40,
            totalMarks: 30.0,
            status: 'DRAFT'
          },
          { transaction }
        );
        console.log(`[CREATED] Round #${created.roundNumber}: "${created.title}" (ID: ${created.id}).`);
      }
    }

    await transaction.commit();
    console.log('✅ Successfully processed B.Tech 2nd Year sets.');
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Error creating B.Tech 2nd Year sets:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

createBtech2ndYearSets();
