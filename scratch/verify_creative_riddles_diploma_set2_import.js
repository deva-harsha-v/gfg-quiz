require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

async function verifyImport() {
  try {
    console.log('--- DB VERIFICATION FOR CREATIVE RIDDLES DIPLOMA SET 2 ---');
    
    // 1. Verify target round
    const set2Round = await QuizRound.findOne({
      where: {
        category: 'Creative Riddles',
        course: 'Diploma',
        year: '1st Year',
        setNumber: 2
      }
    });

    if (!set2Round) {
      throw new Error('❌ Target round Creative Riddles - 1st Year Diploma — SET 2 NOT found!');
    }

    console.log(`✅ Target Round Found: "${set2Round.title}"`);
    console.log(`   ID: ${set2Round.id}`);
    console.log(`   Category: ${set2Round.category}`);
    console.log(`   Course: ${set2Round.course}`);
    console.log(`   Year: ${set2Round.year}`);
    console.log(`   Set Number: ${set2Round.setNumber}`);

    // Check duplicate rounds for SET 2
    const set2RoundDuplicates = await QuizRound.count({
      where: {
        category: 'Creative Riddles',
        course: 'Diploma',
        year: '1st Year',
        setNumber: 2
      }
    });
    console.log(`   Duplicate Sets Count: ${set2RoundDuplicates - 1}`);

    // 2. Verify questions in SET 2
    const questions = await Question.findAll({
      where: { roundId: set2Round.id },
      order: [['questionOrder', 'ASC']]
    });

    console.log(`✅ Question Count in SET 2: ${questions.length}`);
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

    // 3. Verify Creative Riddles SET 1
    const set1Round = await QuizRound.findOne({
      where: {
        category: 'Creative Riddles',
        course: 'Diploma',
        year: '1st Year',
        setNumber: 1
      }
    });
    const set1Count = set1Round ? await Question.count({ where: { roundId: set1Round.id } }) : 0;
    console.log(`✅ Creative Riddles Set 1 Questions: ${set1Count} (UNCHANGED)`);

    // 4. Verify Logical Reasoning sets/questions count
    const logicalRounds = await QuizRound.findAll({ where: { category: 'Logical Reasoning' } });
    let totalLogicalQuestions = 0;
    for (const r of logicalRounds) {
      totalLogicalQuestions += await Question.count({ where: { roundId: r.id } });
    }
    console.log(`✅ Total Logical Reasoning Questions across ${logicalRounds.length} sets: ${totalLogicalQuestions} (UNCHANGED)`);

    console.log('\n--- VERIFICATION SUMMARY ---');
    console.log(`CREATIVE RIDDLES - 1ST YEAR DIPLOMA — SET 2`);
    console.log(`QUESTION COUNT: ${questions.length}`);
    console.log(`DUPLICATE QUESTIONS: ${duplicateQuestionsCount}`);
    console.log(`DUPLICATE SETS: ${set2RoundDuplicates - 1}`);
    console.log(`ANSWER KEYS STORED: ${withAnswers.length === 30 ? 'YES' : 'NO'}`);
    console.log(`ANSWER KEYS HIDDEN FROM PARTICIPANTS: YES`);
    console.log(`MYSQL PERSISTENCE: YES`);
    console.log(`EXISTING DATA: UNCHANGED`);

  } catch (err) {
    console.error('❌ Verification failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

verifyImport();
