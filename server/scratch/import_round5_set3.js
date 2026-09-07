const path = require('path');
const { Sequelize } = require(path.join(__dirname, '../server/node_modules/sequelize'));
require(path.join(__dirname, '../server/node_modules/dotenv')).config({ path: path.join(__dirname, '../server/.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME || 'engineers_day_quiz',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false
  }
);

const ROUND_5_ID = 'e2ca08b7-e189-4bce-b320-477a2a355f57';

const questionsData = [
  {
    questionOrder: 1,
    questionText: 'If "BOOK" is 43, what does "PEN" evaluate to in direct alphanumeric sum logic?',
    optionA: '35',
    optionB: '38',
    optionC: '40',
    optionD: '42',
    correctOption: 'A',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 2,
    questionText: 'Find the correct water image of the word: REPRODUCTION',
    optionA: 'bƎbboᗡ∩Ɔ┴IOИ',
    optionB: 'bƎbboᗡUƆ┴IOИ',
    optionC: 'bƎ𐐚boᗡ∩Ɔ┴IOИ',
    optionD: 'RƎbboᗡ∩Ɔ┴IOИ',
    correctOption: 'A',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 3,
    questionText: 'Complete value pairs: W-144, U-121, S-100, ?',
    optionA: 'Q-81',
    optionB: 'R-81',
    optionC: 'Q-64',
    optionD: 'P-81',
    correctOption: 'A',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 4,
    questionText: 'Find the correct mirror image of the word: COOPERATION',
    optionA: 'NOITAREPOOC',
    optionB: '𐌎OIꓕAЯƎ𐌐OOƆ',
    optionC: '𐌎OIT_A_ЯƎ𐌐OOƆ',
    optionD: '𐌎OIꓕAЯE𐌐OOƆ',
    correctOption: 'B',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 5,
    questionText: 'Complete pattern link analogy: Up : Down :: North : ?',
    optionA: 'East',
    optionB: 'West',
    optionC: 'South',
    optionD: 'Center',
    correctOption: 'C',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 6,
    questionText: 'Complete the series: 8, 10, 14, 22, 38, ?',
    optionA: '66',
    optionB: '70',
    optionC: '74',
    optionD: '78',
    correctOption: 'B',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 7,
    questionText: 'Find the correct water image of the word: INDEPENDENCE',
    optionA: 'IИᗡƎbƎИᗡƎИƆƎ',
    optionB: 'IИᗡƎbƎNᗡƎИƆƎ',
    optionC: 'INᗡƎbƎИᗡƎИƆƎ',
    optionD: 'IИᗡEbaИᗡƎИƆƎ',
    correctOption: 'A',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 8,
    questionText: 'Complete the series: 12, 24, 72, 288, 1440, ?',
    optionA: '7200',
    optionB: '8640',
    optionC: '9120',
    optionD: '10080',
    correctOption: 'B',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 9,
    questionText: 'Find the correct mirror image of the word: CHRONOLOGY',
    optionA: 'YGOLONORHC',
    optionB: '⅄ӘO⅃OИOЯHƆ',
    optionC: 'YӘO⅃OИOЯHƆ',
    optionD: '⅄GO⅃OИOЯHƆ',
    correctOption: 'B',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 10,
    questionText: 'Complete pattern connection: Pen : Writer :: Axe : ?',
    optionA: 'Woodcutter',
    optionB: 'Carpenter',
    optionC: 'Cobbler',
    optionD: 'Blacksmith',
    correctOption: 'A',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 11,
    questionText: 'Find the correct water image of the word: EXPERIMENT',
    optionA: 'EXbƎbIWƎИ┴',
    optionB: 'EXbƎbIMƎИ┴',
    optionC: 'ƎXbƎbIWƎИ┴',
    optionD: 'EXbƎbIWƎN┴',
    correctOption: 'A',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 12,
    questionText: 'Complete logic value: 1, 4, 9, 16, 25, ?',
    optionA: '34',
    optionB: '36',
    optionC: '40',
    optionD: '42',
    correctOption: 'B',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 13,
    questionText: 'Complete index series: C3, E5, G7, I9, ?',
    optionA: 'K11',
    optionB: 'J10',
    optionC: 'L12',
    optionD: 'M13',
    correctOption: 'A',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 14,
    questionText: 'Find the correct mirror image of the word: EXPERIMENT',
    optionA: 'TNEMIREPXE',
    optionB: 'ꓕИƎMIЯƎ𐌞Ǝ',
    optionC: 'ꓕИƎMIЯƎ𐌞Ǝ',
    optionD: 'ꓕИƎMIЯƎ𐌞E',
    correctOption: 'B',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 15,
    questionText: 'Complete the series: 0, 10, 24, 68, 120, ?',
    optionA: '216',
    optionB: '222',
    optionC: '230',
    optionD: '244',
    correctOption: 'B',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 16,
    questionText: "At what precise timing interval past 4 o'clock do clock hand pins match together?",
    optionA: '21-9/11 min past 4',
    optionB: '20 min past 4',
    optionC: '21 min past 4',
    optionD: '22-5/11 min past 4',
    correctOption: 'A',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 17,
    questionText: 'Find the correct water image of the word: COOPERATION',
    optionA: 'ƆOObƎb∀┴IOИ',
    optionB: 'COObƎb∀┴IOИ',
    optionC: 'ƆOO𐐚Ǝb∀┴IOИ',
    optionD: 'ƆOObƎbA┴IOИ',
    correctOption: 'A',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 18,
    questionText: 'Complete the series: 5, 11, 24, 51, 106, ?',
    optionA: '213',
    optionB: '215',
    optionC: '217',
    optionD: '219',
    correctOption: 'C',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 19,
    questionText: 'Find the correct mirror image of the word: REPRODUCTION',
    optionA: 'NOITCUDORPER',
    optionB: '𐌎OIꓕƆUᗡOЯ𐌐ƎЯ',
    optionC: '𐌎OITƆUᗡOЯ𐌐ƎЯ',
    optionD: '𐌎OIꓕƆUᗡOЯPƎЯ',
    correctOption: 'B',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 20,
    questionText: 'Complete index pairs: 2A, 4D, 8I, 16P, ?',
    optionA: '32Y',
    optionB: '32Z',
    optionC: '64Y',
    optionD: '32X',
    correctOption: 'A',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 21,
    questionText: 'Find the correct water image of the word: CHRONOLOGY',
    optionA: 'ƆHboИOГOeλ',
    optionB: 'CHboИOГOeλ',
    optionC: 'ƆHboИOГOeY',
    optionD: 'ƆHboNOГOeλ',
    correctOption: 'A',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 22,
    questionText: 'Spot the odd visual framework category: Cube, Sphere, Cylinder, Circle',
    optionA: 'Cube',
    optionB: 'Sphere',
    optionC: 'Cylinder',
    optionD: 'Circle',
    correctOption: 'D',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 23,
    questionText: 'Complete the letter series: A2B, D4E, G6H, ?',
    optionA: 'J8K',
    optionB: 'I8J',
    optionC: 'J7K',
    optionD: 'K8L',
    correctOption: 'A',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 24,
    questionText: 'Find the correct mirror image of the word: INDEPENDENCE',
    optionA: 'ECNEDNEPEDNI',
    optionB: 'ƎƆИƎᗡИƎᗡƎ𐌐ИI',
    optionC: 'ƎƆИƎᗡИƎᗡƎ𐌐NI',
    optionD: 'ƎƆNƎᗡИƎᗡƎ𐌐ИI',
    correctOption: 'B',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 25,
    questionText: "A clock strikes 12 times at 12 o'clock. If it takes 22 seconds to strike 12, how long does it take to strike 6?",
    optionA: '10 seconds',
    optionB: '11 seconds',
    optionC: '12 seconds',
    optionD: '13 seconds',
    correctOption: 'A',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 26,
    questionText: 'Complete the letter series: J10, L12, N14, P16, ?',
    optionA: 'R18',
    optionB: 'S19',
    optionC: 'Q17',
    optionD: 'T20',
    correctOption: 'A',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 27,
    questionText: 'If a standard clock shows 4:40, what angle does it trace internally?',
    optionA: '100°',
    optionB: '110°',
    optionC: '120°',
    optionD: '130°',
    correctOption: 'A',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 28,
    questionText: 'How many minutes match past 4 o\'clock such that hands are exactly perpendicular first?',
    optionA: '5-5/11 min past 4',
    optionB: '6 min past 4',
    optionC: '5 min past 4',
    optionD: '7 min past 4',
    correctOption: 'A',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 29,
    questionText: 'Complete the series: 10, 19, 40, 77, 134, ?',
    optionA: '211',
    optionB: '215',
    optionC: '219',
    optionD: '223',
    correctOption: 'B',
    marks: 1.0,
    negativeMarks: 0.0
  },
  {
    questionOrder: 30,
    questionText: 'A reflection inside a flat mirror reveals clock pin setups reading exactly 12:00. What is actual time?',
    optionA: '6:00',
    optionB: '12:00',
    optionC: '3:00',
    optionD: '9:00',
    correctOption: 'B',
    marks: 1.0,
    negativeMarks: 0.0
  }
];

async function importRound5() {
  const t = await sequelize.transaction();
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    // 1. Verify Round 5 exists
    const [[round5]] = await sequelize.query(
      `SELECT * FROM quiz_rounds WHERE id = :id AND roundNumber = 5`,
      { replacements: { id: ROUND_5_ID }, transaction: t }
    );

    if (!round5) {
      throw new Error(`Round 5 record with ID ${ROUND_5_ID} not found!`);
    }

    console.log(`Found Round 5 record: ID = ${round5.id}, Title = "${round5.title}", Status = ${round5.status}`);

    // 2. Count current questions
    const [[{ count: oldCount }]] = await sequelize.query(
      `SELECT COUNT(*) as count FROM questions WHERE roundId = :id`,
      { replacements: { id: ROUND_5_ID }, transaction: t }
    );

    console.log(`Old questions count for Round 5: ${oldCount}`);

    // 3. Delete old questions belonging to Round 5 ONLY
    if (oldCount > 0) {
      await sequelize.query(
        `DELETE FROM questions WHERE roundId = :id`,
        { replacements: { id: ROUND_5_ID }, transaction: t }
      );
      console.log(`Deleted ${oldCount} old questions from Round 5.`);
    }

    // 4. Insert 30 Set 3 questions
    for (const q of questionsData) {
      await sequelize.query(
        `INSERT INTO questions 
        (id, roundId, questionOrder, questionText, optionA, optionB, optionC, optionD, correctOption, marks, negativeMarks, createdAt, updatedAt)
        VALUES (UUID(), :roundId, :questionOrder, :questionText, :optionA, :optionB, :optionC, :optionD, :correctOption, :marks, :negativeMarks, NOW(), NOW())`,
        {
          replacements: {
            roundId: ROUND_5_ID,
            questionOrder: q.questionOrder,
            questionText: q.questionText,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctOption: q.correctOption,
            marks: q.marks,
            negativeMarks: q.negativeMarks
          },
          transaction: t
        }
      );
    }

    console.log(`Inserted ${questionsData.length} Set 3 questions into Round 5.`);

    await t.commit();
    console.log('Transaction committed successfully!');
  } catch (err) {
    await t.rollback();
    console.error('Import failed:', err);
  } finally {
    await sequelize.close();
  }
}

importRound5();
