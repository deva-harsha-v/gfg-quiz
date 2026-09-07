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

const testRoundIds = [
  '93ae36d3-7ca9-459f-b160-9e7403983407',
  '0ba176f4-d753-4006-b1c4-b50b95722e10',
  '252e51e4-4788-4136-b166-a276e1c2a186',
  'f5e9686d-1549-4412-a723-9509fbf51e80',
  'fe53316f-3fdd-4540-882f-fc879426b582',
  'ecfd1d77-ee8a-4103-af82-eba0bf1dcdf8',
  'c7f594c6-9637-4cae-b8ac-5e495717191f',
  '4d20f4a5-45a9-4c3e-9640-9580e7c66e58',
  'fdb8d119-d09e-4456-bf41-c2b577dca0aa',
  'e694ca2a-bb47-4d55-88d6-000a25536a8e',
  'b7a80a58-4267-4724-a65e-2dec006f8e5d',
  '9d8e451d-5ccf-4730-ae3b-9977fe3dba85',
  '7aa4db81-518f-4496-8dc4-8f874bfe23cf',
  '82f1d62e-39dd-4655-abf1-a4ad52651e28',
  'c0af83df-9ffa-4b96-abd8-7d93a7565c1f',
  '0414a12b-1c56-4fd1-9477-b7f3490ae407'
];

async function cleanup() {
  const transaction = await sequelize.transaction();
  try {
    await sequelize.authenticate();
    console.log('Database connection authenticated.');

    console.log('====================================================');
    console.log('🧹 EXECUTING SAFE DATABASE CLEANUP OF TEST ROUNDS');
    console.log('====================================================');

    for (const id of testRoundIds) {
      const round = await QuizRound.findByPk(id, { transaction });
      if (!round) {
        console.log(`⚠️ Round ID ${id} not found, skipping.`);
        continue;
      }

      // Safety check: NEVER delete Round 1, 2, 3, 4, 5
      if ([1, 2, 3, 4, 5].includes(round.roundNumber)) {
        throw new Error(`SAFETY BLOCK: Round ID ${id} is Round ${round.roundNumber} ("${round.title}")! Aborting deletion.`);
      }

      const qCount = await Question.count({ where: { roundId: id }, transaction });
      console.log(`Deleting Test Round ${round.roundNumber}: ID=${id}, Title="${round.title}", Questions=${qCount}`);
      
      await round.destroy({ transaction });
    }

    await transaction.commit();

    console.log('\n====================================================');
    console.log('✅ CLEANUP COMPLETED SUCCESSFULLY');
    console.log('====================================================');

    // Query remaining rounds
    const remainingRounds = await QuizRound.findAll({ order: [['roundNumber', 'ASC']] });
    console.log(`TOTAL REAL COMPETITION ROUNDS REMAINING: ${remainingRounds.length}\n`);

    for (const r of remainingRounds) {
      const qCount = await Question.count({ where: { roundId: r.id } });
      console.log(`Round ${r.roundNumber} (ID: ${r.id}, Title: "${r.title}", Status: ${r.status}): ${qCount} questions`);
    }

  } catch (err) {
    await transaction.rollback();
    console.error('❌ Cleanup failed, changes rolled back:', err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

cleanup();
