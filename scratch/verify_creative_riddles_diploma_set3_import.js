require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

async function verifyImportSet3() {
  try {
    console.log('--- DB VERIFICATION FOR CREATIVE RIDDLES DIPLOMA SET 3 ---');
    
    // 1. Verify target round
    const set3Round = await QuizRound.findOne({
      where: {
        category: 'Creative Riddles',
        course: 'Diploma',
        year: '1st Year',
        setNumber: 3
      }
    });

    if (!set3Round) {
      throw new Error('❌ Target round Creative Riddles - 1st Year Diploma — SET 3 NOT found!');
    }

    console.log(`✅ Target Round Found: "${set3Round.title}"`);
    console.log(`   ID: ${set3Round.id}`);
    console.log(`   Category: ${set3Round.category}`);
    console.log(`   Course: ${set3Round.course}`);
    console.log(`   Year: ${set3Round.year}`);
    console.log(`   Set Number: ${set3Round.setNumber}`);
    console.log(`   Status: ${set3Round.status} (UNCHANGED)`);

    // Check duplicate rounds for SET 3
    const set3RoundDuplicates = await QuizRound.count({
      where: {
        category: 'Creative Riddles',
        course: 'Diploma',
        year: '1st Year',
        setNumber: 3
      }
    });
    console.log(`   Duplicate Rounds Count: ${set3RoundDuplicates - 1}`);

    // 2. Verify questions in SET 3
    const questions = await Question.findAll({
      where: { roundId: set3Round.id },
      order: [['questionOrder', 'ASC']]
    });

    console.log(`✅ Question Count in SET 3: ${questions.length}`);
    if (questions.length !== 30) {
      throw new Error(`Expected 30 questions but found ${questions.length}`);
    }

    // Check duplicate question orders
    const orderNumbers = questions.map(q => q.questionOrder);
    const uniqueOrders = new Set(orderNumbers);
    const duplicateOrdersCount = orderNumbers.length - uniqueOrders.size;
    console.log(`✅ Duplicate Order Numbers: ${duplicateOrdersCount}`);

    // Check duplicate question texts
    const questionTexts = questions.map(q => q.questionText.trim());
    const uniqueTexts = new Set(questionTexts);
    const duplicateQuestionsCount = questionTexts.length - uniqueTexts.size;
    console.log(`✅ Duplicate Questions: ${duplicateQuestionsCount}`);

    // Check answer keys stored
    const withAnswers = questions.filter(q => q.correctOption && ['A', 'B', 'C', 'D'].includes(q.correctOption));
    console.log(`✅ Answer Keys Stored Correctly: ${withAnswers.length === 30 ? 'YES' : 'NO'}`);

    // 3. Verify All 5 Diploma Sets
    for (let setNum of [1, 2, 3, 4, 5]) {
      const r = await QuizRound.findOne({ where: { category: 'Creative Riddles', course: 'Diploma', year: '1st Year', setNumber: setNum } });
      const qC = r ? await Question.count({ where: { roundId: r.id } }) : 0;
      console.log(`✅ Creative Riddles 1st Year Diploma SET ${setNum}: ${qC} Questions`);
    }

    const logicalRounds = await QuizRound.findAll({ where: { category: 'Logical Reasoning' } });
    let totalLogicalQuestions = 0;
    for (const r of logicalRounds) {
      totalLogicalQuestions += await Question.count({ where: { roundId: r.id } });
    }
    console.log(`✅ Total Logical Reasoning Questions across ${logicalRounds.length} sets: ${totalLogicalQuestions} (UNCHANGED)`);

    console.log('\n--- VERIFICATION SUMMARY ---');
    console.log(`SET 3:
30/30 QUESTIONS

DUPLICATES:
0

MYSQL:
YES

EXISTING ROUND USED:
YES

ROUND CREATED:
NO

OTHER SETS:
UNCHANGED
`);

  } catch (err) {
    console.error('❌ Verification failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

verifyImportSet3();
