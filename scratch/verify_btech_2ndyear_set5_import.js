require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

async function verifySet5Import() {
  try {
    await sequelize.authenticate();
    console.log('=== FULL PLATFORM VERIFICATION — ALL 15 COMPETITION SETS ===\n');

    const rounds = await QuizRound.findAll({ order: [['roundNumber', 'ASC']] });
    console.log(`Total Rounds in DB: ${rounds.length} (Expected: 15)`);

    let pass = true;

    if (rounds.length !== 15) {
      console.error(`❌ Expected 15 rounds, found ${rounds.length}`);
      pass = false;
    }

    const categories = {
      'Diploma 1st Year': rounds.filter(r => r.course === 'Diploma' || r.roundNumber <= 5),
      'B.Tech 1st Year': rounds.filter(r => (r.course === 'B.Tech' && r.year === '1st Year') || (r.roundNumber >= 6 && r.roundNumber <= 10)),
      'B.Tech 2nd Year': rounds.filter(r => (r.course === 'B.Tech' && r.year === '2nd Year') || (r.roundNumber >= 11 && r.roundNumber <= 15))
    };

    let grandTotalQuestions = 0;

    for (const [catName, catRounds] of Object.entries(categories)) {
      console.log(`\nCategory: ${catName} (${catRounds.length} sets):`);
      if (catRounds.length !== 5) {
        console.error(`❌ Expected 5 rounds in ${catName}, found ${catRounds.length}`);
        pass = false;
      }
      for (const r of catRounds) {
        const questions = await Question.findAll({
          where: { roundId: r.id },
          order: [['questionOrder', 'ASC']]
        });
        grandTotalQuestions += questions.length;
        console.log(`  Set ${r.setNumber || r.roundNumber} (Round #${r.roundNumber}): "${r.title}" | Status: ${r.status} | Questions: ${questions.length}`);
        
        if (questions.length !== 30) {
          console.error(`❌ Expected 30 questions in ${r.title}, found ${questions.length}`);
          pass = false;
        }

        // Verify options and correctOption
        for (let i = 1; i <= questions.length; i++) {
          const q = questions.find(item => item.questionOrder === i);
          if (!q) {
            console.error(`❌ Missing Question Q${i} in ${r.title}`);
            pass = false;
          } else if (!q.optionA || !q.optionB || !q.optionC || !q.optionD || !['A', 'B', 'C', 'D'].includes(q.correctOption)) {
            console.error(`❌ Question Q${i} in ${r.title} has invalid options or correctOption:`, q.correctOption);
            pass = false;
          }
        }
      }
    }

    console.log(`\nGrand Total Questions Across Platform: ${grandTotalQuestions} (Expected: 450)`);

    if (grandTotalQuestions !== 450) {
      console.error(`❌ Grand total questions mismatch! Expected 450, got ${grandTotalQuestions}`);
      pass = false;
    }

    if (pass) {
      console.log('\n✅ ALL PLATFORM VERIFICATION CHECKS PASSED PERFECTLY!');
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

verifySet5Import();
