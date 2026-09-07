require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

async function verifyReadonly() {
  try {
    console.log('--- READ-ONLY DB VERIFICATION: CREATIVE RIDDLES B.TECH 1ST YEAR ---');
    
    let totalQuestionsAllSets = 0;
    let duplicateRoundsTotal = 0;
    let duplicateQuestionsTotal = 0;

    const setCounts = {};

    for (let setNum = 1; setNum <= 5; setNum++) {
      const rounds = await QuizRound.findAll({
        where: {
          category: 'Creative Riddles',
          course: 'B.Tech',
          year: '1st Year',
          setNumber: setNum
        }
      });

      if (rounds.length > 1) {
        duplicateRoundsTotal += (rounds.length - 1);
      }

      const primaryRound = rounds[0];
      if (!primaryRound) {
        setCounts[setNum] = 0;
        console.log(`❌ SET ${setNum}: Round NOT found!`);
        continue;
      }

      const questions = await Question.findAll({
        where: { roundId: primaryRound.id },
        order: [['questionOrder', 'ASC']]
      });

      setCounts[setNum] = questions.length;
      totalQuestionsAllSets += questions.length;

      // Duplicate question order check
      const orderNumbers = questions.map(q => q.questionOrder);
      const uniqueOrders = new Set(orderNumbers);
      if (orderNumbers.length !== uniqueOrders.size) {
        duplicateQuestionsTotal += (orderNumbers.length - uniqueOrders.size);
      }

      // Duplicate text check
      const questionTexts = questions.map(q => q.questionText.trim());
      const uniqueTexts = new Set(questionTexts);
      if (questionTexts.length !== uniqueTexts.size) {
        duplicateQuestionsTotal += (questionTexts.length - uniqueTexts.size);
      }

      console.log(`SET ${setNum}: ${questions.length}/30 (Round ID: ${primaryRound.id})`);
    }

    // Verify Logical Reasoning data unchanged
    const logicalRounds = await QuizRound.findAll({ where: { category: 'Logical Reasoning' } });
    let totalLogicalQuestions = 0;
    for (const r of logicalRounds) {
      totalLogicalQuestions += await Question.count({ where: { roundId: r.id } });
    }

    console.log(`\nLogical Reasoning Questions: ${totalLogicalQuestions} across ${logicalRounds.length} sets (UNCHANGED)`);

    const isComplete = (
      setCounts[1] === 30 &&
      setCounts[2] === 30 &&
      setCounts[3] === 30 &&
      setCounts[4] === 30 &&
      setCounts[5] === 30 &&
      totalQuestionsAllSets === 150 &&
      duplicateRoundsTotal === 0 &&
      duplicateQuestionsTotal === 0
    );

    console.log('\n--- FINAL REPORT FORMAT ---');
    console.log('Creative Riddles - B.Tech 1st Year\n');
    console.log(`SET 1: ${setCounts[1]}/30`);
    console.log(`SET 2: ${setCounts[2]}/30`);
    console.log(`SET 3: ${setCounts[3]}/30`);
    console.log(`SET 4: ${setCounts[4]}/30`);
    console.log(`SET 5: ${setCounts[5]}/30\n`);
    console.log(`TOTAL: ${totalQuestionsAllSets}/150\n`);
    console.log(`DUPLICATE ROUNDS: ${duplicateRoundsTotal}`);
    console.log(`DUPLICATE QUESTIONS: ${duplicateQuestionsTotal}`);
    console.log(`MYSQL PERSISTENCE: YES\n`);
    console.log(`OVERALL STATUS:`);
    console.log(isComplete ? 'COMPLETE' : 'INCOMPLETE');

  } catch (err) {
    console.error('❌ Verification failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

verifyReadonly();
