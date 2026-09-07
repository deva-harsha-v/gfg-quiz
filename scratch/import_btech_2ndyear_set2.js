require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const questionsData = [
  {
    questionOrder: 1,
    questionText: "Complete the series: 6, 14, 30, 62, 126, ?",
    optionA: "A) 248",
    optionB: "B) 250",
    optionC: "C) 252",
    optionD: "D) 254",
    correctOption: "D",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 2,
    questionText: "Find the correct mirror image of the word: GEOMETRICAL",
    optionA: "A) LACIRTEMOEG",
    optionB: "B) ⅃AƆIЯꓕƎ𐌐𐌌OƎӘ",
    optionC: "C) ⅃AƆIЯꓕE𐌼OƎӘ",
    optionD: "D) LAƆIЯꓕƎ𐌌OƎӘ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 3,
    questionText: "At what time between 10 and 11 o'clock will the hands of a watch point in opposite directions?",
    optionA: "A) 21-9/11 min past 10",
    optionB: "B) 20 min past 10",
    optionC: "C) 22 min past 10",
    optionD: "D) 23-5/11 min past 10",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 4,
    questionText: "Complete the letter series: ZW, TO, NJ, ?",
    optionA: "A) KF",
    optionB: "B) JG",
    optionC: "C) KH",
    optionD: "D) KI",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 5,
    questionText: "Find the correct water image of the word: GEOMETRICAL",
    optionA: "A) eƎOWƎ┴bIƆ∀Г",
    optionB: "B) eƎOMƎ┴bIƆ∀Г",
    optionC: "C) eƎOWƎ┴bIƆAL",
    optionD: "D) GEOWƎ┴bIƆ∀Г",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 6,
    questionText: "Complete the trend pattern relationship: Needle : Sew :: Knife : ?",
    optionA: "A) Cut",
    optionB: "B) Sharp",
    optionC: "C) Steel",
    optionD: "D) Handle",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 7,
    questionText: "Complete the series: 2, 5, 28, 17, 126, 37, ?",
    optionA: "A) 217",
    optionB: "B) 256",
    optionC: "C) 344",
    optionD: "D) 512",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 8,
    questionText: "Find the correct mirror image of the word: CIVILIZATION",
    optionA: "A) NOITAZILIVIC",
    optionB: "B) 𐌎OIꓕAƵI⅃IVIƆ",
    optionC: "C) 𐌎OIꓕA𐑵I⅃IVIƆ",
    optionD: "D) 𐌎OIT_A_ƵI⅃IVIƆ",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 9,
    questionText: "An accurate clock shows 7 a.m. Through how many degrees will the hour hand rotate when the clock indicates 1 p.m.?",
    optionA: "A) 150°",
    optionB: "B) 160°",
    optionC: "C) 180°",
    optionD: "D) 210°",
    correctOption: "C",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 10,
    questionText: "Complete the logic sequence trend: 2, 3, 5, 7, 11, 13, ?",
    optionA: "A) 15",
    optionB: "B) 17",
    optionC: "C) 19",
    optionD: "D) 21",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 11,
    questionText: "Complete the letter series: AC, EG, IK, MO, ?",
    optionA: "A) QS",
    optionB: "B) PR",
    optionC: "C) QR",
    optionD: "D) QT",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 12,
    questionText: "Find the correct water image of the word: CIVILIZATION",
    optionA: "A) ƆIΛIГIƵ∀┴IOИ",
    optionB: "B) ƆIΛIГI𐑵∀┴IOИ",
    optionC: "C) ƆIΛIГI𐑵A┴IOИ",
    optionD: "D) CIΛIГI𐑵∀┴IOИ",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 13,
    questionText: "Complete the series: 7, 13, 21, 31, 43, ?",
    optionA: "A) 55",
    optionB: "B) 57",
    optionC: "C) 59",
    optionD: "D) 61",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 14,
    questionText: "Find the correct mirror image of the word: OBLIGATION",
    optionA: "A) NOITAGILBO",
    optionB: "B) 𐌎OIꓕAӘI⅃𐐚O",
    optionC: "C) 𐌎OIꓕAGI⅃𐐚O",
    optionD: "D) 𐌎OIT_A_ӘI⅃𐐚O",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 15,
    questionText: "If a vertical mirror reflects 10:20 on a standard clock dial, what is the actual hour state?",
    optionA: "A) 1:40",
    optionB: "B) 2:40",
    optionC: "C) 1:20",
    optionD: "D) 2:20",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 16,
    questionText: "If \"RED\" is coded as 6720, how is \"GREEN\" structured in this sequence tracking framework?",
    optionA: "A) 1677209",
    optionB: "B) 1671220",
    optionC: "C) 9207716",
    optionD: "D) 1671414",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 17,
    questionText: "Complete the series: 1, 5, 13, 29, 61, ?",
    optionA: "A) 115",
    optionB: "B) 121",
    optionC: "C) 123",
    optionD: "D) 125",
    correctOption: "D",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 18,
    questionText: "Find the correct water image of the word: OBLIGATION",
    optionA: "A) O𐐚ГIe∀┴IOИ",
    optionB: "B) ObГIe∀┴IOИ",
    optionC: "C) O𐐚ГIeA┴IOИ",
    optionD: "D) O𐐚ГIG∀┴IOИ",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 19,
    questionText: "How many times do the hands of a clock overlap in a clean 12-hour period?",
    optionA: "A) 10",
    optionB: "B) 11",
    optionC: "C) 12",
    optionD: "D) 22",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 20,
    questionText: "Complete the variable series: B3C, E6F, H9I, ?",
    optionA: "A) K12L",
    optionB: "B) J12K",
    optionC: "C) K11L",
    optionD: "D) L12M",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 21,
    questionText: "Find the correct mirror image of the word: ARCHITECTURE",
    optionA: "A) ERUTCETIHCRA",
    optionB: "B) ƎЯUꓕƆƎꓕIHCЯA",
    optionC: "C) ƎЯUꓕƆƎꓕIHCЯA",
    optionD: "D) ƎЯUꓕƆEꓕIHCЯA",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 22,
    questionText: "Complete the pattern analogy sequence: Square : 4 :: Hexagon : ?",
    optionA: "A) 5",
    optionB: "B) 6",
    optionC: "C) 7",
    optionD: "D) 8",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 23,
    questionText: "Complete the series: 4, 32, 108, 256, 500, ?",
    optionA: "A) 844",
    optionB: "B) 864",
    optionC: "C) 884",
    optionD: "D) 904",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 24,
    questionText: "Find the correct water image of the word: ARCHITECTURE",
    optionA: "A) ∀bƆHI┴ƎƆ┴∩bƎ",
    optionB: "B) ∀bƆHI┴ƎƆ┴UbƎ",
    optionC: "C) ∀bƆHI┴EƆ┴∩bƎ",
    optionD: "D) ∀bƆHI┴ƎƆ┴∩bE",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 25,
    questionText: "Find the angle between the hands of a clock at 8:30:",
    optionA: "A) 60°",
    optionB: "B) 75°",
    optionC: "C) 80°",
    optionD: "D) 90°",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 26,
    questionText: "Complete the letter series: Z1A, X2D, V6I, T24P, ?",
    optionA: "A) R120Y",
    optionB: "B) S120Y",
    optionC: "C) R120Z",
    optionD: "D) R100Y",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 27,
    questionText: "Find the correct mirror image of the word: BROADCASTING",
    optionA: "A) GNITSACDAORB",
    optionB: "B) ⅁ИIꓕƧAƆᗡAOЯ𐐚",
    optionC: "C) ⅁ИIꓕƧAƆᗡAOЯB",
    optionD: "D) GNITSAƆᗡAOЯ𐐚",
    correctOption: "B",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 28,
    questionText: "Match the classification logic anomaly: Apple, Orange, Banana, Potato",
    optionA: "A) Apple",
    optionB: "B) Orange",
    optionC: "C) Banana",
    optionD: "D) Potato",
    correctOption: "D",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 29,
    questionText: "Find the correct water image of the word: BROADCASTING",
    optionA: "A) bbo∀ᗡƆ∀Ƨ┴IИe",
    optionB: "B) 𐐚bO∀ᗡƆ∀Ƨ┴IИe",
    optionC: "C) bbo∀ᗡƆ∀S┴IИe",
    optionD: "D) bbo∀ᗡƆ∀Ƨ┴IИG",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 30,
    questionText: "Complete the letter series: D4F, H8J, L12N, ?",
    optionA: "A) P16R",
    optionB: "B) O16Q",
    optionC: "C) P15R",
    optionD: "D) Q16S",
    correctOption: "A",
    marks: 1.0,
    isActive: true
  }
];

async function importBTech2ndYearSet2() {
  const transaction = await sequelize.transaction();
  try {
    console.log('=== IMPORTING QUESTIONS TO B.TECH 2ND YEAR — SET 2 ===\n');

    let round = await QuizRound.findOne({
      where: { roundNumber: 12 },
      transaction
    });

    if (!round) {
      console.log('Round #12 not found by roundNumber=12, searching by title...');
      round = await QuizRound.findOne({
        where: { title: 'Logical Reasoning - B.Tech 2nd Year — SET 2' },
        transaction
      });
    }

    if (!round) {
      throw new Error('Target round "Logical Reasoning - B.Tech 2nd Year — SET 2" not found!');
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
    console.log(`Final Question Count for B.Tech 2nd Year SET 2: ${finalCount}`);

  } catch (err) {
    await transaction.rollback();
    console.error('❌ Import failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

importBTech2ndYearSet2();
