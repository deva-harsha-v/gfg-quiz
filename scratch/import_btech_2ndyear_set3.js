require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const questionsData = [
  {
    questionOrder: 1,
    questionText: "Complete the series: 8, 10, 14, 22, 38, ?",
    optionA: "A) 66",
    optionB: "B) 70",
    optionC: "C) 74",
    optionD: "D) 78",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 2,
    questionText: "Find the correct mirror image of the word: EXPERIMENT",
    optionA: "A) TNEMIREPXE",
    optionB: "B) ꓕИƎMIЯƎ𐌞Ǝ",
    optionC: "C) ꓕИƎMIЯƎ𐌞Ǝ",
    optionD: "D) ꓕИƎMIЯƎ𐌞E",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 3,
    questionText: "At what precise timing interval past 4 o'clock do clock hand pins match together?",
    optionA: "A) 21-9/11 min past 4",
    optionB: "B) 20 min past 4",
    optionC: "C) 21 min past 4",
    optionD: "D) 22-5/11 min past 4",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 4,
    questionText: "Complete the letter series: A2B, D4E, G6H, ?",
    optionA: "A) J8K",
    optionB: "B) I8J",
    optionC: "C) J7K",
    optionD: "D) K8L",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 5,
    questionText: "Find the correct water image of the word: EXPERIMENT",
    optionA: "A) EXbƎbIWƎИ┴",
    optionB: "B) EXbƎbIMƎИ┴",
    optionC: "C) ƎXbƎbIWƎИ┴",
    optionD: "D) EXbƎbIWƎN┴",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 6,
    questionText: "Complete pattern connection: Pen : Writer :: Axe : ?",
    optionA: "A) Woodcutter",
    optionB: "B) Carpenter",
    optionC: "C) Cobbler",
    optionD: "D) Blacksmith",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 7,
    questionText: "Complete the series: 5, 11, 24, 51, 106, ?",
    optionA: "A) 213",
    optionB: "B) 215",
    optionC: "C) 217",
    optionD: "D) 219",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 8,
    questionText: "Find the correct mirror image of the word: INDEPENDENCE",
    optionA: "A) ECNEDNEPEDNI",
    optionB: "B) ƎƆИƎᗡИƎᗡƎ𐌐ИI",
    optionC: "C) ƎƆИƎᗡИƎᗡƎ𐌐NI",
    optionD: "D) ƎƆNƎᗡИƎᗡƎ𐌐ИI",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 9,
    questionText: "A clock strikes 12 times at 12 o'clock. If it takes 22 seconds to strike 12, how long does it take to strike 6?",
    optionA: "A) 10 seconds",
    optionB: "B) 11 seconds",
    optionC: "C) 12 seconds",
    optionD: "D) 13 seconds",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 10,
    questionText: "Complete logic value: 1, 4, 9, 16, 25, ?",
    optionA: "A) 34",
    optionB: "B) 36",
    optionC: "C) 40",
    optionD: "D) 42",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 11,
    questionText: "Complete value pairs: W-144, U-121, S-100, ?",
    optionA: "A) Q-81",
    optionB: "B) R-81",
    optionC: "C) Q-64",
    optionD: "D) P-81",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 12,
    questionText: "Find the correct water image of the word: INDEPENDENCE",
    optionA: "A) IИᗡƎbƎИᗡƎИƆƎ",
    optionB: "B) IИᗡƎbƎNᗡƎИƆƎ",
    optionC: "C) INᗡƎbƎИᗡƎИƆƎ",
    optionD: "D) IИᗡEbaИᗡƎИƆƎ",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 13,
    questionText: "Complete the series: 0, 10, 24, 68, 120, ?",
    optionA: "A) 216",
    optionB: "B) 222",
    optionC: "C) 230",
    optionD: "D) 244",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 14,
    questionText: "Find the correct mirror image of the word: COOPERATION",
    optionA: "A) NOITAREPOOC",
    optionB: "B) 𐌎OIꓕAЯƎ𐌐OOƆ",
    optionC: "C) 𐌎OIT_A_ЯƎ𐌐OOƆ",
    optionD: "D) 𐌎OIꓕAЯE𐌐OOƆ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 15,
    questionText: "If a standard clock shows 4:40, what angle does it trace internally?",
    optionA: "A) 100°",
    optionB: "B) 110°",
    optionC: "C) 120°",
    optionD: "D) 130°",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 16,
    questionText: "If \"BOOK\" is 43, what does \"PEN\" evaluate to in direct alphanumeric sum logic?",
    optionA: "A) 35",
    optionB: "B) 38",
    optionC: "C) 40",
    optionD: "D) 42",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 17,
    questionText: "Complete the series: 12, 24, 72, 288, 1440, ?",
    optionA: "A) 7200",
    optionB: "B) 8640",
    optionC: "C) 9120",
    optionD: "D) 10080",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 18,
    questionText: "Find the correct water image of the word: COOPERATION",
    optionA: "A) ƆOObƎb∀┴IOИ",
    optionB: "B) COObƎb∀┴IOИ",
    optionC: "C) ƆOO𐐚Ǝb∀┴IOИ",
    optionD: "D) ƆOObƎbA┴IOИ",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 19,
    questionText: "How many minutes match past 4 o'clock such that hands are exactly perpendicular first?",
    optionA: "A) 5-5/11 min past 4",
    optionB: "B) 6 min past 4",
    optionC: "C) 5 min past 4",
    optionD: "D) 7 min past 4",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 20,
    questionText: "Complete index pairs: 2A, 4D, 8I, 16P, ?",
    optionA: "A) 32Y",
    optionB: "B) 32Z",
    optionC: "C) 64Y",
    optionD: "D) 32X",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 21,
    questionText: "Find the correct mirror image of the word: REPRODUCTION",
    optionA: "A) NOITCUDORPER",
    optionB: "B) 𐌎OIꓕƆUᗡOЯ𐌐ƎЯ",
    optionC: "C) 𐌎OITƆUᗡOЯ𐌐ƎЯ",
    optionD: "D) 𐌎OIꓕƆUᗡOЯPƎЯ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 22,
    questionText: "Spot the odd visual framework category: Cube, Sphere, Cylinder, Circle",
    optionA: "A) Cube",
    optionB: "B) Sphere",
    optionC: "C) Cylinder",
    optionD: "D) Circle",
    correctOption: "D",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 23,
    questionText: "Complete the series: 10, 19, 40, 77, 134, ?",
    optionA: "A) 211",
    optionB: "B) 215",
    optionC: "C) 219",
    optionD: "D) 223",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 24,
    questionText: "Find the correct water image of the word: REPRODUCTION",
    optionA: "A) bƎbboᗡ∩Ɔ┴IOИ",
    optionB: "B) bƎbboᗡUƆ┴IOИ",
    optionC: "C) bƎ𐐚boᗡ∩Ɔ┴IOИ",
    optionD: "D) RƎbboᗡ∩Ɔ┴IOИ",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 25,
    questionText: "A reflection inside a flat mirror reveals clock pin setups reading exactly 12:00. What is actual time?",
    optionA: "A) 6:00",
    optionB: "B) 12:00",
    optionC: "C) 3:00",
    optionD: "D) 9:00",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 26,
    questionText: "Complete the letter series: J10, L12, N14, P16, ?",
    optionA: "A) R18",
    optionB: "B) S19",
    optionC: "C) Q17",
    optionD: "D) T20",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 27,
    questionText: "Find the correct mirror image of the word: CHRONOLOGY",
    optionA: "A) YGOLONORHC",
    optionB: "B) ⅄ӘO⅃OИOЯHƆ",
    optionC: "C) YӘO⅃OИOЯHƆ",
    optionD: "D) ⅄GO⅃OИOЯHƆ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 28,
    questionText: "Complete pattern link analogy: Up : Down :: North : ?",
    optionA: "A) East",
    optionB: "B) West",
    optionC: "C) South",
    optionD: "D) Center",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 29,
    questionText: "Find the correct water image of the word: CHRONOLOGY",
    optionA: "A) ƆHboИOГOeλ",
    optionB: "B) CHboИOГOeλ",
    optionC: "C) ƆHboИOГOeY",
    optionD: "D) ƆHboNOГOeλ",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 30,
    questionText: "Complete index series: C3, E5, G7, I9, ?",
    optionA: "A) K11",
    optionB: "B) J10",
    optionC: "C) L12",
    optionD: "D) M13",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  }
];

