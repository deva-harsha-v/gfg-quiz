require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const questionsData = [
  {
    questionOrder: 1,
    questionText: "Complete the series: 5, 7, 14, 24, 43, 75, ?",
    optionA: "(A) 124",
    optionB: "(B) 129",
    optionC: "(C) 133",
    optionD: "(D) 137",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 2,
    questionText: "Find the correct mirror image of the word: KNOWLEDGE",
    optionA: "(A) EGDELWONK",
    optionB: "(B) ƎӘᗡƎ⅃𐌚OИʞ",
    optionC: "(C) ƎӘᗡƎ⅃WOИʞ",
    optionD: "(D) ƎGᗡƎ⅃WOИK",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 3,
    questionText: "At what angle are the hands of a clock inclined at 15 minutes past 5?",
    optionA: "(A) 58.5°",
    optionB: "(B) 64°",
    optionC: "(C) 67.5°",
    optionD: "(D) 72.5°",
    correctOption: "C",
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
    questionText: "Find the correct water image of the word: KNOWLEDGE",
    optionA: "(A) KИOWГƎᗡeƎ",
    optionB: "(B) KИOWГƎᗡGE",
    optionC: "(C) KИOWГEᗡeƎ",
    optionD: "(D) KИOWГƎbeƎ",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 6,
    questionText: "Complete the trend: 121, 144, 169, 196, ?",
    optionA: "(A) 215",
    optionB: "(B) 225",
    optionC: "(C) 244",
    optionD: "(D) 256",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 7,
    questionText: "Find the odd letter-cluster out from the pattern:",
    optionA: "(A) JOT",
    optionB: "(B) OUT",
    optionC: "(C) DOG",
    optionD: "(D) CAT",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 8,
    questionText: "Find the correct mirror image of the word: ATMOSPHERE",
    optionA: "(A) EREHPSOMTA",
    optionB: "(B) ƎЯƎH𐌐ƧO𐌌ꓕA",
    optionC: "(C) ƎЯƎHꟼƧO𐌌ꓕA",
    optionD: "(D) ƎЯƎHꟼS𐌌ꓕA",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 9,
    questionText: "How many times are the hands of a clock at right angles in a day?",
    optionA: "(A) 22",
    optionB: "(B) 24",
    optionC: "(C) 44",
    optionD: "(D) 48",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 10,
    questionText: "Complete the series: 2, 9, 28, 65, 126, ?",
    optionA: "(A) 215",
    optionB: "(B) 216",
    optionC: "(C) 217",
    optionD: "(D) 218",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 11,
    questionText: "Find the correct water image of the word: ATMOSPHERE",
    optionA: "(A) ∀┴WOƧbHƎbƎ",
    optionB: "(B) ∀┴MOƧbHƎbƎ",
    optionC: "(C) ∀┴WOƧpHƎbƎ",
    optionD: "(D) ∀┴WOƧbHƎRE",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 12,
    questionText: "Complete the pattern analogy: 42 : 56 :: 72 : ?",
    optionA: "(A) 81",
    optionB: "(B) 90",
    optionC: "(C) 92",
    optionD: "(D) 100",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 13,
    questionText: "Complete the letter series: ABC, PQR, DEF, STU, ?",
    optionA: "(A) GHI",
    optionB: "(B) VWX",
    optionC: "(C) JKL",
    optionD: "(D) MNO",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 14,
    questionText: "Find the correct mirror image of the word: COMPRESSION",
    optionA: "(A) NOISSERPMOC",
    optionB: "(B) 𐌎OIƧƧƎЯ𐌐𐌌OƆ",
    optionC: "(C) 𐌎OIƧƧƎЯ𐌼𐌌OƆ",
    optionD: "(D) 𐌎OIƧƧEЯ𐌼𐌌OƆ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 15,
    questionText: "Find the reflex angle between the hands of a clock at 10:25:",
    optionA: "(A) 180°",
    optionB: "(B) 192.5°",
    optionC: "(C) 197.5°",
    optionD: "(D) 212.5°",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 16,
    questionText: "Complete the series: 12, 15, 21, 33, 57, ?",
    optionA: "(A) 93",
    optionB: "(B) 99",
    optionC: "(C) 105",
    optionD: "(D) 111",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 17,
    questionText: "Find the correct water image of the word: COMPRESSION",
    optionA: "(A) ƆOWb𐐚ƎƧƧIOИ",
    optionB: "(B) ƆOWbIƎƧƧIOИ",
    optionC: "(C) ƆOWbʁƎƧƧIOИ",
    optionD: "(D) ƆOWbʁƎƧƧION",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 18,
    questionText: "Code logic recognition: If GUEST is coded as 9-21-5-19-20, how is HOUSE coded?",
    optionA: "(A) 8-15-21-19-5",
    optionB: "(B) 8-15-22-19-5",
    optionC: "(C) 9-15-21-19-5",
    optionD: "(D) 8-16-21-19-5",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 19,
    questionText: "Complete the letter series: ZA, YB, XC, WD, ?",
    optionA: "(A) VE",
    optionB: "(B) EV",
    optionC: "(C) UF",
    optionD: "(D) FU",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 20,
    questionText: "Find the correct mirror image of the word: EXCELLENCE",
    optionA: "(A) ECNELLECXE",
    optionB: "(B) ƎƆИƎ⅃⅃ƎƆXƎ",
    optionC: "(C) ƎƆNƎ⅃⅃ƎƆXƎ",
    optionD: "(D) ƎƆИƎ⅃⅃EƆXƎ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 21,
    questionText: "A watch gains 5 seconds every 3 minutes. Set right at 8 a.m., what does it show at 10 p.m. same day?",
    optionA: "(A) 10:21:20 p.m.",
    optionB: "(B) 10:23:20 p.m.",
    optionC: "(C) 10:25:00 p.m.",
    optionD: "(D) 10:26:40 p.m.",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 22,
    questionText: "Complete the series: 6, 9, 18, 45, 135, ?",
    optionA: "(A) 405",
    optionB: "(B) 422.5",
    optionC: "(C) 450",
    optionD: "(D) 472.5",
    correctOption: "D",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 23,
    questionText: "Find the correct water image of the word: EXCELLENCE",
    optionA: "(A) EXƆƎГГƎИƆƎ",
    optionB: "(B) EXƆƎГГƎNƆƎ",
    optionC: "(C) ƎXƆƎГГƎИƆƎ",
    optionD: "(D) EXƆEГГEИƆE",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 24,
    questionText: "Find the pattern rule matching item: 24 : 126 :: 48 : ?",
    optionA: "(A) 433",
    optionB: "(B) 192",
    optionC: "(C) 240",
    optionD: "(D) 344",
    correctOption: "D",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 25,
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
    questionOrder: 26,
    questionText: "Find the correct mirror image of the word: INTELLIGENCE",
    optionA: "(A) ECNEGILLLETNI",
    optionB: "(B) ƎƆИƎӘI⅃⅃ƎꓕИI",
    optionC: "(C) ƎƆИƎGI⅃⅃ƎꓕИI",
    optionD: "(D) ƎƆNƎӘI⅃⅃ƎꓕNI",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 27,
    questionText: "Complete the series: 1, 2, 6, 21, 88, ?",
    optionA: "(A) 425",
    optionB: "(B) 445",
    optionC: "(C) 465",
    optionD: "(D) 485",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 28,
    questionText: "Find the correct water image of the word: INTELLIGENCE",
    optionA: "(A) IИ┴ƎГГIeƎИƆƎ",
    optionB: "(B) IИ┴ƎГГIeƎNƆƎ",
    optionC: "(C) IN┴ƎГГIeƎИƆƎ",
    optionD: "(D) IИ┴ƎГГIGƎИƆƎ",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 29,
    questionText: "At what time between 5:30 and 6 o'clock will the hands of a clock be at a right angle?",
    optionA: "(A) 43-5/11 min past 5",
    optionB: "(B) 43-7/11 min past 5",
    optionC: "(C) 40 min past 5",
    optionD: "(D) 45 min past 5",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 30,
    questionText: "Complete the visual logic sequence: Circle : Sphere :: Square : ?",
    optionA: "(A) Cube",
    optionB: "(B) Rectangle",
    optionC: "(C) Triangle",
    optionD: "(D) Cylinder",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  }
];

