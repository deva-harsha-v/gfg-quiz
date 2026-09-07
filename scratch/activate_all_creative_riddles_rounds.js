require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

async function activateAllCreativeRiddles() {
  const transaction = await sequelize.transaction();
  try {
    console.log('=== PRE-ACTIVATION MYSQL INSPECTION ===\n');

    const rounds = await QuizRound.findAll({
      where: { category: 'Creative Riddles' },
      include: [{ model: Question, as: 'questions' }],
      order: [['course', 'ASC'], ['year', 'ASC'], ['setNumber', 'ASC']],
      transaction
    });

    console.log(`Found ${rounds.length} Creative Riddles rounds in DB.`);

    if (rounds.length !== 20) {
      throw new Error(`Expected 20 rounds, found ${rounds.length}`);
    }

    // Check unique set keys
    const setKeys = new Set();
    for (const r of rounds) {
      const qCount = r.questions ? r.questions.length : 0;
      console.log(`- ${r.title} | Category: ${r.category} | Status: ${r.status} | Questions: ${qCount}`);

      if (qCount !== 30) {
        throw new Error(`Round ${r.title} has ${qCount} questions, expected 30.`);
      }

      const key = `${r.category}-${r.course}-${r.year}-${r.setNumber}`;
      if (setKeys.has(key)) {
        throw new Error(`Duplicate round detected for key: ${key}`);
      }
      setKeys.add(key);
    }

    console.log('\nAll pre-activation checks passed! Updating status to ACTIVE...\n');

    let updatedCount = 0;
    for (const r of rounds) {
      r.status = 'ACTIVE';
      await r.save({ transaction });
      updatedCount++;
    }

    await transaction.commit();
    console.log(`Successfully updated ${updatedCount} Creative Riddles rounds to ACTIVE!\n`);
  } catch (err) {
    await transaction.rollback();
    console.error('Activation failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

activateAllCreativeRiddles();
