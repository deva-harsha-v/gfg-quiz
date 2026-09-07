require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const questionsData = [
  {
    questionOrder: 1,
    questionText: "Complete the series: 4, 5, 9, 18, 34, ?",
    optionA: "(A) 55",
    optionB: "(B) 59",
    optionC: "(C) 63",
    optionD: "(D) 67",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 2,
    questionText: "Find the correct mirror image of the word: BROADCASTING",
    optionA: "(A) GNITSACDAORB",
    optionB: "(B) ⅁ИIꓕƧAƆᗡAOЯ𐐚",
    optionC: "(C) ⅁ИIꓕƧAƆᗡAOЯB",
    optionD: "(D) GNITSAƆᗡAOЯ𐐚",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 3,
    questionText: "At 3:00, the minute hand points North. In which direction does the hour hand point at 9:00?",
    optionA: "(A) South",
    optionB: "(B) East",
    optionC: "(C) West",
    optionD: "(D) North-West",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 4,
    questionText: "Complete the alphanumeric letter series: 2A, 4D, 8I, 16P , ?",
    optionA: "(A) 32Y",
    optionB: "(B) 32Z",
    optionC: "(C) 64Y",
    optionD: "(D) 32X",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 5,
    questionText: "Find the correct water image of the word: BROADCASTING",
    optionA: "(A) bbo∀ᗡƆ∀Ƨ┴IИe",
    optionB: "(B) 𐐚bO∀ᗡƆ∀Ƨ┴IИe",
    optionC: "(C) bbo∀ᗡƆ∀S┴IИe",
    optionD: "(D) bbo∀ᗡƆ∀Ƨ┴IИG",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 6,
    questionText: "Recognize the classification matching relation: Sound is to Cacophony as Smell is to:",
    optionA: "(A) Perfume",
    optionB: "(B) Stench",
    optionC: "(C) Aroma",
    optionD: "(D) Fragrance",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 7,
    questionText: "Complete the series: 6, 11, 21, 36, 56, ?",
    optionA: "(A) 76",
    optionB: "(B) 81",
    optionC: "(C) 86",
    optionD: "(D) 91",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 8,
    questionText: "Find the correct mirror image of the word: EXPERIMENT",
    optionA: "(A) TNEMIREPXE",
    optionB: "(B) ꓕИƎMIЯƎ𐌞Ǝ",
    optionC: "(C) ꓕИƎMIЯƎ𐌞Ǝ",
    optionD: "(D) ꓕИƎMIЯƎ𐌞E",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 9,
    questionText: "Find what reflex angle coordinates align between standard clock pin points at exactly 4:40:",
    optionA: "(A) 100°",
    optionB: "(B) 240°",
    optionC: "(C) 260°",
    optionD: "(D) 280°",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 10,
    questionText: "Complete logic link: Triangle has 3 lines, Pentagon has 5 lines, then Decagon has:",
    optionA: "(A) 8 lines",
    optionB: "(B) 10 lines",
    optionC: "(C) 12 lines",
    optionD: "(D) 15 lines",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 11,
    questionText: "Find the correct water image of the word: EXPERIMENT",
    optionA: "(A) EXbƎbIWƎИ┴",
    optionB: "(B) EXbƎbIMƎИ┴",
    optionC: "(C) ƎXbƎbIWƎИ┴",
    optionD: "(D) EXbƎbIWƎN┴",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 12,
    questionText: "Complete the letter values: J10, L12, N14, P16, ?",
    optionA: "(A) R18",
    optionB: "(B) S19",
    optionC: "(C) Q17",
    optionD: "(D) T20",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 13,
    questionText: "Complete the series: 1, 3, 7, 15, 31, 63, ?",
    optionA: "(A) 123",
    optionB: "(B) 125",
    optionC: "(C) 127",
    optionD: "(D) 129",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 14,
    questionText: "How many full circular round cycles does the fast minute tracker cross over 48 hours?",
    optionA: "(A) 24",
    optionB: "(B) 48",
    optionC: "(C) 72",
    optionD: "(D) 96",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 15,
    questionText: "Solve numeric trend logical condition: If 111 = 9, 222 = 18, then 333 = ?",
    optionA: "(A) 21",
    optionB: "(B) 27",
    optionC: "(C) 36",
    optionD: "(D) 45",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 16,
    questionText: "Find the correct mirror image of the word: INDEPENDENCE",
    optionA: "(A) ECNEDNEPEDNI",
    optionB: "(B) ƎƆИƎᗡИƎᗡƎ𐌐ИI",
    optionC: "(C) ƎƆИƎᗡИƎᗡƎ𐌐NI",
    optionD: "(D) ƎƆNƎᗡИƎᗡƎ𐌐ИI",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 17,
    questionText: "Find the correct water image of the word: INDEPENDENCE",
    optionA: "(A) IИᗡƎbƎИᗡƎИƆƎ",
    optionB: "(B) IИᗡƎbƎNᗡƎИƆƎ",
    optionC: "(C) INᗡƎbƎИᗡƎИƆƎ",
    optionD: "(D) IИᗡEbaИᗡƎИƆƎ",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 18,
    questionText: "Complete the series: 10, 12, 16, 24, 40, ?",
    optionA: "(A) 64",
    optionB: "(B) 72",
    optionC: "(C) 76",
    optionD: "(D) 80",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 19,
    questionText: "At what precise timing stamp interval between 12:00 and 1:00 do hands intersect clean over each other?",
    optionA: "(A) 12:00",
    optionB: "(B) 12:05",
    optionC: "(C) 12:05-5/11",
    optionD: "(D) Never intersecting",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 20,
    questionText: "Complete index pairs: C3, E5, G7, I9, ?",
    optionA: "(A) K11",
    optionB: "(B) J10",
    optionC: "(C) L12",
    optionD: "(D) M13",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 21,
    questionText: "Find the correct water image of the word: COOPERATION",
    optionA: "(A) ƆOObƎb∀┴IOИ",
    optionB: "(B) COObƎb∀┴IOИ",
    optionC: "(C) ƆOO𐐚Ǝb∀┴IOИ",
    optionD: "(D) ƆOObƎbA┴IOИ",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 22,
    questionText: "Find the correct mirror image of the word: COOPERATION",
    optionA: "(A) NOITAREPOOC",
    optionB: "(B) 𐌎OIꓕAЯƎ𐌐OOƆ",
    optionC: "(C) 𐌎OIT_A_ЯƎ𐌐OOƆ",
    optionD: "(D) 𐌎OIꓕAЯE𐌐OOƆ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 23,
    questionText: "Complete the series: 2, 3, 7, 16, 32, ?",
    optionA: "(A) 49",
    optionB: "(B) 53",
    optionC: "(C) 57",
    optionD: "(D) 61",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 24,
    questionText: "Find tracking matching view time: Real dial state says 9:15. What reflection reading displays?",
    optionA: "(A) 2:45",
    optionB: "(B) 3:45",
    optionC: "(C) 2:15",
    optionD: "(D) 3:15",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 25,
    questionText: "Complete sequence visual grid analogy logic rule: Up : Down :: Left : ?",
    optionA: "(A) Front",
    optionB: "(B) Right",
    optionC: "(C) Back",
    optionD: "(D) Diagonal",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 26,
    questionText: "Find the correct water image of the word: REPRODUCTION",
    optionA: "(A) bƎbboᗡ∩Ɔ┴IOИ",
    optionB: "(B) bƎbboᗡUƆ┴IOИ",
    optionC: "(C) bƎ𐐚boᗡ∩Ɔ┴IOИ",
    optionD: "(D) RƎbboᗡ∩Ɔ┴IOИ",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 27,
    questionText: "Complete progression sequence item pair: B2, D4, H8, P16, ?",
    optionA: "(A) F6",
    optionB: "(B) J10",
    optionC: "(C) Z26",
    optionD: "(D) D4 standard variable variation",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 28,
    questionText: "Complete the series: 9, 11, 15, 23, 39, ?",
    optionA: "(A) 67",
    optionB: "(B) 71",
    optionC: "(C) 75",
    optionD: "(D) 79",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 29,
    questionText: "Spot the missing numerical matrix entry coordinate:\n\n2   4   8\n3   9   27\n4   16  ?",
    optionA: "(A) 36",
    optionB: "(B) 48",
    optionC: "(C) 64",
    optionD: "(D) 80",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 30,
    questionText: "Find the correct mirror image of the word: REPRODUCTION",
    optionA: "(A) NOITCUDORPER",
    optionB: "(B) 𐌎OIꓕƆUᗡOЯ𐌐ƎЯ",
    optionC: "(C) 𐌎OITƆUᗡOЯ𐌐ƎЯ",
    optionD: "(D) 𐌎OIꓕƆUᗡOЯPƎЯ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  }
];

async function importBTech3rdYearSet1() {
  const transaction = await sequelize.transaction();
  try {
    console.log('=== IMPORTING QUESTIONS TO B.TECH 3RD YEAR — SET 1 ===\n');

    let round = await QuizRound.findOne({
      where: { roundNumber: 16 },
      transaction
    });

    if (!round) {
      console.log('Round #16 not found by roundNumber=16, searching by title...');
      round = await QuizRound.findOne({
        where: { title: 'Logical Reasoning - B.Tech 3rd Year — SET 1' },
        transaction
      });
    }

    if (!round) {
      throw new Error('Target round "Logical Reasoning - B.Tech 3rd Year — SET 1" not found!');
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
        console.log(`[SKIPPED] Q${q.questionOrder} already exists in Set 1 (ID: ${existing.id}).`);
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
    console.log(`Final Question Count for B.Tech 3rd Year SET 1: ${finalCount}`);

  } catch (err) {
    await transaction.rollback();
    console.error('❌ Import failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

importBTech3rdYearSet1();
