const fs = require('fs');
const path = require('path');

// Manually parse .env if process.env isn't populated
const envPath = path.join(__dirname, '../server/.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach((l) => {
    const idx = l.indexOf('=');
    if (idx !== -1) {
      const k = l.slice(0, idx).trim();
      const v = l.slice(idx + 1).trim();
      if (k && !process.env[k]) process.env[k] = v;
    }
  });
}

const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const questionsData = [
  {
    questionOrder: 1,
    questionText: 'Complete value pairs: W-144, U-121, S-100, ?',
    optionA: 'Q-81',
    optionB: 'R-81',
    optionC: 'Q-64',
    optionD: 'P-81',
    correctOption: 'A'
  },
  {
    questionOrder: 2,
    questionText: 'Complete pattern link analogy: Up : Down :: North : ?',
    optionA: 'East',
    optionB: 'West',
    optionC: 'South',
    optionD: 'Center',
    correctOption: 'C'
  },
  {
    questionOrder: 3,
    questionText: 'Find the correct mirror image of the word: COOPERATION',
    optionA: 'NOITAREPOOC',
    optionB: '𐌎OIꓕAЯƎ𐌐OOƆ',
    optionC: '𐌎OIT_A_ЯƎ𐌐OOƆ',
    optionD: '𐌎OIꓕAЯE𐌐OOƆ',
    correctOption: 'C'
  },
  {
    questionOrder: 4,
    questionText: 'Complete the series: 5, 11, 24, 51, 106, ?',
    optionA: '213',
    optionB: '215',
    optionC: '217',
    optionD: '219',
    correctOption: 'C'
  },
  {
    questionOrder: 5,
    questionText: 'Complete pattern connection: Pen : Writer :: Axe : ?',
    optionA: 'Woodcutter',
    optionB: 'Carpenter',
    optionC: 'Cobbler',
    optionD: 'Blacksmith',
    correctOption: 'A'
  },
  {
    questionOrder: 6,
    questionText: 'Find the correct water image of the word: INDEPENDENCE',
    optionA: 'IИᗡƎbƎИᗡƎИƆƎ',
    optionB: 'IИᗡƎbƎNᗡƎИƆƎ',
    optionC: 'INᗡƎbƎИᗡƎИƆƎ',
    optionD: 'IИᗡEbaИᗡƎИƆƎ',
    correctOption: 'A'
  },
  {
    questionOrder: 7,
    questionText: 'Complete the letter series: A2B, D4E, G6H, ?',
    optionA: 'J8K',
    optionB: 'I8J',
    optionC: 'J7K',
    optionD: 'K8L',
    correctOption: 'A'
  },
  {
    questionOrder: 8,
    questionText: 'Find the correct mirror image of the word: EXPERIMENT',
    optionA: 'TNEMIREPXE',
    optionB: 'ꓕИƎMIЯƎ𐌞Ǝ',
    optionC: 'ꓕИƎMIЯƎ𐌞Ǝ',
    optionD: 'ꓕИƎMIЯƎ𐌞E',
    correctOption: 'B'
  },
  {
    questionOrder: 9,
    questionText: 'Complete logic value: 1, 4, 9, 16, 25, ?',
    optionA: '34',
    optionB: '36',
    optionC: '40',
    optionD: '42',
    correctOption: 'B'
  },
  {
    questionOrder: 10,
    questionText: 'Find the correct water image of the word: EXPERIMENT',
    optionA: 'EXbƎbIWƎИ┴',
    optionB: 'EXbƎbIMƎИ┴',
    optionC: 'ƎXbƎbIWƎИ┴',
    optionD: 'EXbƎbIWƎN┴',
    correctOption: 'A'
  },
  {
    questionOrder: 11,
    questionText: 'Find the correct mirror image of the word: INDEPENDENCE',
    optionA: 'ECNEDNEPEDNI',
    optionB: 'ƎƆИƎᗡИƎᗡƎ𐌐ИI',
    optionC: 'ƎƆИƎᗡИƎᗡƎ𐌐NI',
    optionD: 'ƎƆNƎᗡИƎᗡƎ𐌐ИI',
    correctOption: 'B'
  },
  {
    questionOrder: 12,
    questionText: 'Complete the series: 8, 10, 14, 22, 38, ?',
    optionA: '66',
    optionB: '70',
    optionC: '74',
    optionD: '78',
    correctOption: 'B'
  },
  {
    questionOrder: 13,
    questionText: 'If a standard clock shows 4:40, what angle does it trace internally?',
    optionA: '100°',
    optionB: '110°',
    optionC: '120°',
    optionD: '130°',
    correctOption: 'A'
  },
  {
    questionOrder: 14,
    questionText: 'Complete the series: 12, 24, 72, 288, 1440, ?',
    optionA: '7200',
    optionB: '8640',
    optionC: '9120',
    optionD: '10080',
    correctOption: 'B'
  },
  {
    questionOrder: 15,
    questionText: 'Find the correct water image of the word: COOPERATION',
    optionA: 'ƆOObƎb∀┴IOИ',
    optionB: 'COObƎb∀┴IOИ',
    optionC: 'ƆOO𐐚Ǝb∀┴IOИ',
    optionD: 'ƆOObƎbA┴IOИ',
    correctOption: 'B'
  },
  {
    questionOrder: 16,
    questionText: "At what precise timing interval past 4 o'clock do clock hand pins match together?",
    optionA: '21-9/11 min past 4',
    optionB: '20 min past 4',
    optionC: '21 min past 4',
    optionD: '22-5/11 min past 4',
    correctOption: 'A'
  },
  {
    questionOrder: 17,
    questionText: 'Complete the series: 0, 10, 24, 68, 120, ?',
    optionA: '216',
    optionB: '222',
    optionC: '230',
    optionD: '244',
    correctOption: 'B'
  },
  {
    questionOrder: 18,
    questionText: 'If "BOOK" is 43, what does "PEN" evaluate to in direct alphanumeric sum logic?',
    optionA: '35',
    optionB: '38',
    optionC: '40',
    optionD: '42',
    correctOption: 'A'
  },
  {
    questionOrder: 19,
    questionText: 'Spot the odd visual framework category: Cube, Sphere, Cylinder, Circle',
    optionA: 'Cube',
    optionB: 'Sphere',
    optionC: 'Cylinder',
    optionD: 'Circle',
    correctOption: 'D'
  },
  {
    questionOrder: 20,
    questionText: 'Complete index pairs: 2A, 4D, 8I, 16P , ?',
    optionA: '32Y',
    optionB: '32Z',
    optionC: '64Y',
    optionD: '32X',
    correctOption: 'A'
  },
  {
    questionOrder: 21,
    questionText: 'Find the correct water image of the word: REPRODUCTION',
    optionA: 'bƎbboᗡ∩Ɔ┴IOИ',
    optionB: 'bƎbboᗡUƆ┴IOИ',
    optionC: 'bƎ𐐚boᗡ∩Ɔ┴IOИ',
    optionD: 'RƎbboᗡ∩Ɔ┴IOИ',
    correctOption: 'A'
  },
  {
    questionOrder: 22,
    questionText: 'Find the correct mirror image of the word: REPRODUCTION',
    optionA: 'NOITCUDORPER',
    optionB: '𐌎OIꓕƆUᗡOЯ𐌐ƎЯ',
    optionC: '𐌎OITƆUᗡOЯ𐌐ƎЯ',
    optionD: '𐌎OIꓕƆUᗡOЯPƎЯ',
    correctOption: 'C'
  },
  {
    questionOrder: 23,
    questionText: 'Find the correct water image of the word: CHRONOLOGY',
    optionA: 'ƆHboИOГOeλ',
    optionB: 'CHboИOГOeλ',
    optionC: 'ƆHboИOГOeY',
    optionD: 'ƆHboNOГOeλ',
    correctOption: 'B'
  },
  {
    questionOrder: 24,
    questionText: 'Find the correct mirror image of the word: CHRONOLOGY',
    optionA: 'YGOLONORHC',
    optionB: '⅄ӘO⅃OИOЯHƆ',
    optionC: 'YӘO⅃OИOЯHƆ',
    optionD: '⅄GO⅃OИOЯHƆ',
    correctOption: 'B'
  },
  {
    questionOrder: 25,
    questionText: 'Complete index series: C3, E5, G7, I9, ?',
    optionA: 'K11',
    optionB: 'J10',
    optionC: 'L12',
    optionD: 'M13',
    correctOption: 'A'
  },
  {
    questionOrder: 26,
    questionText: 'Complete the letter series: J10, L12, N14, P16, ?',
    optionA: 'R18',
    optionB: 'S19',
    optionC: 'Q17',
    optionD: 'T20',
    correctOption: 'A'
  },
  {
    questionOrder: 27,
    questionText: "A clock strikes 12 times at 12 o'clock. If it takes 22 seconds to strike 12, how long does it take to strike 6?",
    optionA: '10 seconds',
    optionB: '11 seconds',
    optionC: '12 seconds',
    optionD: '13 seconds',
    correctOption: 'A'
  },
  {
    questionOrder: 28,
    questionText: "How many minutes match past 4 o'clock such that hands are exactly perpendicular first?",
    optionA: '5-5/11 min past 4',
    optionB: '6 min past 4',
    optionC: '5 min past 4',
    optionD: '7 min past 4',
    correctOption: 'A'
  },
  {
    questionOrder: 29,
    questionText: 'Complete the series: 10, 19, 40, 77, 134, ?',
    optionA: '211',
    optionB: '215',
    optionC: '219',
    optionD: '223',
    correctOption: 'B'
  },
  {
    questionOrder: 30,
    questionText: 'A reflection inside a flat mirror reveals clock pin setups reading exactly 12:00. What is actual time?',
    optionA: '6:00',
    optionB: '12:00',
    optionC: '3:00',
    optionD: '9:00',
    correctOption: 'A'
  }
];