async function importBTech2ndYearSet3() {
  const transaction = await sequelize.transaction();
  try {
    console.log('=== IMPORTING QUESTIONS TO B.TECH 2ND YEAR — SET 3 ===\n');

    let round = await QuizRound.findOne({
      where: { roundNumber: 13 },
      transaction
    });

    if (!round) {
      console.log('Round #13 not found by roundNumber=13, searching by title...');
      round = await QuizRound.findOne({
        where: { title: 'Logical Reasoning - B.Tech 2nd Year — SET 3' },
        transaction
      });
    }

    if (!round) {
      throw new Error('Target round "Logical Reasoning - B.Tech 2nd Year — SET 3" not found!');
    }

    console.log(`Target Round ID: ${round.id} | Title: "${round.title}"`);

    let insertedCount = 0;
    let skippedCount = 0;

    for (const q of questionsData) {
      const existing = await Question.findOne({
        where: {
          roundId: round.id,
          questionOrder: q.questionOrder
        },
        transaction
      });

      if (existing) {
        console.log(`[SKIPPED] Q${q.questionOrder} already exists in Set 3 (ID: ${existing.id}).`);
        skippedCount++;
      } else {
        const created = await Question.create(
          {
            roundId: round.id,
            questionText: q.questionText,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctOption: q.correctOption,
            marks: q.marks,
            questionOrder: q.questionOrder,
            isActive: q.isActive
          },
          { transaction }
        );
        console.log(`[INSERTED] Q${q.questionOrder}: "${created.questionText.slice(0, 40)}..." -> Correct Option: ${created.correctOption}`);
        insertedCount++;
      }
    }

    // Ensure total marks = 30.00
    round.totalMarks = 30.0;
    await round.save({ transaction });

    await transaction.commit();

    console.log(`\nImport completed!`);
    console.log(`Questions inserted: ${insertedCount}`);
    console.log(`Duplicates skipped: ${skippedCount}`);

    const finalCount = await Question.count({ where: { roundId: round.id } });
    console.log(`Final Question Count for B.Tech 2nd Year SET 3: ${finalCount}`);

  } catch (err) {
    await transaction.rollback();
    console.error('❌ Import failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

importBTech2ndYearSet3();
