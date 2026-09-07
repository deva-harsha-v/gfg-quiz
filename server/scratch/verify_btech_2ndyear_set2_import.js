require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

async function verifySet2Import() {
  try {
    await sequelize.authenticate();
    console.log('=== VERIFYING LOGICAL REASONING - B.TECH 2ND YEAR SET 2 ===\n');

    const rounds = await QuizRound.findAll({ order: [['roundNumber', 'ASC']] });
    console.log(`Total Rounds in DB: ${rounds.length} (Expected: 15)`);

    const set1 = rounds.find(r => r.roundNumber === 11 || r.title.includes('B.Tech 2nd Year — SET 1'));
    const set2 = rounds.find(r => r.roundNumber === 12 || r.title.includes('B.Tech 2nd Year — SET 2'));

    if (!set1 || !set2) {
      console.error('❌ B.Tech 2nd Year SET 1 or SET 2 round not found!');
      process.exit(1);
    }

    const set1Count = await Question.count({ where: { roundId: set1.id } });
    const set2Questions = await Question.findAll({
      where: { roundId: set2.id },
      order: [['questionOrder', 'ASC']]
    });

    console.log(`B.Tech 2nd Year SET 1 Question Count: ${set1Count} (Expected: 30)`);
    console.log(`B.Tech 2nd Year SET 2 Question Count: ${set2Questions.length} (Expected: 30)`);

    let pass = true;

    if (set1Count !== 30) {
      console.error(`❌ SET 1 question count changed! Got ${set1Count}`);
      pass = false;
    }

    if (set2Questions.length !== 30) {
      console.error(`❌ Expected 30 questions in B.Tech 2nd Year SET 2, found ${set2Questions.length}`);
      pass = false;
    }

    // Verify ordering Q1-Q30 & non-null correctOption
    for (let i = 1; i <= 30; i++) {
      const q = set2Questions.find(item => item.questionOrder === i);
      if (!q) {
        console.error(`❌ Missing Question Q${i}`);
        pass = false;
      } else if (!q.optionA || !q.optionB || !q.optionC || !q.optionD || !['A', 'B', 'C', 'D'].includes(q.correctOption)) {
        console.error(`❌ Question Q${i} has invalid options or correctOption:`, q.correctOption);
        pass = false;
      }
    }

    // Check non-modification of other rounds
    const diplomaRounds = rounds.filter(r => r.course === 'Diploma' || r.roundNumber <= 5);
    for (const r of diplomaRounds) {
      const cnt = await Question.count({ where: { roundId: r.id } });
      if (cnt !== 30) {
        console.error(`❌ Diploma Round ${r.roundNumber} count modified! Expected 30, got ${cnt}`);
        pass = false;
      }
    }

    const btech1stRounds = rounds.filter(r => (r.course === 'B.Tech' && r.year === '1st Year') || (r.roundNumber >= 6 && r.roundNumber <= 10));
    for (const r of btech1stRounds) {
      const cnt = await Question.count({ where: { roundId: r.id } });
      if (cnt !== 30) {
        console.error(`❌ B.Tech 1st Year Round ${r.roundNumber} count modified! Expected 30, got ${cnt}`);
        pass = false;
      }
    }

    if (pass) {
      console.log('\n✅ ALL VERIFICATION CHECKS PASSED PERFECTLY!');
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

verifySet2Import();
