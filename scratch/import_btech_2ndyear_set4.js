require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const questionsData = [
  {
    questionOrder: 1,
    questionText: "Complete the series: 3, 4, 8, 17, 33, 58, ?",
    optionA: "(A) 92",
    optionB: "(B) 94",
    optionC: "(C) 96",
    optionD: "(D) 98",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 2,
    questionText: "Find the correct mirror image of the word: INFORMATION",
    optionA: "(A) NOITAMROFNI",
    optionB: "(B) 𐌎OIꓕA𐌌ЯOℲИI",
    optionC: "(C) 𐌎OIꓕA𐌌ЯOℲNI",
    optionD: "(D) 𐌎OIT_A_𐌌ЯOℲИI",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 3,
    questionText: "At what angle are clock hands inclined at exactly 20 minutes past 7?",
    optionA: "(A) 100°",
    optionB: "(B) 110°",
    optionC: "(C) 120°",
    optionD: "(D) 130°",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 4,
    questionText: "Complete progression sequence item pair: B2, D4, H8, P16, ?",
    optionA: "(A) F6",
    optionB: "(B) J10",
    optionC: "(C) Z26",
    optionD: "(D) D4 variation",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 5,
    questionText: "Find the correct water image of the word: INFORMATION",
    optionA: "(A) IИℲObW∀┴IOИ",
    optionB: "(B) IИℲObM∀┴IOИ",
    optionC: "(C) INℲObW∀┴IOИ",
    optionD: "(D) IИFObW∀┴IOИ",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 6,
    questionText: "Recognize the structural pattern link: Car : Road :: Train : ?",
    optionA: "(A) Track",
    optionB: "(B) Station",
    optionC: "(C) Engine",
    optionD: "(D) Driver",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 7,
    questionText: "Complete the series: 1, 5, 21, 85, 341, ?",
    optionA: "(A) 1361",
    optionB: "(B) 1365",
    optionC: "(C) 1369",
    optionD: "(D) 1373",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 8,
    questionText: "Find the correct mirror image of the word: CONGRATULATION",
    optionA: "(A) NOITALUTARGNOC",
    optionB: "(B) 𐌎OIꓕA⅃UꓕAЯӘИOƆ",
    optionC: "(C) 𐌎OIT_A_⅃UꓕAЯӘИOƆ",
    optionD: "(D) 𐌎OIꓕA⅃UꓕAЯGИOƆ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 9,
    questionText: "How many right-angle instances do clock hands lock across an entire 24-hour day?",
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
    questionText: "Complete numeric grid sequence tracking pattern:\n\n5 10 15\n20 25 30\n35 40 ?",
    optionA: "(A) 42",
    optionB: "(B) 45",
    optionC: "(C) 48",
    optionD: "(D) 50",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 11,
    questionText: "Complete the letter series: CE, FI, JL, MP, ?",
    optionA: "(A) QT",
    optionB: "(B) OR",
    optionC: "(C) QU",
    optionD: "(D) PR",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 12,
    questionText: "Find the correct water image of the word: CONGRATULATION",
    optionA: "(A) ƆOИeR∀┴∩Г∀┴IOИ",
    optionB: "(B) ƆOИeЯ∀┴∩Г∀┴IOИ",
    optionC: "(C) ƆOИeʁ∀┴∩Г∀┴IOИ",
    optionD: "(D) ƆONeʁ∀┴∩Г∀┴IOИ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 13,
    questionText: "Complete the series: 5, 14, 39, 100, 241, ?",
    optionA: "(A) 542",
    optionB: "(B) 554",
    optionC: "(C) 560",
    optionD: "(D) 566",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 14,
    questionText: "Find the correct mirror image of the word: CLASSIFICATION",
    optionA: "(A) NOITACIFISSALC",
    optionB: "(B) 𐌎OIꓕAƆIℲIƧƧA⅃Ɔ",
    optionC: "(C) 𐌎OIT_A_ƆIℲIƧƧA⅃Ɔ",
    optionD: "(D) 𐌎OIꓕAƆIℲIƧƧA⅃C",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 15,
    questionText: "If a true clock dial shows 9:30, what mirror image outcome time updates inside its reflection view?",
    optionA: "(A) 2:30",
    optionB: "(B) 3:30",
    optionC: "(C) 2:00",
    optionD: "(D) 3:00",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 16,
    questionText: "Code identification pattern matching rule: If \"A\" = 2, \"B\" = 4, then \"CAB\" equals:",
    optionA: "(A) 10",
    optionB: "(B) 12",
    optionC: "(C) 14",
    optionD: "(D) 16",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 17,
    questionText: "Complete the series: 4, 9, 20, 43, 90, ?",
    optionA: "(A) 181",
    optionB: "(B) 183",
    optionC: "(C) 185",
    optionD: "(D) 187",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 18,
    questionText: "Find the correct water image of the word: CLASSIFICATION",
    optionA: "(A) ƆГ∀ƧƧIℲIƆ∀┴IOИ",
    optionB: "(B) CГ∀ƧƧIℲIƆ∀┴IOИ",
    optionC: "(C) ƆГ∀SSIℲIƆ∀┴IOИ",
    optionD: "(D) ƆГ∀ƧƧIℲIƆA┴IOИ",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 19,
    questionText: "At what time point value between 1:00 and 2:00 do clock hands cross completely opposite?",
    optionA: "(A) 35 min past 1",
    optionB: "(B) 38-2/11 min past 1",
    optionC: "(C) 40 min past 1",
    optionD: "(D) 37-5/11 min past 1",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 20,
    questionText: "Complete the letter series: DFK, KMR, RTY, ?",
    optionA: "(A) YAF",
    optionB: "(B) YBG",
    optionC: "(C) ZBG",
    optionD: "(D) XZE",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 21,
    questionText: "Find the correct mirror image of the word: CONSTITUTION",
    optionA: "(A) NOITUTITSNOC",
    optionB: "(B) 𐌎OIꓕUꓕIꓕƧИOƆ",
    optionC: "(C) 𐌎OIꓕUꓕIꓕƧNOƆ",
    optionD: "(D) 𐌎OIT_UꓕIꓕƧИOƆ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 22,
    questionText: "Choose the anomaly pattern value coordinate out: 11, 13, 15, 17",
    optionA: "(A) 11",
    optionB: "(B) 13",
    optionC: "(C) 15",
    optionD: "(D) 17",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 23,
    questionText: "Complete the series: 100, 99, 95, 86, 70, ?",
    optionA: "(A) 41",
    optionB: "(B) 43",
    optionC: "(C) 45",
    optionD: "(D) 47",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 24,
    questionText: "Find the correct water image of the word: CONSTITUTION",
    optionA: "(A) ƆOИƧ┴I┴∩┴IOИ",
    optionB: "(B) ƆOИƧ┴I┴U┴IOИ",
    optionC: "(C) ƆONƧ┴I┴∩┴IOИ",
    optionD: "(D) COИƧ┴I┴∩┴IOИ",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 25,
    questionText: "Find how many degrees path trace across minute marker hand inside 15 minutes window cycle:",
    optionA: "(A) 45°",
    optionB: "(B) 60°",
    optionC: "(C) 90°",
    optionD: "(D) 120°",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 26,
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
    questionOrder: 27,
    questionText: "Find the correct mirror image of the word: DICTIONARY",
    optionA: "(A) YRANOITCID",
    optionB: "(B) ⅄ЯAИOIꓕƆIᗡ",
    optionC: "(C) YЯAИOIꓕƆIᗡ",
    optionD: "(D) ⅄ЯANOIꓕƆIᗡ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 28,
    questionText: "Complete analogy matrix visual block pairing connection: Hand : Glove :: Foot : ?",
    optionA: "(A) Sock",
    optionB: "(B) Shoe",
    optionC: "(C) Leg",
    optionD: "(D) Toe",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 29,
    questionText: "Find the correct water image of the word: DICTIONARY",
    optionA: "(A) ᗡIƆ┴IOИ∀bλ",
    optionB: "(B) ᗡIƆ┴ION∀bλ",
    optionC: "(C) DIƆ┴IOИ∀bλ",
    optionD: "(D) ᗡIƆ┴IOИ∀bY",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 30,
    questionText: "Complete the letter series: ABC, PQR, DEF, STU, ?",
    optionA: "(A) GHI",
    optionB: "(B) VWX",
    optionC: "(C) JKL",
    optionD: "(D) MNO",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  }
];

async function importBTech2ndYearSet4() {
  const transaction = await sequelize.transaction();
  try {
    console.log('=== IMPORTING QUESTIONS TO B.TECH 2ND YEAR — SET 4 ===\n');

    let round = await QuizRound.findOne({
      where: { roundNumber: 14 },
      transaction
    });

    if (!round) {
      console.log('Round #14 not found by roundNumber=14, searching by title...');
      round = await QuizRound.findOne({
        where: { title: 'Logical Reasoning - B.Tech 2nd Year — SET 4' },
        transaction
      });
    }

    if (!round) {
      throw new Error('Target round "Logical Reasoning - B.Tech 2nd Year — SET 4" not found!');
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
        console.log(`[SKIPPED] Q${q.questionOrder} already exists in Set 4 (ID: ${existing.id}).`);
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
    console.log(`Final Question Count for B.Tech 2nd Year SET 4: ${finalCount}`);

  } catch (err) {
    await transaction.rollback();
    console.error('❌ Import failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

importBTech2ndYearSet4();
