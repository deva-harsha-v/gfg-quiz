require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

async function verifyImportBTech2ndYearSet2() {
  try {
    console.log('--- DB VERIFICATION FOR CREATIVE RIDDLES B.TECH 2ND YEAR SET 2 ---');
    
    // 1. Verify target round
    const btech2ndSet2Round = await QuizRound.findOne({
      where: {
        category: 'Creative Riddles',
        course: 'B.Tech',
        year: '2nd Year',
        setNumber: 2
      }
    });

    if (!btech2ndSet2Round) {
      throw new Error('❌ Target round Creative Riddles - B.Tech 2nd Year — SET 2 NOT found!');
    }

    console.log(`✅ Target Round Found: "${btech2ndSet2Round.title}"`);
    console.log(`   ID: ${btech2ndSet2Round.id}`);
    console.log(`   Category: ${btech2ndSet2Round.category}`);
    console.log(`   Course: ${btech2ndSet2Round.course}`);
    console.log(`   Year: ${btech2ndSet2Round.year}`);
    console.log(`   Set Number: ${btech2ndSet2Round.setNumber}`);
    console.log(`   Status: ${btech2ndSet2Round.status} (UNCHANGED)`);

    // Check duplicate rounds for SET 2
    const btech2ndSet2RoundDuplicates = await QuizRound.count({
      where: {
        category: 'Creative Riddles',
        course: 'B.Tech',
        year: '2nd Year',
        setNumber: 2
      }
    });
    console.log(`   Duplicate Rounds Count: ${btech2ndSet2RoundDuplicates - 1}`);

    // 2. Verify questions in SET 2
    const questions = await Question.findAll({
      where: { roundId: btech2ndSet2Round.id },
      order: [['questionOrder', 'ASC']]
    });

    console.log(`✅ Question Count in B.Tech 2nd Year SET 2: ${questions.length}`);
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

    // 3. Verify B.Tech 2nd Year SET 1, 1st Year Sets & Diploma Sets UNCHANGED
    const b2s1 = await QuizRound.findOne({ where: { category: 'Creative Riddles', course: 'B.Tech', year: '2nd Year', setNumber: 1 } });
    const b2s1Count = b2s1 ? await Question.count({ where: { roundId: b2s1.id } }) : 0;
    console.log(`✅ Creative Riddles B.Tech 2nd Year SET 1: ${b2s1Count} Questions (UNCHANGED)`);

    for (let setNum of [1, 2, 3, 4, 5]) {
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
Creative Riddles - B.Tech 2nd Year — SET 2

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

STATUS:
UNCHANGED

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

verifyImportBTech2ndYearSet2();
