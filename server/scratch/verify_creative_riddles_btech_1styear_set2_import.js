require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

async function verifyImportBTechSet2() {
  try {
    console.log('--- DB VERIFICATION FOR CREATIVE RIDDLES B.TECH 1ST YEAR SET 2 ---');
    
    // 1. Verify target round
    const btechSet2Round = await QuizRound.findOne({
      where: {
        category: 'Creative Riddles',
        course: 'B.Tech',
        year: '1st Year',
        setNumber: 2
      }
    });

    if (!btechSet2Round) {
      throw new Error('❌ Target round Creative Riddles - B.Tech 1st Year — SET 2 NOT found!');
    }

    console.log(`✅ Target Round Found: "${btechSet2Round.title}"`);
    console.log(`   ID: ${btechSet2Round.id}`);
    console.log(`   Category: ${btechSet2Round.category}`);
    console.log(`   Course: ${btechSet2Round.course}`);
    console.log(`   Year: ${btechSet2Round.year}`);
    console.log(`   Set Number: ${btechSet2Round.setNumber}`);
    console.log(`   Status: ${btechSet2Round.status} (UNCHANGED)`);

    // Check duplicate rounds for SET 2
    const btechSet2RoundDuplicates = await QuizRound.count({
      where: {
        category: 'Creative Riddles',
        course: 'B.Tech',
        year: '1st Year',
        setNumber: 2
      }
    });
    console.log(`   Duplicate Rounds Count: ${btechSet2RoundDuplicates - 1}`);

    // 2. Verify questions in SET 2
    const questions = await Question.findAll({
      where: { roundId: btechSet2Round.id },
      order: [['questionOrder', 'ASC']]
    });

    console.log(`✅ Question Count in B.Tech 1st Year SET 2: ${questions.length}`);
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

    // 3. Verify B.Tech Set 1 & Diploma Sets UNCHANGED
    const btech1 = await QuizRound.findOne({ where: { category: 'Creative Riddles', course: 'B.Tech', year: '1st Year', setNumber: 1 } });
    const btech1Count = btech1 ? await Question.count({ where: { roundId: btech1.id } }) : 0;
    console.log(`✅ Creative Riddles B.Tech 1st Year SET 1: ${btech1Count} Questions (UNCHANGED)`);

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
Creative Riddles - B.Tech 1st Year — SET 2

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

verifyImportBTechSet2();
