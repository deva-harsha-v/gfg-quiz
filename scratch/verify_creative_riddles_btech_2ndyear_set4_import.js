require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

async function verify() {
  try {
    console.log('=== MYSQL VERIFICATION FOR CREATIVE RIDDLES B.TECH 2ND YEAR SET 4 ===\n');

    // 1. Check target round
    const targetRound = await QuizRound.findOne({
      where: {
        category: 'Creative Riddles',
        course: 'B.Tech',
        year: '2nd Year',
        setNumber: 4
      },
      include: [
        {
          model: Question,
          as: 'questions'
        }
      ]
    });

    if (!targetRound) {
      console.error('ERROR: Target round not found!');
      process.exit(1);
    }

    const sortedQuestions = (targetRound.questions || []).sort((a, b) => a.questionOrder - b.questionOrder);

    console.log(`Target Round Found:`);
    console.log(`- ID: ${targetRound.id}`);
    console.log(`- Title: ${targetRound.title}`);
    console.log(`- Category: ${targetRound.category}`);
    console.log(`- Course: ${targetRound.course}`);
    console.log(`- Year: ${targetRound.year}`);
    console.log(`- Set Number: ${targetRound.setNumber}`);
    console.log(`- Status: ${targetRound.status}`);
    console.log(`- Total Questions: ${sortedQuestions.length}\n`);

    // 2. Check question count
    if (sortedQuestions.length !== 30) {
      console.error(`ERROR: Expected 30 questions, found ${sortedQuestions.length}`);
    } else {
      console.log(`[PASS] Question Count = 30`);
    }

    // 3. Check questionOrder and duplicate text
    const orderNumbers = sortedQuestions.map(q => q.questionOrder);
    const uniqueOrders = new Set(orderNumbers);
    const duplicateOrders = orderNumbers.length - uniqueOrders.size;

    const questionTexts = sortedQuestions.map(q => q.questionText.trim());
    const uniqueTexts = new Set(questionTexts);
    const duplicateQuestions = questionTexts.length - uniqueTexts.size;

    console.log(`- Duplicate Question Order Numbers: ${duplicateOrders}`);
    console.log(`- Duplicate Questions Text: ${duplicateQuestions}`);

    if (duplicateOrders === 0 && duplicateQuestions === 0) {
      console.log(`[PASS] Zero duplicates found in SET 4.`);
    } else {
      console.error(`[FAIL] Duplicates detected!`);
    }

    // 4. Check duplicate rounds matching this criteria
    const matchingRounds = await QuizRound.findAll({
      where: {
        category: 'Creative Riddles',
        course: 'B.Tech',
        year: '2nd Year',
        setNumber: 4
      }
    });

    console.log(`- Matching Rounds Count: ${matchingRounds.length}`);
    if (matchingRounds.length === 1) {
      console.log(`[PASS] Duplicate Rounds = 0 (Only 1 target round exists)`);
    } else {
      console.error(`[FAIL] Multiple rounds found for SET 4!`);
    }

    // 5. Verify other B.Tech 2nd Year sets
    console.log('\n--- Checking Other B.Tech 2nd Year Sets ---');
    const btech2ndYrSets = await QuizRound.findAll({
      where: {
        category: 'Creative Riddles',
        course: 'B.Tech',
        year: '2nd Year'
      },
      include: [
        {
          model: Question,
          as: 'questions'
        }
      ],
      order: [['setNumber', 'ASC']]
    });

    for (const r of btech2ndYrSets) {
      console.log(`Set ${r.setNumber} (${r.title}): ${r.questions ? r.questions.length : 0} questions, status: ${r.status}`);
    }

    // 6. Verify total Creative Riddles rounds count
    const totalCreativeRiddlesRounds = await QuizRound.count({
      where: { category: 'Creative Riddles' }
    });
    console.log(`\nTotal Creative Riddles Rounds: ${totalCreativeRiddlesRounds}`);

    // 7. Verify Logical Reasoning total questions
    const lrRounds = await QuizRound.findAll({
      where: { category: 'Logical Reasoning' },
      include: [{ model: Question, as: 'questions' }]
    });
    const totalLrQuestions = lrRounds.reduce((acc, r) => acc + (r.questions ? r.questions.length : 0), 0);
    console.log(`Total Logical Reasoning Questions across ${lrRounds.length} rounds: ${totalLrQuestions}`);

    console.log('\n=== VERIFICATION COMPLETE ===');
  } catch (err) {
    console.error('Verification failed with error:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

verify();