async function updateBTech3rdYearSet4() {
  const transaction = await sequelize.transaction();
  try {
    console.log('=== UPDATING QUESTIONS IN B.TECH 3RD YEAR — SET 4 (FROM Set 3(3rd year).pdf) ===\n');

    let round = await QuizRound.findOne({
      where: { roundNumber: 19 },
      transaction
    });

    if (!round) {
      console.log('Round #19 not found by roundNumber=19, searching by title...');
      round = await QuizRound.findOne({
        where: { title: 'Logical Reasoning - B.Tech 3rd Year — SET 4' },
        transaction
      });
    }

    if (!round) {
      throw new Error('Target round "Logical Reasoning - B.Tech 3rd Year — SET 4" not found!');
    }

    console.log(`Target Round ID: ${round.id} | Title: "${round.title}"`);

    // Delete existing questions in Set 4 first to ensure a clean import of the requested 30 questions
    const deletedCount = await Question.destroy({
      where: { roundId: round.id },
      transaction
    });
    console.log(`Cleared ${deletedCount} previous questions from Set 4.`);

    let insertedCount = 0;
    for (const q of questionsData) {
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

    // Ensure total marks = 30.00
    round.totalMarks = 30.0;
    await round.save({ transaction });

    await transaction.commit();

    console.log(`\nUpdate completed!`);
    console.log(`Questions inserted: ${insertedCount}`);

    const finalCount = await Question.count({ where: { roundId: round.id } });
    console.log(`Final Question Count for B.Tech 3rd Year SET 4: ${finalCount}`);

  } catch (err) {
    await transaction.rollback();
    console.error('❌ Import failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

updateBTech3rdYearSet4();
