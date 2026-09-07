require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const SET5_ROUND_ID = '5d66b9b0-8748-49ee-8701-04322f3d293d';

const questionsData = [
  {
    questionOrder: 1,
    questionText: 'Complete the series: 7, 9, 14, 24, 41, ?',
    optionA: '63',
    optionB: '67',
    optionC: '71',
    optionD: '75',
    correctOption: 'B',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 2,
    questionText: 'Find the correct water image of the word: MATHEMATICS',
    optionA: 'W∀┴HƎW∀┴IƆƧ',
    optionB: 'W∀┴HƎM∀┴IƆƧ',
    optionC: 'M∀┴HƎW∀┴IƆƧ',
    optionD: 'W∀┴HEW∀┴IƆƧ',
    correctOption: 'A',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 3,
    questionText: 'A clock loses 16 minutes in 24 hours. Set right at 5 a.m., what is the true time when it reads 10 p.m. on the 4th day?',
    optionA: '9 p.m.',
    optionB: '10 p.m.',
    optionC: '11 p.m.',
    optionD: '12 p.m.',
    correctOption: 'C',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 4,
    questionText: 'Find the correct mirror image of the word: MATHEMATICS',
    optionA: 'SCITAMEHTAM',
    optionB: '2ƆIꓕA𐌌ƎHꓕA𐌌',
    optionC: '2ƆIꓕA𐌌E𐌕HA𐌌',
    optionD: '2ƆIꓕA𐌌ƎHꓕA𐌌',
    correctOption: 'B',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 5,
    questionText: 'Complete the letter series: AZ, CX, EV, GT, ?',
    optionA: 'IR',
    optionB: 'HS',
    optionC: 'JQ',
    optionD: 'KP',
    correctOption: 'A',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 6,
    questionText: 'Complete the pattern analogy: Giant : Dwarf :: Genius : ?',
    optionA: 'Idiot',
    optionB: 'Tiny',
    optionC: 'Smart',
    optionD: 'Monster',
    correctOption: 'A',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 7,
    questionText: 'Find the correct water image of the word: GOVERNED',
    optionA: 'eOΛƎbИƎᗡ',
    optionB: 'GOΛƎbИƎᗡ',
    optionC: 'eOΛƎbNƎᗡ',
    optionD: 'eOΛEbИEᗡ',
    correctOption: 'A',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 8,
    questionText: 'Complete the series: 4, 6, 12, 30, 90, 315, ?',
    optionA: '1102.5',
    optionB: '1150',
    optionC: '1210.5',
    optionD: '1260',
    correctOption: 'D',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 9,
    questionText: "At what time between 7 and 8 o'clock will the hands of a clock be in a straight line but not together?",
    optionA: '5 min past 7',
    optionB: '5-5/11 min past 7',
    optionC: '5-3/11 min past 7',
    optionD: '6 min past 7',
    correctOption: 'B',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 10,
    questionText: 'Identify the missing number in the matrix pattern:\n3   5   7\n6   10  14\n9   15  ?',
    optionA: '19',
    optionB: '20',
    optionC: '21',
    optionD: '22',
    correctOption: 'C',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 11,
    questionText: 'Find the correct mirror image of the word: GOVERNED',
    optionA: 'DENREVOG',
    optionB: 'ᗡƎИЯƎVOӘ',
    optionC: 'ᗡƎNЯƎVOӘ',
    optionD: 'ᗡEИЯEVOӘ',
    correctOption: 'B',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 12,
    questionText: 'Complete the letter series: BD, GI, LN, QS, ?',
    optionA: 'VX',
    optionB: 'WY',
    optionC: 'UX',
    optionD: 'TV',
    correctOption: 'A',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 13,
    questionText: 'Complete the series: 1, 4, 27, 16, 125, 36, ?',
    optionA: '49',
    optionB: '64',
    optionC: '243',
    optionD: '343',
    correctOption: 'D',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 14,
    questionText: 'Through how many degrees will the hour hand rotate from 8 a.m. to 2 p.m.?',
    optionA: '144°',
    optionB: '150°',
    optionC: '168°',
    optionD: '180°',
    correctOption: 'D',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 15,
    questionText: 'If "INSECT" is coded as "ATBNDA", pick the odd code pair pattern out:',
    optionA: 'MOUSE : KPSTB',
    optionB: 'PLANT : QMBOU',
    optionC: 'LIGHT : MJKIU',
    optionD: 'CHAIR : DIBJS',
    correctOption: 'B',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 16,
    questionText: 'Find the correct water image of the word: REVOLUTION',
    optionA: 'bƎΛOГ∩┴IOИ',
    optionB: 'bƎΛOГU┴IOИ',
    optionC: 'RƎΛOГ∩┴IOИ',
    optionD: 'bƎVОГ∩┴IOИ',
    correctOption: 'A',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 17,
    questionText: 'Find the correct mirror image of the word: REVOLUTION',
    optionA: 'NOITULOVER',
    optionB: '𐌎OIꓕU⅃OVƎЯ',
    optionC: '𐌎OITU⅃OVƎЯ',
    optionD: '𐌎OIꓕU⅃OVƎR',
    correctOption: 'B',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 18,
    questionText: 'Complete the series: 10, 19, 44, 93, 174, ?',
    optionA: '285',
    optionB: '295',
    optionC: '305',
    optionD: '315',
    correctOption: 'B',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 19,
    questionText: 'How many minutes before 12 noon is it, if 48 minutes ago it was twice as many minutes past 9 a.m.?',
    optionA: '24',
    optionB: '34',
    optionC: '44',
    optionD: '54',
    correctOption: 'C',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 20,
    questionText: 'Find the next letter group: CE, FI, JL, MP , ?',
    optionA: 'QT',
    optionB: 'OR',
    optionC: 'QU',
    optionD: 'PR',
    correctOption: 'A',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 21,
    questionText: 'Find the correct water image of the word: SIGNATURE',
    optionA: 'ƧIeИ∀┴∩bƎ',
    optionB: 'ƧIeИ∀┴UbƎ',
    optionC: 'SIeИ∀┴∩bƎ',
    optionD: 'ƧIeN∀┴∩bƎ',
    correctOption: 'A',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 22,
    questionText: 'Find the correct mirror image of the word: SIGNATURE',
    optionA: 'ERUTANGIS',
    optionB: 'ƎЯUꓕAИӘIƧ',
    optionC: 'ƎЯUꓕANӘIƧ',
    optionD: 'ƎRꓕAИӘIƧ',
    correctOption: 'B',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 23,
    questionText: 'Complete the series: 2, 5, 9, 19, 37, ?',
    optionA: '73',
    optionB: '75',
    optionC: '77',
    optionD: '79',
    correctOption: 'B',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 24,
    questionText: 'If a clock seen through a mirror shows 11:25, what is the real time?',
    optionA: '12:35',
    optionB: '11:35',
    optionC: '12:25',
    optionD: '1:25',
    correctOption: 'A',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 25,
    questionText: 'Complete the analogy pattern: Light : Sun :: Heat : ?',
    optionA: 'Electricity',
    optionB: 'Moon',
    optionC: 'Fire',
    optionD: 'Star',
    correctOption: 'C',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 26,
    questionText: 'Find the correct water image of the word: PUNCTUALITY',
    optionA: 'b∩ИƆ┴∩∀ГI┴λ',
    optionB: 'bUИƆ┴∩∀ГI┴λ',
    optionC: 'd∩ИƆ┴∩∀ГI┴λ',
    optionD: 'b∩ИƆ┴∩∀ГI┴Y',
    correctOption: 'A',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 27,
    questionText: 'Complete the letter series: DFK, KMR, RTY , ?',
    optionA: 'YAF',
    optionB: 'YBG',
    optionC: 'ZBG',
    optionD: 'XZE',
    correctOption: 'A',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 28,
    questionText: 'Complete the series: 0, 4, 18, 48, 100, 180, ?',
    optionA: '280',
    optionB: '294',
    optionC: '312',
    optionD: '324',
    correctOption: 'B',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 29,
    questionText: 'Complete the pattern sequence: 4, 9, 16, 25, 36, ?',
    optionA: '47',
    optionB: '49',
    optionC: '52',
    optionD: '55',
    correctOption: 'B',
    marks: 1.0,
    isActive: true
  },
  {
    questionOrder: 30,
    questionText: 'Find the correct mirror image of the word: PUNCTUALITY',
    optionA: 'YTILAUTCNUP',
    optionB: '⅄ꓕI⅃A_U_ꓕƆИU𐌐',
    optionC: '⅄ꓕI⅃AUꓕƆNU𐌐',
    optionD: 'YꓕI⅃A_U_ꓕƆИU𐌐',
    correctOption: 'B',
    marks: 1.0,
    isActive: true
  }
];

