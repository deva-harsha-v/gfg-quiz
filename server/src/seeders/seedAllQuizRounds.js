const { QuizRound, Question } = require('../models');
const { sequelize } = require('../config/database');
const createAllRounds = require('./createAllRounds');
const allQuestionsData = require('./allQuestionsData.json');

const fileMapping = {
  1: 'import_set1_questions.js',
  2: 'import_round2_questions.js',
  3: 'import_round3_questions.js',
  4: 'import_round4_questions.js',
  5: 'import_round5_set3.js',

  6: 'import_set1_questions.js',
  7: 'import_round2_questions.js',
  8: 'import_round3_questions.js',
  9: 'import_round4_questions.js',
  10: 'import_round5_set3.js',

  11: 'import_btech_2ndyear_set1.js',
  12: 'import_btech_2ndyear_set2.js',
  13: 'import_btech_2ndyear_set3.js',
  14: 'import_btech_2ndyear_set4.js',
  15: 'import_btech_2ndyear_set5.js',

  16: 'import_btech_3rdyear_set1.js',
  17: 'import_btech_3rdyear_set2.js',
  18: 'import_btech_3rdyear_set3.js',
  19: 'import_btech_3rdyear_set4.js',
  20: 'import_btech_3rdyear_set5.js',

  21: 'import_creative_riddles_diploma_set1.js',
  22: 'import_creative_riddles_diploma_set2.js',
  23: 'import_creative_riddles_diploma_set3.js',
  24: 'import_creative_riddles_diploma_set4.js',
  25: 'import_creative_riddles_diploma_set5.js',

  26: 'import_creative_riddles_btech_1styear_set1.js',
  27: 'import_creative_riddles_btech_1styear_set2.js',
  28: 'import_creative_riddles_btech_1styear_set3.js',
  29: 'import_creative_riddles_btech_1styear_set4.js',
  30: 'import_creative_riddles_btech_1styear_set5.js',

  31: 'import_creative_riddles_btech_2ndyear_set1.js',
  32: 'import_creative_riddles_btech_2ndyear_set2.js',
  33: 'import_creative_riddles_btech_2ndyear_set3.js',
  34: 'import_creative_riddles_btech_2ndyear_set4.js',
  35: 'import_creative_riddles_btech_2ndyear_set5.js',

  36: 'import_creative_riddles_btech_3rdyear_set1.js',
  37: 'import_creative_riddles_btech_3rdyear_set2.js',
  38: 'import_creative_riddles_btech_3rdyear_set3.js',
  39: 'import_creative_riddles_btech_3rdyear_set4.js',
  40: 'import_creative_riddles_btech_3rdyear_set5.js'
};

const seedAllQuizRounds = async (force = false) => {
  try {
    // 1. Ensure all 40 QuizRound records exist
    await createAllRounds();

    const rounds = await QuizRound.findAll({ order: [['roundNumber', 'ASC']] });
    let totalQuestionsInserted = 0;

    for (const round of rounds) {
      const existingQCount = await Question.count({ where: { roundId: round.id } });
      if (existingQCount >= 10 && !force) {
        continue;
      }

      const fileName = fileMapping[round.roundNumber] || `import_set1_questions.js`;
      const questions = allQuestionsData[fileName] || [];

      if (questions.length > 0) {
        const toInsert = questions.map((q, idx) => ({
          roundId: round.id,
          questionOrder: q.questionOrder || idx + 1,
          questionText: q.questionText,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctOption: (q.correctOption || 'A').toUpperCase().replace(/[^ABCD]/g, '') || 'A',
          marks: q.marks || 1.0,
          negativeMarks: q.negativeMarks || 0.0,
          explanation: q.explanation || null,
          isActive: true
        }));

        if (force || existingQCount > 0) {
          await Question.destroy({ where: { roundId: round.id } });
        }

        await Question.bulkCreate(toInsert);
        totalQuestionsInserted += toInsert.length;

        // Set totalMarks and status ACTIVE for all rounds
        round.totalMarks = 30.00;
        round.status = 'ACTIVE';
        await round.save();
      }
    }

    const finalRoundsCount = await QuizRound.count();
    const finalQuestionsCount = await Question.count();

    console.log(`[Master Seeder Success] Total ${finalRoundsCount} rounds verified and ${finalQuestionsCount} questions active in database.`);

    return {
      success: true,
      seeded: true,
      roundsCount: finalRoundsCount,
      questionsCount: finalQuestionsCount,
      message: `Successfully populated all ${finalRoundsCount} rounds and ${finalQuestionsCount} questions!`
    };
  } catch (err) {
    console.error('[Master Seeder Error]:', err);
    return { success: false, error: err.message };
  }
};

module.exports = seedAllQuizRounds;
