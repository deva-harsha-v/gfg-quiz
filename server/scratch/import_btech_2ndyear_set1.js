require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const questionsData = [
  {
    questionOrder: 1,
    questionText: "Complete the series: 2, 7, 24, 77, 238, ?",
    optionA: "(A) 715",
    optionB: "(B) 723",
    optionC: "(C) 731",
    optionD: "(D) 745",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 2,
    questionText: "Find the correct water image of the word: PERPENDICULAR",
    optionA: "(A) RALUCIDNEPREP",
    optionB: "(B) ЯA⅃UƆIᗡИƎ𐌐ЯƎ𐌐",
    optionC: "(C) ЯA⅃UƆIᗡNƎ𐌐ЯƎ𐌐",
    optionD: "(D) ЯA⅃UƆIDИƎ𐌐ЯƎ𐌐",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 3,
    questionText: "At what time between 8 and 9 o'clock will the hands of a clock be in a straight line but not together?",
    optionA: "(A) 10-10/11 min past 8",
    optionB: "(B) 12 min past 8",
    optionC: "(C) 11-5/11 min past 8",
    optionD: "(D) 10 min past 8",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 4,
    questionText: "Complete the letter series: WYV, UXT, SWR, ?",
    optionA: "(A) QVP",
    optionB: "(B) QWP",
    optionC: "(C) RVP",
    optionD: "(D) QVX",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 5,
    questionText: "Find the correct mirror image of the word: PERPENDICULAR",
    optionA: "(A) RALUCIDNEPREP",
    optionB: "(B) ЯA⅃UƆIᗡИƎ𐌐ЯƎ𐌐",
    optionC: "(C) ЯA⅃UƆIᗡNƎ𐌐ЯƎ𐌐",
    optionD: "(D) ЯA⅃UƆIDИƎ𐌐ЯƎ𐌐",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 6,
    questionText: "Complete the pattern analogy: Ocean : Water :: Glacier : ?",
    optionA: "(A) Ice",
    optionB: "(B) Mountain",
    optionC: "(C) River",
    optionD: "(D) Cave",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 7,
    questionText: "Complete the series: 99, 90, 74, 49, ?",
    optionA: "(A) 11",
    optionB: "(B) 13",
    optionC: "(C) 15",
    optionD: "(D) 17",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 8,
    questionText: "Find the correct water image of the word: PHENOMENON",
    optionA: "(A) NONEMONEHP",
    optionB: "(B) 𐌎O𐌌ƎИO𐌌ƎH𐌐",
    optionC: "(C) 𐌎O𐌼ƎИO𐌌ƎHꟼ",
    optionD: "(D) 𐌎O𐌌ƎИO𐌌ƎHꟼ",
    correctOption: "D",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 9,
    questionText: "Find the angle traced out by the hour hand of a clock between 5:00 a.m. and 11:30 a.m. on the same day:",
    optionA: "(A) 180°",
    optionB: "(B) 195°",
    optionC: "(C) 210°",
    optionD: "(D) 225°",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 10,
    questionText: "Complete the matrix classification grid:\n\n4 9 2\n3 5 7\n8 1 ?",
    optionA: "(A) 5",
    optionB: "(B) 6",
    optionC: "(C) 7",
    optionD: "(D) 8",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 11,
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
    questionOrder: 12,
    questionText: "Find the correct mirror image of the word: PHENOMENON",
    optionA: "(A) NONEMONEHP",
    optionB: "(B) 𐌎O𐌌ƎИO𐌌ƎH𐌐",
    optionC: "(C) 𐌎O𐌼ƎИO𐌌ƎHꟼ",
    optionD: "(D) 𐌎O𐌌ƎИO𐌌ƎHꟼ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 13,
    questionText: "Complete the series: 4, 11, 30, 67, 128, ?",
    optionA: "(A) 211",
    optionB: "(B) 215",
    optionC: "(C) 219",
    optionD: "(D) 223",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 14,
    questionText: "Find the correct water image of the word: INFRASTRUCTURE",
    optionA: "(A) ERUTCURTSARFNI",
    optionB: "(B) ƎЯUꓕƆUЯꓕƧAЯℲИI",
    optionC: "(C) ƎЯUꓕƆUЯꓕƧAЯℲNI",
    optionD: "(D) ƎЯUꓕƆUЯꓕSARRℲИI",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 15,
    questionText: "If a clock shows 3:15, what will be the reflection time when seen inside a vertical mirror mirror?",
    optionA: "(A) 8:45",
    optionB: "(B) 9:45",
    optionC: "(C) 8:15",
    optionD: "(D) 9:15",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 16,
    questionText: "If \"CAT\" is coded as 24-26-7, how is \"DOG\" written in this reverse pattern style?",
    optionA: "(A) 23-12-20",
    optionB: "(B) 22-11-19",
    optionC: "(C) 23-11-20",
    optionD: "(D) 24-12-19",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 17,
    questionText: "Complete the series: 1, 6, 15, 28, 45, ?",
    optionA: "(A) 62",
    optionB: "(B) 66",
    optionC: "(C) 70",
    optionD: "(D) 74",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 18,
    questionText: "Find the correct mirror image of the word: INFRASTRUCTURE",
    optionA: "(A) ERUTCURTSARFNI",
    optionB: "(B) ƎЯUꓕƆUЯꓕƧAЯℲИI",
    optionC: "(C) ƎЯUꓕƆUЯꓕƧAЯℲNI",
    optionD: "(D) ƎЯUꓕƆUЯꓕSARRℲИI",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 19,
    questionText: "A clock gains 10 seconds every 5 minutes. If it was set right at 9 a.m., what time will it display at 3 p.m. on the same day?",
    optionA: "(A) 3:10 p.m.",
    optionB: "(B) 3:12 p.m.",
    optionC: "(C) 3:15 p.m.",
    optionD: "(D) 3:08 p.m.",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 20,
    questionText: "Complete the letter series: BDF, CFI, DHL, ?",
    optionA: "(A) EJM",
    optionB: "(B) EJO",
    optionC: "(C) EMI",
    optionD: "(D) EKP",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 21,
    questionText: "Find the correct water image of the word: REFRIGERATION",
    optionA: "(A) NOITAREGIRFER",
    optionB: "(B) 𐌎OIꓕAЯƎӘIЯ𐑵ƎЯ",
    optionC: "(C) 𐌎OIꓕAЯƎGIЯℲƎЯ",
    optionD: "(D) 𐌎OIT_A_ЯƎӘIЯ𐑵ƎЯ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 22,
    questionText: "Complete the logical numeric sequence pattern: 12 : 144 :: 13 : ?",
    optionA: "(A) 156",
    optionB: "(B) 165",
    optionC: "(C) 169",
    optionD: "(D) 182",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 23,
    questionText: "Complete the series: 3, 5, 13, 43, 177, ?",
    optionA: "(A) 865",
    optionB: "(B) 875",
    optionC: "(C) 885",
    optionD: "(D) 895",
    correctOption: "D",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 24,
    questionText: "Find the correct mirror image of the word: REFRIGERATION",
    optionA: "(A) NOITAREGIRFER",
    optionB: "(B) 𐌎OIꓕAЯƎӘIЯ𐑵ƎЯ",
    optionC: "(C) 𐌎OIꓕAЯƎGIЯℲƎЯ",
    optionD: "(D) 𐌎OIT_A_ЯƎӘIЯ𐑵ƎЯ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 25,
    questionText: "What is the angle between the hour hand and the minute hand of a clock at 2:30?",
    optionA: "(A) 105°",
    optionB: "(B) 115°",
    optionC: "(C) 120°",
    optionD: "(D) 135°",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 26,
    questionText: "Complete the letter series: BD, GI, LN, QS, ?",
    optionA: "(A) VX",
    optionB: "(B) WY",
    optionC: "(C) UX",
    optionD: "(D) TV",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 27,
    questionText: "Find the correct water image of the word: PSYCHIATRIST",
    optionA: "(A) TSIRTAIHCYSP",
    optionB: "(B) ꓕƧIЯꓕAIHƆ⅄𐌐Ƨ",
    optionC: "(C) ꓕƧIЯꓕAIHƆƎ𐌐Ƨ",
    optionD: "(D) ꓕƧIЯꓕAIHƆY𐌐Ƨ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 28,
    questionText: "Find the missing entry code from the sequence pattern: ABC : ZYX :: DEF : ?",
    optionA: "(A) UVW",
    optionB: "(B) WVU",
    optionC: "(C) VUT",
    optionD: "(D) STU",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 29,
    questionText: "Find the correct mirror image of the word: PSYCHIATRIST",
    optionA: "(A) TSIRTAIHCYSP",
    optionB: "(B) ꓕƧIЯꓕAIHƆ⅄𐌐Ƨ",
    optionC: "(C) ꓕƧIЯꓕAIHƆƎ𐌐Ƨ",
    optionD: "(D) ꓕƧIЯꓕAIHƆY𐌐Ƨ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 30,
    questionText: "Complete the letter series: CE, FI, JL, MP, ?",
    optionA: "(A) QT",
    optionB: "(B) OR",
    optionC: "(C) QU",
    optionD: "(D) PR",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  }
];

async function importBTech2ndYearSet1() {
  const transaction = await sequelize.transaction();
  try {
    console.log('=== IMPORTING QUESTIONS TO B.TECH 2ND YEAR — SET 1 ===\n');

    let round = await QuizRound.findOne({
      where: { roundNumber: 11 },
      transaction
    });

    if (!round) {
      console.log('Round #11 not found by roundNumber=11, searching by title...');
      round = await QuizRound.findOne({
        where: { title: 'Logical Reasoning - B.Tech 2nd Year — SET 1' },
        transaction
      });
    }

    if (!round) {
      throw new Error('Target round "Logical Reasoning - B.Tech 2nd Year — SET 1" not found!');
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
    console.log(`Final Question Count for B.Tech 2nd Year SET 1: ${finalCount}`);

  } catch (err) {
    await transaction.rollback();
    console.error('❌ Import failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

importBTech2ndYearSet1();
