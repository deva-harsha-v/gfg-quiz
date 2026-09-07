require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

async function verifyRoundsStatus() {
  try {
    console.log('=== VERIFYING ALL 20 ROUNDS STATUS ===\n');

    const rounds = await QuizRound.findAll({
      order: [['roundNumber', 'ASC']]
    });

    console.log(`Total Rounds in Database: ${rounds.length}\n`);

    let draftCount = 0;
    let activeCount = 0;
    let otherCount = 0;

    for (const r of rounds) {
      const qCount = await Question.count({ where: { roundId: r.id } });
      console.log(`Round #${r.roundNumber.toString().padStart(2, ' ')} | Status: ${r.status.padEnd(8, ' ')} | Qs: ${qCount.toString().padStart(2, ' ')} | Title: "${r.title}"`);
      if (r.status === 'ACTIVE') activeCount++;
      else if (r.status === 'DRAFT') draftCount++;
      else otherCount++;
    }

    console.log(`\nSummary:`);
    console.log(`ACTIVE rounds: ${activeCount}`);
    console.log(`DRAFT rounds: ${draftCount}`);
    console.log(`Other rounds: ${otherCount}`);

  } catch (err) {
    console.error('❌ Verification failed:', err);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

verifyRoundsStatus();
