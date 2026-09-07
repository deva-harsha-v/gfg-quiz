require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const questionsData = [
  {
    questionOrder: 1,
    questionText: "Complete the series: 15, 17, 20, 25, 32, 43, ?",
    optionA: "(A) 54",
    optionB: "(B) 56",
    optionC: "(C) 58",
    optionD: "(D) 60",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 2,
    questionText: "Find the correct mirror image of the word: DISCOVERY",
    optionA: "(A) YREVOCSID",
    optionB: "(B) ⅄ЯƎVOƆƧIᗡ",
    optionC: "(C) YЯƎVOƆƧIᗡ",
    optionD: "(D) ⅄ЯEVOƆƧIᗡ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 3,
    questionText: "At what time point matching past 11 o'clock do dial hand configurations intersect together first?",
    optionA: "(A) 60 min past 11",
    optionB: "(B) 12:00",
    optionC: "(C) 59 min past 11",
    optionD: "(D) Never intersecting inside 11:00 hour bounds",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 4,
    questionText: "Complete the letter series: BDF, HJL, NPR, TVX, ?",
    optionA: "(A) ZBD",
    optionB: "(B) YAC",
    optionC: "(C) ZAC",
    optionD: "(D) YBD",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 5,
    questionText: "Find the correct water image of the word: DISCOVERY",
    optionA: "(A) ᗡIƧƆOΛƎbλ",
    optionB: "(B) ᗡISƆOΛƎbλ",
    optionC: "(C) DIƧƆOΛƎbλ",
    optionD: "(D) ᗡIƧƆOΛƎbY",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 6,
    questionText: "Recognize tracking relationship categorization link:\nCar : Fuel :: Body : ?",
    optionA: "(A) Food",
    optionB: "(B) Water",
    optionC: "(C) Blood",
    optionD: "(D) Energy",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 7,
    questionText: "Complete the series: 6, 12, 21, 33, 48, ?",
    optionA: "(A) 64",
    optionB: "(B) 66",
    optionC: "(C) 68",
    optionD: "(D) 70",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 8,
    questionText: "Find the correct mirror image of the word: GEOMETRICAL",
    optionA: "(A) LACIRTEMOEG",
    optionB: "(B) ⅃AƆIЯꓕƎ𐌐𐌌OƎӘ",
    optionC: "(C) ⅃AƆIЯꓕE𐌼OƎӘ",
    optionD: "(D) LAƆIЯꓕƎ𐌌OƎӘ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 9,
    questionText: "Find how many complete overlapping occurrences point between hour hand elements inside exactly 24 hours day span cycle:",
    optionA: "(A) 22",
    optionB: "(B) 24",
    optionC: "(C) 44",
    optionD: "(D) 48",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 10,
    questionText: "Complete visual matrix entry data layout logic:\n\n1 2 3\n2 4 6\n3 6 ?",
    optionA: "(A) 7",
    optionB: "(B) 8",
    optionC: "(C) 9",
    optionD: "(D) 10",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 11,
    questionText: "Complete the letter series: ACE, GIK, MOQ, SUW, ?",
    optionA: "(A) YAC",
    optionB: "(B) XZB",
    optionC: "(C) YBD",
    optionD: "(D) XYA",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 12,
    questionText: "Find the correct water image of the word: GEOMETRICAL",
    optionA: "(A) eƎOWƎ┴bIƆ∀Г",
    optionB: "(B) eƎOMƎ┴bIƆ∀Г",
    optionC: "(C) eƎOWƎ┴bIƆAL",
    optionD: "(D) GEOWƎ┴bIƆ∀Г",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 13,
    questionText: "Complete the series: 11, 13, 20, 32, 49, 71, ?",
    optionA: "(A) 96",
    optionB: "(B) 98",
    optionC: "(C) 100",
    optionD: "(D) 102",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 14,
    questionText: "Find the correct mirror image of the word: CIVILIZATION",
    optionA: "(A) NOITAZILIVIC",
    optionB: "(B) 𐌎OIꓕAƵI⅃IVIƆ",
    optionC: "(C) 𐌎OIꓕA𐑵I⅃IVIƆ",
    optionD: "(D) 𐌎OIT_A_ƵI⅃IVIƆ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 15,
    questionText: "If a true dial indicates 8:15 time configuration, what updates matching inside a mirror?",
    optionA: "(A) 3:45",
    optionB: "(B) 4:45",
    optionC: "(C) 3:15",
    optionD: "(D) 4:15",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 16,
    questionText: "Solve alphanumeric character replacement sum tracking:\nIf \"SUN\" = 54, what is value code for \"MOON\"?",
    optionA: "(A) 51",
    optionB: "(B) 54",
    optionC: "(C) 57",
    optionD: "(D) 60",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 17,
    questionText: "Complete the series: 2, 6, 12, 20, 30, ?",
    optionA: "(A) 40",
    optionB: "(B) 42",
    optionC: "(C) 44",
    optionD: "(D) 46",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 18,
    questionText: "Find the correct water image of the word: CIVILIZATION",
    optionA: "(A) ƆIΛIГIƵ∀┴IOИ",
    optionB: "(B) ƆIΛIГI𐑵∀┴IOИ",
    optionC: "(C) ƆIΛIГI𐑵A┴IOИ",
    optionD: "(D) CIΛIГI𐑵∀┴IOИ",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 19,
    questionText: "How many degrees separate the hands of a clock at 1:40?",
    optionA: "(A) 110°",
    optionB: "(B) 120°",
    optionC: "(C) 130°",
    optionD: "(D) 140°",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 20,
    questionText: "Complete the letter series: ZXV, TRP, NLJ, HFD, ?",
    optionA: "(A) BZX",
    optionB: "(B) BZV",
    optionC: "(C) AZX",
    optionD: "(D) CAB",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 21,
    questionText: "Find the correct mirror image of the word: OBLIGATION",
    optionA: "(A) NOITAGILBO",
    optionB: "(B) 𐌎OIꓕAӘI⅃𐐚O",
    optionC: "(C) 𐌎OIꓕAGI⅃𐐚O",
    optionD: "(D) 𐌎OIT_A_ӘI⅃𐐚O",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 22,
    questionText: "Spot the logical value anomaly: 4, 9, 16, 20, 25",
    optionA: "(A) 9",
    optionB: "(B) 16",
    optionC: "(C) 20",
    optionD: "(D) 25",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 23,
    questionText: "Complete the series: 7, 25, 61, 121, 211, ?",
    optionA: "(A) 331",
    optionB: "(B) 335",
    optionC: "(C) 337",
    optionD: "(D) 341",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 24,
    questionText: "Find the correct water image of the word: OBLIGATION",
    optionA: "(A) O𐐚ГIe∀┴IOИ",
    optionB: "(B) ObГIe∀┴IOИ",
    optionC: "(C) O𐐚ГIeA┴IOИ",
    optionD: "(D) O𐐚ГIG∀┴IOИ",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 25,
    questionText: "A flat vertical mirror reflects clock hand alignments tracking exactly 7:35. True time?",
    optionA: "(A) 4:25",
    optionB: "(B) 5:25",
    optionC: "(C) 4:35",
    optionD: "(D) 5:35",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 26,
    questionText: "Complete the letter series: AZ, BY, CX, DW, ?",
    optionA: "(A) EV",
    optionB: "(B) FU",
    optionC: "(C) GT",
    optionD: "(D) HS",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 27,
    questionText: "Find the correct mirror image of the word: ARCHITECTURE",
    optionA: "(A) ERUTCETIHCRA",
    optionB: "(B) ƎЯUꓕƆƎꓕIHCЯA",
    optionC: "(C) ƎЯUꓕƆƎꓕIHCЯA",
    optionD: "(D) ƎЯUꓕƆEꓕIHCЯA",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 28,
    questionText: "Complete analogy block layout trend:\nDay : Night :: Dawn : ?",
    optionA: "(A) Dusk",
    optionB: "(B) Morning",
    optionC: "(C) Evening",
    optionD: "(D) Midnight",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 29,
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

async function importBTech2ndYearSet5() {
  const transaction = await sequelize.transaction();
  try {
    console.log('=== IMPORTING QUESTIONS TO B.TECH 2ND YEAR — SET 5 ===\n');

    let round = await QuizRound.findOne({
      where: { roundNumber: 15 },
      transaction
    });

    if (!round) {
      console.log('Round #15 not found by roundNumber=15, searching by title...');
      round = await QuizRound.findOne({
        where: { title: 'Logical Reasoning - B.Tech 2nd Year — SET 5' },
        transaction
      });
    }

    if (!round) {
      throw new Error('Target round "Logical Reasoning - B.Tech 2nd Year — SET 5" not found!');
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
        console.log(`[SKIPPED] Q${q.questionOrder} already exists in Set 5 (ID: ${existing.id}).`);
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
    console.log(`Final Question Count for B.Tech 2nd Year SET 5: ${finalCount}`);

  } catch (err) {
    await transaction.rollback();
    console.error('❌ Import failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

importBTech2ndYearSet5();