async function run() {
  const transaction = await sequelize.transaction();
  try {
    await sequelize.authenticate();
    console.log('Database connection authenticated.');

    // 1. Find Round 3
    let round3 = await QuizRound.findOne({ where: { roundNumber: 3 }, transaction });
    if (!round3) {
      console.log('Round 3 not found by roundNumber=3, searching by title containing "Round 3"...');
      round3 = await QuizRound.findOne({ where: { title: { [sequelize.Op.like]: '%Round 3%' } }, transaction });
    }

    if (!round3) {
      throw new Error('Round 3 does not exist in database!');
    }

    console.log(`Found Round 3: ID=${round3.id}, Title="${round3.title}", Status=${round3.status}`);

    // 2. Check existing questions count in Round 3
    const existingCount = await Question.count({ where: { roundId: round3.id }, transaction });
    console.log(`Existing questions count in Round 3: ${existingCount}`);

    let insertedCount = 0;
    let duplicateCount = 0;

    // 3. Upsert / Insert questions idempotently
    for (const qData of questionsData) {
      const existingQ = await Question.findOne({
        where: {
          roundId: round3.id,
          questionOrder: qData.questionOrder
        },
        transaction
      });

      if (existingQ) {
        duplicateCount++;
        await existingQ.update({
          questionText: qData.questionText,
          optionA: qData.optionA,
          optionB: qData.optionB,
          optionC: qData.optionC,
          optionD: qData.optionD,
          correctOption: qData.correctOption,
          marks: 1.0,
          negativeMarks: 0.0,
          isActive: true
        }, { transaction });
      } else {
        await Question.create({
          roundId: round3.id,
          questionOrder: qData.questionOrder,
          questionText: qData.questionText,
          optionA: qData.optionA,
          optionB: qData.optionB,
          optionC: qData.optionC,
          optionD: qData.optionD,
          correctOption: qData.correctOption,
          marks: 1.0,
          negativeMarks: 0.0,
          isActive: true
        }, { transaction });
        insertedCount++;
      }
    }

    await transaction.commit();

    const finalCount = await Question.count({ where: { roundId: round3.id } });

    console.log('====================================================');
    console.log('🎉 ROUND 3 QUESTIONS IMPORT COMPLETED SUCCESSFULLY');
    console.log('====================================================');
    console.log(`Round 3 ID: ${round3.id}`);
    console.log(`Questions inserted: ${insertedCount}`);
    console.log(`Duplicates found/updated: ${duplicateCount}`);
    console.log(`Final Question Count in Round 3: ${finalCount}`);

  } catch (error) {
    await transaction.rollback();
    console.error('❌ Failed to import Round 3 questions:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

run();
