require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

async function createBtech3rdYearSets() {
  const transaction = await sequelize.transaction();
  try {
    console.log('=== CREATING LOGICAL REASONING - B.TECH 3RD YEAR SETS ===');

    const setsToCreate = [
      { roundNumber: 16, setNumber: 1, title: 'Logical Reasoning - B.Tech 3rd Year — SET 1' },
      { roundNumber: 17, setNumber: 2, title: 'Logical Reasoning - B.Tech 3rd Year — SET 2' },
      { roundNumber: 18, setNumber: 3, title: 'Logical Reasoning - B.Tech 3rd Year — SET 3' },
      { roundNumber: 19, setNumber: 4, title: 'Logical Reasoning - B.Tech 3rd Year — SET 4' },
      { roundNumber: 20, setNumber: 5, title: 'Logical Reasoning - B.Tech 3rd Year — SET 5' }
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
            year: '3rd Year',
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
    console.log('✅ Successfully processed B.Tech 3rd Year sets.');
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Error creating B.Tech 3rd Year sets:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

createBtech3rdYearSets();
