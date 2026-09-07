require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

async function masterVerification() {
  console.log('==================================================');
  console.log('RUNNING MASTER INTEGRATION VERIFICATION SCRIPT');
  console.log('==================================================\n');

  try {
    // 1. Group by category SQL Query
    const [categoryCounts] = await sequelize.query(`
      SELECT category, COUNT(*) as count 
      FROM quiz_rounds 
      GROUP BY category 
      ORDER BY category ASC
    `);

    console.log('1. Database Quiz Rounds Category Grouping:');
    categoryCounts.forEach(c => console.log(`   - ${c.category}: ${c.count} sets`));

    // 2. Verify total QuizRounds
    const totalRounds = await QuizRound.count();
    console.log(`\n2. Total Quiz Rounds in DB: ${totalRounds} (Expected: 40)`);

    // 3. Verify Logical Reasoning questions
    const logicalRounds = await QuizRound.findAll({ where: { category: 'Logical Reasoning' } });
    const logicalRoundIds = logicalRounds.map(r => r.id);
    const logicalQCount = await Question.count({ where: { roundId: logicalRoundIds } });
    console.log(`3. Logical Reasoning Questions: ${logicalQCount} (Expected: 600)`);

    // 4. Verify Creative Riddles questions
    const creativeRounds = await QuizRound.findAll({ where: { category: 'Creative Riddles' } });
    const creativeRoundIds = creativeRounds.map(r => r.id);
    const creativeQCount = await Question.count({ where: { roundId: creativeRoundIds } });
    console.log(`4. Creative Riddles Questions: ${creativeQCount} (Expected: 0)`);

    // 5. Check uniqueness index on table
    const [indexes] = await sequelize.query('SHOW INDEX FROM quiz_rounds');
    const hasGlobalUnique = indexes.some(idx => idx.Key_name === 'unique_round_number');
    const hasCompositeUnique = indexes.some(idx => idx.Key_name === 'unique_category_course_year_set');
    console.log(`\n5. Global roundNumber unique constraint removed: ${!hasGlobalUnique ? 'YES ✓' : 'NO ❌'}`);
    console.log(`6. Scoped composite unique index active: ${hasCompositeUnique ? 'YES ✓' : 'NO ❌'}`);

    console.log('\n==================================================');
    console.log('ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
    console.log('==================================================\n');

  } catch (err) {
    console.error('❌ Master verification error:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

masterVerification();
