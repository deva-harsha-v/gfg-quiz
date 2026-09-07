require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const questionsData = [
  {
    questionOrder: 1,
    questionText: "Complete the series: 1, 5, 14, 30, 55, 91, ?",
    optionA: "(A) 130",
    optionB: "(B) 136",
    optionC: "(C) 140",
    optionD: "(D) 144",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 2,
    questionText: "Find the correct water image of the word: ACKNOWLEDGEMENT",
    optionA: "(A) ∀ƆKИOWГƎᗡeƎWƎИ┴",
    optionB: "(B) ∀ƆKИOWГƎᗡGEWƎИ┴",
    optionC: "(C) ∀ƆKИOWГEᗡeƎWƎИ┴",
    optionD: "(D) ∀ƆKИOWГƎbeƎWƎИ┴",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 3,
    questionText: "At what time between 1 and 2 o'clock are the hands of a clock at right angles?",
    optionA: "(A) 21-9/11 min past 1",
    optionB: "(B) 22 min past 1",
    optionC: "(C) 21-5/11 min past 1",
    optionD: "(D) 23 min past 1",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 4,
    questionText: "Complete the variable series: Z1A, X2D, V6I, T24P , ?",
    optionA: "(A) R120Y",
    optionB: "(B) S120Y",
    optionC: "(C) R120Z",
    optionD: "(D) R100Y",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 5,
    questionText: "Find the correct mirror image of the word: ACKNOWLEDGEMENT",
    optionA: "(A) TNEMEGDELWONKCA",
    optionB: "(B) ꓕИƎMƎӘᗡƎ⅃WOИʞƆA",
    optionC: "(C) ꓕИƎMƎӘᗡƎ⅃𐌚OИʞƆA",
    optionD: "(D) ꓕИƎMƎGᗡƎ⅃WOИʞƆA",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 6,
    questionText: "Complete the pattern trend: If 1 = 3, 2 = 5, 3 = 7, then 5 = ?",
    optionA: "(A) 9",
    optionB: "(B) 10",
    optionC: "(C) 11",
    optionD: "(D) 13",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 7,
    questionText: "Complete the series: 7, 26, 63, 124, 215, ?",
    optionA: "(A) 342",
    optionB: "(B) 343",
    optionC: "(C) 344",
    optionD: "(D) 345",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 8,
    questionText: "Find the correct mirror image of the word: ENVIRONMENT",
    optionA: "(A) TNEMNORIVNE",
    optionB: "(B) ꓕИƎMИOЯIVИƎ",
    optionC: "(C) ꓕИƎMИOЯIVNƎ",
    optionD: "(D) ꓕNƎMИOЯIVИƎ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 9,
    questionText: "A clock loses 3 minutes every hour. Set right at 6 a.m., what time will it indicate at 6 p.m. same night?",
    optionA: "(A) 5:24 p.m.",
    optionB: "(B) 5:36 p.m.",
    optionC: "(C) 6:36 p.m.",
    optionD: "(D) 5:42 p.m.",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 10,
    questionText: "Find the anomaly pattern block option out:",
    optionA: "(A) Base",
    optionB: "(B) Core",
    optionC: "(C) Foundation",
    optionD: "(D) Root",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 11,
    questionText: "Find the correct water image of the word: ENVIRONMENT",
    optionA: "(A) ƎИΛIbOИWƎИ┴",
    optionB: "(B) ƎИΛIbOИMƎИ┴",
    optionC: "(C) ƎNΛIbOИWƎИ┴",
    optionD: "(D) ƎИΛIbOИWƎN┴",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 12,
    questionText: "Complete the alphanumeric letter series: D4F, H8J, L12N, ?",
    optionA: "(A) P16R",
    optionB: "(B) O16Q",
    optionC: "(C) P15R",
    optionD: "(D) Q16S",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 13,
    questionText: "Complete the series: 2, 3, 8, 27, 112, ?",
    optionA: "(A) 545",
    optionB: "(B) 565",
    optionC: "(C) 575",
    optionD: "(D) 585",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 14,
    questionText: "What angle passes through the minute hand in 45 minutes?",
    optionA: "(A) 180°",
    optionB: "(B) 270°",
    optionC: "(C) 90°",
    optionD: "(D) 315°",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 15,
    questionText: "Solve pattern equation array: If A+B=C, D-C=A, what does E plus A mean if sequence is basic numeric indices?",
    optionA: "(A) F",
    optionB: "(B) G",
    optionC: "(C) H",
    optionD: "(D) I",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 16,
    questionText: "Find the correct mirror image of the word: PARLIAMENT",
    optionA: "(A) TNEMAILRAP",
    optionB: "(B) ꓕИƎMIA⅃ЯA𐌐",
    optionC: "(C) ꓕИƎMIA⅃ЯA9",
    optionD: "(D) ꓕNƎMIA⅃ЯA𐌐",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 17,
    questionText: "Find the correct water image of the word: PARLIAMENT",
    optionA: "(A) b∀bГI∀WƎИ┴",
    optionB: "(B) b∀bГI∀MƎИ┴",
    optionC: "(C) d∀bГI∀WƎИ┴",
    optionD: "(D) b∀bГIAWƎИ┴",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 18,
    questionText: "Complete the series: 5, 6, 10, 19, 35, ?",
    optionA: "(A) 54",
    optionB: "(B) 58",
    optionC: "(C) 60",
    optionD: "(D) 64",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 19,
    questionText: "How many times inside standard 12 hours cycle do clock hands point in clean opposite alignments?",
    optionA: "(A) 10",
    optionB: "(B) 11",
    optionC: "(C) 12",
    optionD: "(D) 22",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 20,
    questionText: "Complete the letter series pattern: A2B, D4E, G6H, ?",
    optionA: "(A) J8K",
    optionB: "(B) I8J",
    optionC: "(C) J7K",
    optionD: "(D) K8L",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 21,
    questionText: "Find the correct water image of the word: DISADVANTAGE",
    optionA: "(A) ᗡIƧ∀ᗡΛ∀И┴∀eƎ",
    optionB: "(B) ᗡIS∀ᗡΛ∀И┴∀eƎ",
    optionC: "(C) ᗡIƧ∀ᗡΛ∀N┴∀eƎ",
    optionD: "(D) ᗡIƧ∀ᗡΛ∀И┴∀GE",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 22,
    questionText: "Find the correct mirror image of the word: DISADVANTAGE",
    optionA: "(A) EGATNAVDASID",
    optionB: "(B) ƎӘAꓕИAVᗡAƧIᗡ",
    optionC: "(C) ƎӘAꓕNAVDASID",
    optionD: "(D) ƎGAꓕИAVᗡAƧIᗡ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 23,
    questionText: "Complete the series: 2, 10, 30, 68, 130, ?",
    optionA: "(A) 216",
    optionB: "(B) 220",
    optionC: "(C) 222",
    optionD: "(D) 224",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 24,
    questionText: "A clock mirrors exactly 6:00. What actual hour position value scale does it track?",
    optionA: "(A) 12:00",
    optionB: "(B) 6:00",
    optionC: "(C) 3:00",
    optionD: "(D) 9:00",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 25,
    questionText: "Complete code pattern recognition: Word \"TEN\" is 40. Then \"NET\" is:",
    optionA: "(A) 30",
    optionB: "(B) 40",
    optionC: "(C) 50",
    optionD: "(D) 60",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 26,
    questionText: "Find the correct water image of the word: ARCHITECTURE",
    optionA: "(A) ∀bƆHI┴ƎƆ┴∩bƎ",
    optionB: "(B) ∀bƆHI┴ƎƆ┴UbƎ",
    optionC: "(C) ∀bƆHI┴EƆ┴∩bƎ",
    optionD: "(D) ∀bƆHI┴ƎƆ┴∩bE",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 27,
    questionText: "Find the value match sequence: W-144, U-121, S-100, ?",
    optionA: "(A) Q-81",
    optionB: "(B) R-81",
    optionC: "(C) Q-64",
    optionD: "(D) P-81",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 28,
    questionText: "Complete the series: 13, 14, 18, 27, 43, ?",
    optionA: "(A) 64",
    optionB: "(B) 68",
    optionC: "(C) 72",
    optionD: "(D) 76",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 29,
    questionText: "Spot the odd numerical value classification block out:",
    optionA: "(A) 143",
    optionB: "(B) 168",
    optionC: "(C) 195",
    optionD: "(D) 224",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 30,
    questionText: "Find the correct mirror image of the word: ARCHITECTURE",
    optionA: "(A) ERUTCETIHCRA",
    optionB: "(B) ƎЯUꓕƆƎꓕIHCЯA",
    optionC: "(C) ƎЯUꓕƆƎꓕIHCЯA",
    optionD: "(D) ƎЯUꓕƆEꓕIHCЯA",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  }
];

async function importBTech3rdYearSet2() {
  const transaction = await sequelize.transaction();
  try {
    console.log('=== IMPORTING QUESTIONS TO B.TECH 3RD YEAR — SET 2 ===\n');

    let round = await QuizRound.findOne({
      where: { roundNumber: 17 },
      transaction
    });

    if (!round) {
      console.log('Round #17 not found by roundNumber=17, searching by title...');
      round = await QuizRound.findOne({
        where: { title: 'Logical Reasoning - B.Tech 3rd Year — SET 2' },
        transaction
      });
    }

    if (!round) {
      throw new Error('Target round "Logical Reasoning - B.Tech 3rd Year — SET 2" not found!');
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
        console.log(`[SKIPPED] Q${q.questionOrder} already exists in Set 2 (ID: ${existing.id}).`);
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
    console.log(`Final Question Count for B.Tech 3rd Year SET 2: ${finalCount}`);

  } catch (err) {
    await transaction.rollback();
    console.error('❌ Import failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

importBTech3rdYearSet2();
