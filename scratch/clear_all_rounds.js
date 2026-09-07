process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '3306';
process.env.DB_NAME = 'engineers_day_quiz';
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = 'Ramana@05';

const { QuizRound, Question, QuizAttempt, QuizAnswer, SecurityEvent } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

async function clearAllRounds() {
  const t = await sequelize.transaction();
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // 1. Delete security events
    const deletedEvents = await SecurityEvent.destroy({ where: {}, transaction: t });
    console.log(`Deleted ${deletedEvents} security events.`);

    // 2. Delete quiz answers
    const deletedAnswers = await QuizAnswer.destroy({ where: {}, transaction: t });
    console.log(`Deleted ${deletedAnswers} quiz answers.`);

    // 3. Delete quiz attempts
    const deletedAttempts = await QuizAttempt.destroy({ where: {}, transaction: t });
    console.log(`Deleted ${deletedAttempts} quiz attempts.`);

    // 4. Delete questions
    const deletedQuestions = await Question.destroy({ where: {}, transaction: t });
    console.log(`Deleted ${deletedQuestions} questions.`);

    // 5. Delete quiz rounds
    const deletedRounds = await QuizRound.destroy({ where: {}, transaction: t });
    console.log(`Deleted ${deletedRounds} quiz rounds.`);

    await t.commit();
    console.log('SUCCESS: All quiz rounds, questions, attempts, answers, and security events cleared cleanly!');
    process.exit(0);
  } catch (err) {
    await t.rollback();
    console.error('Failed to clear rounds:', err);
    process.exit(1);
  }
}

clearAllRounds();
