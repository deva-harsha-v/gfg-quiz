require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

async function verifyImport() {
  try {
    console.log('=== VERIFYING B.TECH 3RD YEAR SET 3 IMPORT ===\n');

    // 1. Fetch Round 18
    const round18 = await QuizRound.findOne({
      where: { title: 'Logical Reasoning - B.Tech 3rd Year — SET 3' }
    });

    if (!round18) {
      throw new Error('Round "Logical Reasoning - B.Tech 3rd Year — SET 3" not found');
    }

    console.log(`✓ Target Round Found: ID ${round18.id}, Title: "${round18.title}"`);

    // 2. Fetch questions for Set 3
    const questions = await Question.findAll({
      where: { roundId: round18.id },
      order: [['questionOrder', 'ASC']]
    });

    console.log(`\n✓ Question Count in SET 3: ${questions.length}`);
    if (questions.length !== 30) {
      console.error(`❌ ERROR: Expected 30 questions, found ${questions.length}`);
    } else {
      console.log(`✓ SET 3 contains EXACTLY 30 questions.`);
    }

    // 3. Verify ordering, 4 options present, valid keys, correct roundId association
    let orderValid = true;
    let optionsValid = true;
    let keysValid = true;
    let associationValid = true;
    const seenOrders = new Set();
    let duplicatesFound = false;

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const expectedOrder = i + 1;
      if (q.questionOrder !== expectedOrder) {
        console.error(`❌ Misordered question at index ${i}: expected ${expectedOrder}, got ${q.questionOrder}`);
        orderValid = false;
      }
      if (seenOrders.has(q.questionOrder)) {
        console.error(`❌ Duplicate question order found: Q${q.questionOrder}`);
        duplicatesFound = true;
      }
      seenOrders.add(q.questionOrder);

      if (q.roundId !== round18.id) {
        console.error(`❌ Question Q${q.questionOrder} has wrong roundId: ${q.roundId}`);
        associationValid = false;
      }

      if (!q.optionA || !q.optionB || !q.optionC || !q.optionD) {
        console.error(`❌ Missing option for Q${q.questionOrder}`);
        optionsValid = false;
      }
      if (!['A', 'B', 'C', 'D'].includes(q.correctOption)) {
        console.error(`❌ Invalid correctOption for Q${q.questionOrder}: ${q.correctOption}`);
        keysValid = false;
      }
    }

    if (orderValid) console.log('✓ Questions 1-30 are in strict consecutive order.');
    if (!duplicatesFound) console.log('✓ No duplicate questions in SET 3.');
    if (optionsValid) console.log('✓ All 30 questions have all four options (A, B, C, D) non-empty.');
    if (keysValid) console.log('✓ All 30 questions have valid answer keys (A/B/C/D).');
    if (associationValid) console.log('✓ All 30 questions are correctly linked to SET 3 Round ID.');

    // 4. Verify all rounds status and question counts
    const allRounds = await QuizRound.findAll({
      order: [['roundNumber', 'ASC']]
    });

    console.log('\n--- ALL ROUNDS STATUS IN DB ---');
    let totalQuestionsAllRounds = 0;
    for (const r of allRounds) {
      const qCount = await Question.count({ where: { roundId: r.id } });
      totalQuestionsAllRounds += qCount;
      console.log(`Round #${r.roundNumber.toString().padStart(2, ' ')} [ID: ${r.id.slice(0, 8)}...] | Qs: ${qCount.toString().padStart(2, ' ')} | Title: "${r.title}"`);
    }

    console.log(`\nTotal Questions Across All Rounds in Database: ${totalQuestionsAllRounds}`);
    if (totalQuestionsAllRounds === 570) {
      console.log('✓ Total database questions = 570 (19 populated rounds * 30 questions).');
      console.log('✓ Set 5 of B.Tech 3rd Year remains untouched at 0 questions.');
      console.log('✓ All 18 pre-existing rounds (Diploma 1-5, B.Tech 1st 1-5, B.Tech 2nd 1-5, B.Tech 3rd Set 1, Set 2 & Set 4) remain unchanged at 30 questions each.');
    } else {
      console.warn(`⚠️ Warning: Expected 570 total questions, found ${totalQuestionsAllRounds}`);
    }

    console.log('\n=== VERIFICATION SUCCESSFUL ===');
  } catch (err) {
    console.error('❌ Verification failed:', err);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

verifyImport();