async function importBTech3rdYearSet5() {
  const transaction = await sequelize.transaction();
  try {
    const round = await QuizRound.findByPk(SET5_ROUND_ID, { transaction });
    if (!round) {
      throw new Error(`Target round not found: ${SET5_ROUND_ID}`);
    }

    console.log(`Found QuizRound: "${round.title}" (ID: ${round.id})`);

    const existingCount = await Question.count({ where: { roundId: round.id }, transaction });
    console.log(`Existing question count in SET 5: ${existingCount}`);

    if (existingCount > 0) {
      console.log(`Clearing ${existingCount} existing questions in SET 5...`);
      await Question.destroy({ where: { roundId: round.id }, transaction });
    }

    let insertedCount = 0;
    for (const q of questionsData) {
      const created = await Question.create(
        {
          roundId: round.id,
          questionOrder: q.questionOrder,
          questionText: q.questionText,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctOption: q.correctOption,
          marks: q.marks || 1.0,
          isActive: true
        },
        { transaction }
      );
      console.log(`[INSERTED] Q${q.questionOrder}: "${created.questionText.slice(0, 40)}..." -> Correct Option: ${created.correctOption}`);
      insertedCount++;
    }

    round.totalMarks = 30.0;
    await round.save({ transaction });

    await transaction.commit();

    console.log(`\nImport completed successfully!`);
    console.log(`Questions inserted: ${insertedCount}`);

    const finalCount = await Question.count({ where: { roundId: round.id } });
    console.log(`Final Question Count for B.Tech 3rd Year SET 5: ${finalCount}`);

  } catch (err) {
    await transaction.rollback();
    console.error('❌ Import failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

importBTech3rdYearSet5();
