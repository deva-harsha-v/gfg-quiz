require('dotenv').config();
const { sequelize } = require('./src/config/database');
const QuizAttempt = require('./src/models/QuizAttempt');

async function checkSchema() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    const [columns] = await sequelize.query("SHOW COLUMNS FROM quiz_attempts LIKE 'examEventKey'");
    console.log('examEventKey column exists:', columns.length > 0);

    const [indexes] = await sequelize.query("SHOW INDEX FROM quiz_attempts WHERE Key_name = 'unique_participant_event_attempt'");
    console.log('unique_participant_event_attempt index exists:', indexes.length > 0);

    const attemptsCount = await QuizAttempt.count();
    console.log('Total attempts in DB:', attemptsCount);

    process.exit(0);
  } catch (err) {
    console.error('Check error:', err);
    process.exit(1);
  }
}

checkSchema();
