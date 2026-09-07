require('dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('./server/src/models');

async function verify() {
  try {
    const rounds = await QuizRound.findAll({ order: [['roundNumber', 'ASC']] });
    console.log('=== VERIFYING QUIZ ROUNDS ===');
    console.log(`Total Rounds in Database: ${rounds.length}`);

    const diplomaRounds = rounds.filter((r) => r.course === 'Diploma');
    const btechRounds = rounds.filter((r) => r.course === 'B.Tech');

    console.log(`\nDiploma Rounds Count: ${diplomaRounds.length}`);
    for (const r of diplomaRounds) {
      const qCount = await Question.count({ where: { roundId: r.id } });
      console.log(`- Round #${r.roundNumber} | Set ${r.setNumber} | '${r.title}' | Status: ${r.status} | Questions: ${qCount}`);
    }

    console.log(`\nB.Tech Rounds Count: ${btechRounds.length}`);
    for (const r of btechRounds) {
      const qCount = await Question.count({ where: { roundId: r.id } });
      console.log(`- Round #${r.roundNumber} | Set ${r.setNumber} | '${r.title}' | Status: ${r.status} | Questions: ${qCount}`);
    }

    if (rounds.length === 10 && diplomaRounds.length === 5 && btechRounds.length === 5) {
      console.log('\n✅ VERIFICATION PASSED: Exactly 5 Diploma sets and 5 B.Tech sets exist cleanly!');
    } else {
      console.log('\n❌ VERIFICATION FAILED: Round count discrepancy detected.');
    }
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    process.exit(0);
  }
}

verify();
