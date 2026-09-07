const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { QuizRound, Question } = require('../models');

const seedAllQuizRounds = async (force = false) => {
  try {
    const roundCount = await QuizRound.count();
    console.log(`[Master Seeder] Current QuizRound count in database: ${roundCount}`);

    if (roundCount >= 5 && !force) {
      console.log(`[Master Seeder] Quiz rounds already present in DB (${roundCount} rounds). Skipping auto-seeding.`);
      return { success: true, seeded: false, roundsCount: roundCount, message: `Database already contains ${roundCount} rounds.` };
    }

    console.log(`[Master Seeder] Starting full question sets and rounds population from datasets...`);

    const scratchDir = path.join(__dirname, '../../../scratch');
    if (!fs.existsSync(scratchDir)) {
      console.warn(`[Master Seeder Warning] Scratch directory not found at ${scratchDir}`);
      return { success: false, message: 'Scratch directory missing' };
    }

    const seedScripts = [
      'create_btech_2ndyear_sets.js',
      'create_btech_3rdyear_sets.js',
      'create_creative_riddles_rounds.js',
      'import_set1_questions.js',
      'import_round2_questions.js',
      'import_round3_questions.js',
      'import_round4_questions.js',
      'import_round5_set3.js',
      'import_btech_2ndyear_set1.js',
      'import_btech_2ndyear_set2.js',
      'import_btech_2ndyear_set3.js',
      'import_btech_2ndyear_set4.js',
      'import_btech_2ndyear_set5.js',
      'import_btech_3rdyear_set1.js',
      'import_btech_3rdyear_set2.js',
      'import_btech_3rdyear_set3.js',
      'import_btech_3rdyear_set4.js',
      'import_btech_3rdyear_set5.js',
      'import_creative_riddles_diploma_set1.js',
      'import_creative_riddles_diploma_set2.js',
      'import_creative_riddles_diploma_set3.js',
      'import_creative_riddles_diploma_set4.js',
      'import_creative_riddles_diploma_set5.js',
      'import_creative_riddles_btech_1styear_set1.js',
      'import_creative_riddles_btech_1styear_set2.js',
      'import_creative_riddles_btech_1styear_set3.js',
      'import_creative_riddles_btech_1styear_set4.js',
      'import_creative_riddles_btech_1styear_set5.js',
      'import_creative_riddles_btech_2ndyear_set1.js',
      'import_creative_riddles_btech_2ndyear_set2.js',
      'import_creative_riddles_btech_2ndyear_set3.js',
      'import_creative_riddles_btech_2ndyear_set4.js',
      'import_creative_riddles_btech_2ndyear_set5.js',
      'import_creative_riddles_btech_3rdyear_set1.js',
      'import_creative_riddles_btech_3rdyear_set2.js',
      'import_creative_riddles_btech_3rdyear_set3.js',
      'import_creative_riddles_btech_3rdyear_set4.js',
      'import_creative_riddles_btech_3rdyear_set5.js',
      'activate_all_creative_riddles_rounds.js',
      'activate_all_5_sets.js'
    ];

    let executedCount = 0;
    for (const scriptName of seedScripts) {
      const scriptPath = path.join(scratchDir, scriptName);
      if (!fs.existsSync(scriptPath)) {
        continue;
      }

      const result = spawnSync(process.execPath, [scriptPath], {
        cwd: path.join(__dirname, '../../..'),
        env: { ...process.env },
        encoding: 'utf-8',
        timeout: 30000
      });

      if (result.status === 0) {
        executedCount++;
      } else {
        console.warn(`[Master Seeder Warning] Script ${scriptName} status ${result.status}:`, (result.stderr || result.stdout || '').slice(0, 100));
      }
    }

    const finalRounds = await QuizRound.count();
    const finalQuestions = await Question.count();
    console.log(`[Master Seeder Success] Database populated: ${finalRounds} Quiz Rounds and ${finalQuestions} Questions in MySQL.`);

    return {
      success: true,
      seeded: true,
      roundsCount: finalRounds,
      questionsCount: finalQuestions,
      message: `Successfully seeded ${finalRounds} rounds and ${finalQuestions} questions.`
    };
  } catch (err) {
    console.error('[Master Seeder Error]:', err.message);
    return { success: false, error: err.message };
  }
};

module.exports = seedAllQuizRounds;
