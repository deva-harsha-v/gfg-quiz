require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

async function verifyBtech3rdYearSetup() {
  try {
    await sequelize.authenticate();
    console.log('=== LOGICAL REASONING - B.TECH 3RD YEAR VERIFICATION ===\n');

    const rounds = await QuizRound.findAll({
      order: [['roundNumber', 'ASC']]
    });

    console.log(`Total Quiz Rounds in DB: ${rounds.length} (Expected: 20)`);

    const diplomaRounds = rounds.filter((r) => r.course === 'Diploma' || (r.roundNumber >= 1 && r.roundNumber <= 5));
    const btech1stRounds = rounds.filter(
      (r) => (r.course === 'B.Tech' && r.year === '1st Year') || (r.roundNumber >= 6 && r.roundNumber <= 10)
    );
    const btech2ndRounds = rounds.filter(
      (r) => (r.course === 'B.Tech' && r.year === '2nd Year') || (r.roundNumber >= 11 && r.roundNumber <= 15)
    );
    const btech3rdRounds = rounds.filter(
      (r) => (r.course === 'B.Tech' && r.year === '3rd Year') || (r.roundNumber >= 16 && r.roundNumber <= 20)
    );

    console.log(`\nDiploma 1st Year Rounds: ${diplomaRounds.length}`);
    for (const r of diplomaRounds) {
      const qCount = await Question.count({ where: { roundId: r.id } });
      console.log(`  Set ${r.setNumber || r.roundNumber}: ID=${r.id} | Title="${r.title}" | Status=${r.status} | Questions=${qCount}`);
    }

    console.log(`\nB.Tech 1st Year Rounds: ${btech1stRounds.length}`);
    for (const r of btech1stRounds) {
      const qCount = await Question.count({ where: { roundId: r.id } });
      console.log(`  Set ${r.setNumber || r.roundNumber - 5}: ID=${r.id} | Title="${r.title}" | Status=${r.status} | Questions=${qCount}`);
    }

    console.log(`\nB.Tech 2nd Year Rounds: ${btech2ndRounds.length}`);
    for (const r of btech2ndRounds) {
      const qCount = await Question.count({ where: { roundId: r.id } });
      console.log(`  Set ${r.setNumber}: ID=${r.id} | Title="${r.title}" | Status=${r.status} | Questions=${qCount}`);
    }

    console.log(`\nB.Tech 3rd Year Rounds: ${btech3rdRounds.length}`);
    for (const r of btech3rdRounds) {
      const qCount = await Question.count({ where: { roundId: r.id } });
      console.log(`  Set ${r.setNumber}: ID=${r.id} | Title="${r.title}" | Duration=${r.duration}m | Marks=${r.totalMarks} | Status=${r.status} | Questions=${qCount}`);
    }

    let pass = true;

    if (rounds.length !== 20) {
      console.error(`❌ Total rounds count mismatch! Expected 20, got ${rounds.length}`);
      pass = false;
    }

    if (diplomaRounds.length !== 5 || btech1stRounds.length !== 5 || btech2ndRounds.length !== 5 || btech3rdRounds.length !== 5) {
      console.error(`❌ Category rounds count mismatch!`);
      pass = false;
    }

    for (let i = 0; i < 5; i++) {
      const r = btech3rdRounds[i];
      const setNum = i + 1;
      const expectedTitle = `Logical Reasoning - B.Tech 3rd Year — SET ${setNum}`;
      if (!r || r.title !== expectedTitle || r.duration !== 40 || parseFloat(r.totalMarks) !== 30.0 || r.status !== 'DRAFT') {
        console.error(`❌ B.Tech 3rd Year Set ${setNum} specification mismatch!`, r);
        pass = false;
      }
    }

    if (pass) {
      console.log('\n✅ ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
    } else {
      console.error('\n❌ VERIFICATION FAILED!');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Verification script error:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

verifyBtech3rdYearSetup();
