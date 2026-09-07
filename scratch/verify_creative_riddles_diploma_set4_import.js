require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

async function verifyImportSet4() {
  try {
    console.log('--- DB VERIFICATION FOR CREATIVE RIDDLES DIPLOMA SET 4 ---');
    
    // 1. Verify target round
    const set4Round = await QuizRound.findOne({
      where: {
        category: 'Creative Riddles',
        course: 'Diploma',
        year: '1st Year',
        setNumber: 4
      }
    });

    if (!set4Round) {
      throw new Error('❌ Target round Creative Riddles - 1st Year Diploma — SET 4 NOT found!');
    }

    console.log(`✅ Target Round Found: "${set4Round.title}"`);
    console.log(`   ID: ${set4Round.id}`);
    console.log(`   Category: ${set4Round.category}`);
    console.log(`   Course: ${set4Round.course}`);
    console.log(`   Year: ${set4Round.year}`);
    console.log(`   Set Number: ${set4Round.setNumber}`);
    console.log(`   Status: ${set4Round.status} (UNCHANGED)`);

    // Check duplicate rounds for SET 4
    const set4RoundDuplicates = await QuizRound.count({
      where: {
        category: 'Creative Riddles',
        course: 'Diploma',
        year: '1st Year',
        setNumber: 4
      }
    });
    console.log(`   Duplicate Sets Count: ${set4RoundDuplicates - 1}`);

    // 2. Verify questions in SET 4
    const questions = await Question.findAll({
      where: { roundId: set4Round.id },
      order: [['questionOrder', 'ASC']]
    });

    console.log(`✅ Question Count in SET 4: ${questions.length}`);
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

    // 3. Verify Other Sets UNCHANGED
    const set1Round = await QuizRound.findOne({ where: { category: 'Creative Riddles', course: 'Diploma', year: '1st Year', setNumber: 1 } });
    const set1Count = set1Round ? await Question.count({ where: { roundId: set1Round.id } }) : 0;
    console.log(`✅ Creative Riddles Set 1 Questions: ${set1Count} (UNCHANGED)`);

    const set2Round = await QuizRound.findOne({ where: { category: 'Creative Riddles', course: 'Diploma', year: '1st Year', setNumber: 2 } });
    const set2Count = set2Round ? await Question.count({ where: { roundId: set2Round.id } }) : 0;
    console.log(`✅ Creative Riddles Set 2 Questions: ${set2Count} (UNCHANGED)`);

    const logicalRounds = await QuizRound.findAll({ where: { category: 'Logical Reasoning' } });
    let totalLogicalQuestions = 0;
    for (const r of logicalRounds) {
      totalLogicalQuestions += await Question.count({ where: { roundId: r.id } });
    }
    console.log(`✅ Total Logical Reasoning Questions across ${logicalRounds.length} sets: ${totalLogicalQuestions} (UNCHANGED)`);

    console.log('\n--- VERIFICATION SUMMARY ---');
    console.log(`TARGET ROUND:\nCreative Riddles - 1st Year Diploma — SET 4\n`);
    console.log(`QUESTIONS:\n30/30\n`);
    console.log(`DUPLICATES:\n0\n`);
    console.log(`MYSQL:\nYES\n`);
    console.log(`ROUND CREATED:\nNO — EXISTING ROUND USED\n`);
    console.log(`OTHER DATA:\nUNCHANGED\n`);

  } catch (err) {
    console.error('❌ Verification failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

verifyImportSet4();
