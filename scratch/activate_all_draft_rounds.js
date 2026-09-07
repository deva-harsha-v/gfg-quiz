require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

async function activateAllDraftRounds() {
  const transaction = await sequelize.transaction();
  try {
    console.log('=== ACTIVATING ALL DRAFT QUIZ ROUNDS ===\n');

    const rounds = await QuizRound.findAll({
      order: [['roundNumber', 'ASC']],
      transaction
    });

    console.log(`Found ${rounds.length} total rounds in DB.\n`);

    let activatedCount = 0;
    let skippedCount = 0;

    for (const r of rounds) {
      if (r.status === 'DRAFT') {
        r.status = 'ACTIVE';
        await r.save({ transaction });
        console.log(`[ACTIVATED] Round #${r.roundNumber.toString().padStart(2, ' ')}: "${r.title}" (Status: DRAFT -> ACTIVE)`);
        activatedCount++;
      } else {
        console.log(`[UNCHANGED] Round #${r.roundNumber.toString().padStart(2, ' ')}: "${r.title}" (Status: ${r.status})`);
        skippedCount++;
      }
    }

    await transaction.commit();

    console.log(`\nActivation complete!`);
    console.log(`Rounds activated: ${activatedCount}`);
    console.log(`Rounds unchanged: ${skippedCount}`);

  } catch (err) {
    await transaction.rollback();
    console.error('❌ Activation failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

activateAllDraftRounds();
