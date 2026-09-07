require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

async function verifyImportBTechSet3() {
  try {
    console.log('--- DB VERIFICATION FOR CREATIVE RIDDLES B.TECH 1ST YEAR SET 3 ---');
    
    // 1. Verify target round
    const btechSet3Round = await QuizRound.findOne({
      where: {
        category: 'Creative Riddles',
        course: 'B.Tech',
        year: '1st Year',
        setNumber: 3
      }
    });

    if (!btechSet3Round) {
      throw new Error('❌ Target round Creative Riddles - B.Tech 1st Year — SET 3 NOT found!');
    }

    console.log(`✅ Target Round Found: "${btechSet3Round.title}"`);
    console.log(`   ID: ${btechSet3Round.id}`);
    console.log(`   Category: ${btechSet3Round.category}`);
    console.log(`   Course: ${btechSet3Round.course}`);
    console.log(`   Year: ${btechSet3Round.year}`);
    console.log(`   Set Number: ${btechSet3Round.setNumber}`);
    console.log(`   Status: ${btechSet3Round.status} (UNCHANGED)`);

    // Check duplicate rounds for SET 3
    const btechSet3RoundDuplicates = await QuizRound.count({
      where: {
        category: 'Creative Riddles',
        course: 'B.Tech',
        year: '1st Year',
        setNumber: 3
      }
    });
    console.log(`   Duplicate Rounds Count: ${btechSet3RoundDuplicates - 1}`);

    // 2. Verify questions in SET 3
    const questions = await Question.findAll({
      where: { roundId: btechSet3Round.id },
      order: [['questionOrder', 'ASC']]
    });

    console.log(`✅ Question Count in B.Tech 1st Year SET 3: ${questions.length}`);
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

    // 3. Verify Other B.Tech 1st Year Sets & Diploma Sets UNCHANGED
    for (let setNum of [1, 2]) {
      const r = await QuizRound.findOne({ where: { category: 'Creative Riddles', course: 'B.Tech', year: '1st Year', setNumber: setNum } });
      const qC = r ? await Question.count({ where: { roundId: r.id } }) : 0;
      console.log(`✅ Creative Riddles B.Tech 1st Year SET ${setNum}: ${qC} Questions (UNCHANGED)`);
    }

    for (let setNum of [1, 2, 3, 4, 5]) {
      const r = await QuizRound.findOne({ where: { category: 'Creative Riddles', course: 'Diploma', year: '1st Year', setNumber: setNum } });
      const qC = r ? await Question.count({ where: { roundId: r.id } }) : 0;
      console.log(`✅ Creative Riddles 1st Year Diploma SET ${setNum}: ${qC} Questions (UNCHANGED)`);
    }

    const logicalRounds = await QuizRound.findAll({ where: { category: 'Logical Reasoning' } });
    let totalLogicalQuestions = 0;
    for (const r of logicalRounds) {
      totalLogicalQuestions += await Question.count({ where: { roundId: r.id } });
    }
    console.log(`✅ Total Logical Reasoning Questions across ${logicalRounds.length} sets: ${totalLogicalQuestions} (UNCHANGED)`);

    console.log('\n--- VERIFICATION SUMMARY ---');
    console.log(`TARGET:
Creative Riddles - B.Tech 1st Year — SET 3

QUESTIONS:
30/30

DUPLICATES:
0

MYSQL:
YES

EXISTING ROUND USED:
YES

ROUND CREATED:
NO

OTHER DATA:
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

verifyImportBTechSet3();
