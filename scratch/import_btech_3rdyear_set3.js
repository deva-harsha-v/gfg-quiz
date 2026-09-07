require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const questionsData = [
  {
    questionOrder: 1,
    questionText: "Complete the series: 4, 9, 29, 119, 599, ?",
    optionA: "(A) 2999",
    optionB: "(B) 3594",
    optionC: "(C) 3599",
    optionD: "(D) 3600",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 2,
    questionText: "Find the correct mirror image of the word: TRANSFORMATION",
    optionA: "(A) NOITAMROFSNART",
    optionB: "(B) 𐌎OIꓕA𐌌ЯOℲƧИAЯꓕ",
    optionC: "(C) 𐌎OIꓕA𐌌ЯOℲƧИAЯT",
    optionD: "(D) 𐌎OIT_A_𐌌ЯOℲƧИAЯꓕ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 3,
    questionText: "At what time between 9 and 10 o'clock will the hands of a watch be together?",
    optionA: "(A) 45 min past 9",
    optionB: "(B) 49-1/11 min past 9",
    optionC: "(C) 48-2/11 min past 9",
    optionD: "(D) 50 min past 9",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 4,
    questionText: "Complete the letter series: AB, DE, GH, JK, ?",
    optionA: "(A) MN",
    optionB: "(B) LM",
    optionC: "(C) NO",
    optionD: "(D) OP",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 5,
    questionText: "Find the correct water image of the word: TRANSFORMATION",
    optionA: "(A) ┴b∀ИƧℲObW∀┴IOИ",
    optionB: "(B) ┴b∀ИƧℲObM∀┴IOИ",
    optionC: "(C) ┴b∀NƧℲObW∀┴IOИ",
    optionD: "(D) ┴Я∀ИƧℲObW∀┴IOИ",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 6,
    questionText: "Match the pattern class: Yard is to Inch as Quart is to:",
    optionA: "(A) Gallon",
    optionB: "(B) Ounce",
    optionC: "(C) Ounce Pint",
    optionD: "(D) Fluid Ounce",
    correctOption: "D",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 7,
    questionText: "Complete the series: 11, 13, 17, 19, 23, 29, ?",
    optionA: "(A) 31",
    optionB: "(B) 33",
    optionC: "(C) 35",
    optionD: "(D) 37",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 8,
    questionText: "Find the correct mirror image of the word: JEALOUSY",
    optionA: "(A) YSUOLAEJ",
    optionB: "(B) ⅄ƧU_O_⅃AƎᒐ",
    optionC: "(C) ⅄ƧUOLAEᒐ",
    optionD: "(D) YƧU_O_⅃AƎᒐ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 9,
    questionText: "Find the angle traced out by an hour hand from 2 p.m. to 7:15 p.m. on the same day:",
    optionA: "(A) 142.5°",
    optionB: "(B) 152.5°",
    optionC: "(C) 157.5°",
    optionD: "(D) 160°",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 10,
    questionText: "Pattern logic find: If 5472 = 9, 6342 = 6, then 7584 = ?",
    optionA: "(A) 6",
    optionB: "(B) 8",
    optionC: "(C) 12",
    optionD: "(D) 16",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 11,
    questionText: "Find the correct water image of the word: JEALOUSY",
    optionA: "(A) 𐌋Ǝ∀ГO∩Ƨλ",
    optionB: "(B) 𐌋Ǝ∀ГO∩Sλ",
    optionC: "(C) 𐌋E∀ГO∩Ƨλ",
    optionD: "(D) ᒐƎ∀ГO∩Ƨλ",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 12,
    questionText: "Complete the letter series: ZW, TO, NJ, ?",
    optionA: "(A) KF",
    optionB: "(B) JG",
    optionC: "(C) KH",
    optionD: "(D) KI",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 13,
    questionText: "Complete the series: 20, 24, 33, 49, 74, ?",
    optionA: "(A) 105",
    optionB: "(B) 110",
    optionC: "(C) 114",
    optionD: "(D) 118",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 14,
    questionText: "Mirror image clock time: The hands show 4:10 inside a mirror. What is the true time?",
    optionA: "(A) 7:50",
    optionB: "(B) 8:50",
    optionC: "(C) 7:10",
    optionD: "(D) 8:10",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 15,
    questionText: "Complete the matrix trend array:\n7   9   21\n11  4   22\n13  7   ?",
    optionA: "(A) 24",
    optionB: "(B) 26",
    optionC: "(C) 28",
    optionD: "(D) 30",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 16,
    questionText: "Find the correct mirror image of the word: QUARANTINE",
    optionA: "(A) ENITNARAUQ",
    optionB: "(B) ƎИIꓕИAЯAUϘ",
    optionC: "(C) ƎИIꓕИAЯA_U_Ϙ",
    optionD: "(D) ƎИIꓕИAЯAUQ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 17,
    questionText: "Find the correct water image of the word: QUARANTINE",
    optionA: "(A) Ơ∩∀b∀И┴IИƎ",
    optionB: "(B) ƠU∀b∀И┴IИƎ",
    optionC: "(C) Ơ∩∀b∀N┴IИƎ",
    optionD: "(D) Q∩∀b∀И┴IИƎ",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 18,
    questionText: "Complete the series: 2, 6, 12, 20, 30, 42, ?",
    optionA: "(A) 52",
    optionB: "(B) 54",
    optionC: "(C) 56",
    optionD: "(D) 58",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 19,
    questionText: "At what time between 2 and 3 o'clock will the hands of a clock be opposite to each other?",
    optionA: "(A) 43-5/11 min past 2",
    optionB: "(B) 43-7/11 min past 2",
    optionC: "(C) 40 min past 2",
    optionD: "(D) 44 min past 2",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 20,
    questionText: "Complete the letter series: AC, EG, IK, MO, ?",
    optionA: "(A) QS",
    optionB: "(B) PR",
    optionC: "(C) QR",
    optionD: "(D) QT",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 21,
    questionText: "Find the correct water image of the word: BEAUTIFUL",
    optionA: "(A) bƎ∀∩┴IℲ∩Г",
    optionB: "(B) 𐐚Ǝ∀∩┴IℲ∩Г",
    optionC: "(C) bƎ∀∩┴IℲUГ",
    optionD: "(D) bƎ∀∩┴IF∩Г",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 22,
    questionText: "Find the correct mirror image of the word: BEAUTIFUL",
    optionA: "(A) LUFITUAEB",
    optionB: "(B) ⅃U𐌚IꓕUAƎ𐐚",
    optionC: "(C) ⅃UℲIꓕUAƎ𐐚",
    optionD: "(D) ⅃UℲIꓕUAƎB",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 23,
    questionText: "Complete the series: 3, 4, 12, 45, 196, ?",
    optionA: "(A) 825",
    optionB: "(B) 925",
    optionC: "(C) 985",
    optionD: "(D) 1005",
    correctOption: "D",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 24,
    questionText: "Find the odd term out in this sequence: 3, 5, 11, 14, 17, 21",
    optionA: "(A) 11",
    optionB: "(B) 14",
    optionC: "(C) 17",
    optionD: "(D) 21",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 25,
    questionText: "Complete the alphanumeric series: B3C, E6F, H9I, ?",
    optionA: "(A) K12L",
    optionB: "(B) J12K",
    optionC: "(C) K11L",
    optionD: "(D) L12M",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 26,
    questionText: "Find the correct mirror image of the word: SCHOLARSHIP",
    optionA: "(A) PIHSRALOHCS",
    optionB: "(B) 𐌐IHƧЯA⅃OHƆƧ",
    optionC: "(C) 𐌐IHƧЯA⅃OHƆS",
    optionD: "(D) PIHƧЯA⅃OHƆƧ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 27,
    questionText: "Complete the series: 8, 12, 24, 60, 180, ?",
    optionA: "(A) 540",
    optionB: "(B) 630",
    optionC: "(C) 720",
    optionD: "(D) 810",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 28,
    questionText: "Find the correct water image of the word: SCHOLARSHIP",
    optionA: "(A) ƧƆHOГ∀bƧHIb",
    optionB: "(B) SCHOГ∀bƧHIb",
    optionC: "(C) ƧƆHOГ∀bƧHId",
    optionD: "(D) ƧƆHOГA_bƧHIb",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 29,
    questionText: "A clock gains 15 minutes per day. Set right at 12 noon, what time will it show at 4 a.m. next morning?",
    optionA: "(A) 4:10 a.m.",
    optionB: "(B) 4:15 a.m.",
    optionC: "(C) 4:20 a.m.",
    optionD: "(D) 4:30 a.m.",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 30,
    questionText: "Pattern categorization analog: Eye : Myopia :: Teeth : ?",
    optionA: "(A) Pyorrhea",
    optionB: "(B) Cataract",
    optionC: "(C) Trachoma",
    optionD: "(D) Eczema",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  }
];

async function importBTech3rdYearSet3() {
  const transaction = await sequelize.transaction();
  try {
    console.log('=== IMPORTING QUESTIONS TO B.TECH 3RD YEAR — SET 3 ===\n');

    let round = await QuizRound.findOne({
      where: { roundNumber: 18 },
      transaction
    });

    if (!round) {
      console.log('Round #18 not found by roundNumber=18, searching by title...');
      round = await QuizRound.findOne({
        where: { title: 'Logical Reasoning - B.Tech 3rd Year — SET 3' },
        transaction
      });
    }

    if (!round) {
      throw new Error('Target round "Logical Reasoning - B.Tech 3rd Year — SET 3" not found!');
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
    console.log(`Final Question Count for B.Tech 3rd Year SET 3: ${finalCount}`);

  } catch (err) {
    await transaction.rollback();
    console.error('❌ Import failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

importBTech3rdYearSet3();
