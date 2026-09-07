const path = require('path');
const { sequelize } = require('../server/src/config/database');
const QuizRound = require('../server/src/models/QuizRound');
const Question = require('../server/src/models/Question');

const runVerification = async () => {
  try {
    console.log('=== VERIFYING UNIQUE EXAM ACCESS CODE SYSTEM ===\n');
    await sequelize.authenticate();

    // 1. Fetch all rounds from DB
    const rounds = await QuizRound.findAll({
      order: [['category', 'ASC'], ['course', 'ASC'], ['setNumber', 'ASC']]
    });

    console.log(`1. Total rounds in database: ${rounds.length}`);
    if (rounds.length !== 40) {
      throw new Error(`Expected 40 rounds, found ${rounds.length}`);
    }

    const logicalRounds = rounds.filter((r) => r.category === 'Logical Reasoning');
    const creativeRounds = rounds.filter((r) => r.category === 'Creative Riddles');

    console.log(`   - Logical Reasoning rounds: ${logicalRounds.length}`);
    console.log(`   - Creative Riddles rounds: ${creativeRounds.length}`);

    if (logicalRounds.length !== 20 || creativeRounds.length !== 20) {
      throw new Error('Category round counts mismatch!');
    }

    // 2. Verify Access Codes
    const codes = rounds.map((r) => r.accessCode);
    const nullCodes = codes.filter((c) => !c || !c.trim());
    if (nullCodes.length > 0) {
      throw new Error(`Found ${nullCodes.length} rounds with missing access code!`);
    }

    const uniqueCodesSet = new Set(codes);
    console.log(`2. Total unique access codes: ${uniqueCodesSet.size}`);
    if (uniqueCodesSet.size !== 40) {
      throw new Error(`Duplicate access codes detected! Unique count: ${uniqueCodesSet.size}`);
    }
    console.log('   ✓ All 40 rounds have 100% unique access codes.');

    // 3. Verify Questions intact
    let totalQuestions = 0;
    for (const round of rounds) {
      const qCount = await Question.count({ where: { roundId: round.id } });
      totalQuestions += qCount;
    }
    console.log(`3. Total questions across all 40 rounds: ${totalQuestions}`);
    if (totalQuestions !== 1200) {
      console.warn(`   Notice: Total questions counted = ${totalQuestions}`);
    } else {
      console.log('   ✓ Questions preserved perfectly (1200 total).');
    }

    // 4. Sample codes for testing cross-set security
    const lrSet1 = rounds.find((r) => r.category === 'Logical Reasoning' && r.course === 'Diploma' && r.setNumber === 1);
    const lrSet2 = rounds.find((r) => r.category === 'Logical Reasoning' && r.course === 'Diploma' && r.setNumber === 2);
    const crSet1 = rounds.find((r) => r.category === 'Creative Riddles' && r.course === 'Diploma' && r.setNumber === 1);

    console.log('\nSample Access Codes generated:');
    console.log(`   Logical Reasoning - Diploma SET 1 [${lrSet1.id}]: ${lrSet1.accessCode}`);
    console.log(`   Logical Reasoning - Diploma SET 2 [${lrSet2.id}]: ${lrSet2.accessCode}`);
    console.log(`   Creative Riddles - Diploma SET 1  [${crSet1.id}]: ${crSet1.accessCode}`);

    // 5. Test Code Mismatches (Logic Checks)
    if (lrSet1.accessCode === lrSet2.accessCode) {
      throw new Error('SET 1 and SET 2 access codes match!');
    }
    if (lrSet1.accessCode === crSet1.accessCode) {
      throw new Error('Logical Reasoning and Creative Riddles access codes match!');
    }
    console.log('   ✓ SET 1 code != SET 2 code');
    console.log('   ✓ Creative Riddles code != Logical Reasoning code');

    console.log('\n=== ALL ACCESS CODE SYSTEM CHECKS PASSED SUCCESSFULLY ===');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ VERIFICATION FAILED:', err.message);
    process.exit(1);
  }
};

runVerification();
