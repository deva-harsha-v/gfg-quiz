require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const TARGET_ROUND_ID = '05ece60c-6921-4962-a04c-6706fc2def89';

const questionsData = [
  {
    questionOrder: 1,
    questionText: '👨‍🎓 + ❓Answer:',
    optionA: 'Student Quiz / Questioning',
    optionB: 'Graduation Ceremony',
    optionC: 'Classroom Lecture',
    optionD: 'Sports Trophy',
    correctOption: 'A'
  },
  {
    questionOrder: 2,
    questionText: '🏆 + 🎉Answer:',
    optionA: 'Victory Celebration / Prize Distribution',
    optionB: 'Exam Hall',
    optionC: 'Library Study',
    optionD: 'Fee Payment',
    correctOption: 'A'
  },
  {
    questionOrder: 3,
    questionText: '👨‍🎓 + 🏫Answer:',
    optionA: 'Student at College / Campus',
    optionB: 'Shopping Mall',
    optionC: 'Bus Stand',
    optionD: 'Cinema Hall',
    correctOption: 'A'
  },
  {
    questionOrder: 4,
    questionText: '💻 + 🏫 →Answer:',
    optionA: 'Computer Lab / Digital Campus',
    optionB: 'Playground',
    optionC: 'Gymnasium',
    optionD: 'Canteen',
    correctOption: 'A'
  },
  {
    questionOrder: 5,
    questionText: '🌐 + 💻 →Answer:',
    optionA: 'Internet / World Wide Web',
    optionB: 'Offline Storage',
    optionC: 'Calculator',
    optionD: 'Printer',
    correctOption: 'A'
  },
  {
    questionOrder: 6,
    questionText: '💻 + 🐛 →Answer:',
    optionA: 'Computer Bug / Software Error',
    optionB: 'Antivirus Software',
    optionC: 'Mouse Pad',
    optionD: 'Power Cable',
    correctOption: 'A'
  },
  {
    questionOrder: 7,
    questionText: 'I can be seen in a mirror, but I have no physical existence of my own.',
    optionA: 'Reflection',
    optionB: 'Shadow',
    optionC: 'Glass',
    optionD: 'Light',
    correctOption: 'A'
  },
  {
    questionOrder: 8,
    questionText: 'The more you use me, the sharper I become. But I am not a knife.',
    optionA: 'Brain / Mind',
    optionB: 'Pencil',
    optionC: 'Scissors',
    optionD: 'Razor',
    correctOption: 'A'
  },
  {
    questionOrder: 9,
    questionText: 'I have no legs, but I can move information. I have no brain, but I can follow instructions.',
    optionA: 'Computer / Network',
    optionB: 'Robot',
    optionC: 'Car',
    optionD: 'Book',
    correctOption: 'A'
  },
  {
    questionOrder: 10,
    questionText: 'I cannot be seen directly, but you know I exist by what I change.',
    optionA: 'Wind / Energy',
    optionB: 'Color',
    optionC: 'Mirror',
    optionD: 'Sound',
    correctOption: 'A'
  },
  {
    questionOrder: 11,
    questionText: 'I can be empty and still contain something. I can be full and still contain nothing useful.',
    optionA: 'Mind / Recycle Bin',
    optionB: 'Bucket',
    optionC: 'Box',
    optionD: 'Bag',
    correctOption: 'A'
  },
  {
    questionOrder: 12,
    questionText: 'I can connect two places without being a road. I can carry something without physically holding it.',
    optionA: 'Bridge / Wi-Fi',
    optionB: 'Truck',
    optionC: 'Train',
    optionD: 'Footpath',
    correctOption: 'A'
  },
  {
    questionOrder: 13,
    questionText: 'I get shorter every time I do my job, yet I help you see in the dark; what am I?',
    optionA: 'Candle',
    optionB: 'Flashlight',
    optionC: 'Matchstick',
    optionD: 'Bulb',
    correctOption: 'A'
  },
  {
    questionOrder: 14,
    questionText: 'I can be cracked, made, told, and played, but I am not a toy; what am I?',
    optionA: 'Joke',
    optionB: 'Game',
    optionC: 'Puzzle',
    optionD: 'Story',
    correctOption: 'A'
  },
  {
    questionOrder: 15,
    questionText: 'I am always in front of you, but you can never see me; what am I?',
    optionA: 'Future',
    optionB: 'Shadow',
    optionC: 'Air',
    optionD: 'Past',
    correctOption: 'A'
  },
  {
    questionOrder: 16,
    questionText: 'I have branches, but no fruit, trunk, or leaves; what am I?',
    optionA: 'Bank / Library',
    optionB: 'Tree',
    optionC: 'Plant',
    optionD: 'Flower',
    correctOption: 'A'
  },
  {
    questionOrder: 17,
    questionText: 'I am taken before you get me, and I disappear after you give me; what am I?',
    optionA: 'Photograph',
    optionB: 'Money',
    optionC: 'Gift',
    optionD: 'Letter',
    correctOption: 'A'
  },
  {
    questionOrder: 18,
    questionText: 'I can fill a room but take up no space; what am I?',
    optionA: 'Light',
    optionB: 'Water',
    optionC: 'Air',
    optionD: 'Furniture',
    correctOption: 'A'
  },
  {
    questionOrder: 19,
    questionText: 'I am impossible to see but easy to lose.',
    optionA: 'Patience / Temper',
    optionB: 'Money',
    optionC: 'Keys',
    optionD: 'Phone',
    correctOption: 'A'
  },
  {
    questionOrder: 20,
    questionText: 'The more people have me, the less valuable I become.',
    optionA: 'Secret',
    optionB: 'Gold',
    optionC: 'Knowledge',
    optionD: 'Time',
    correctOption: 'A'
  },
  {
    questionOrder: 21,
    questionText: 'I can destroy kingdoms but fit inside a mouth.',
    optionA: 'Tongue / Words',
    optionB: 'Food',
    optionC: 'Water',
    optionD: 'Teeth',
    correctOption: 'A'
  },
  {
    questionOrder: 22,
    questionText: 'Without me, questions die.',
    optionA: 'Curiosity / Answer',
    optionB: 'Paper',
    optionC: 'Pen',
    optionD: 'Book',
    correctOption: 'A'
  },
  {
    questionOrder: 23,
    questionText: 'I grow stronger when challenged.',
    optionA: 'Truth / Mind / Will',
    optionB: 'Body',
    optionC: 'Glass',
    optionD: 'Paper',
    correctOption: 'A'
  },
  {
    questionOrder: 24,
    questionText: 'I am the prison built by certainty.',
    optionA: 'Dogma / Closed Mind',
    optionB: 'Jail',
    optionC: 'Cage',
    optionD: 'Lock',
    correctOption: 'A'
  },
  {
    questionOrder: 25,
    questionText: 'I am a number that becomes smaller when you turn me upside down. What am I?',
    optionA: '9 (becomes 6)',
    optionB: '8',
    optionC: '0',
    optionD: '1',
    correctOption: 'A'
  },
  {
    questionOrder: 26,
    questionText: 'Two in a corner, one in a room, zero in a house but one in shelter. What is it?',
    optionA: 'The letter R',
    optionB: 'The letter E',
    optionC: 'The letter O',
    optionD: 'The letter S',
    correctOption: 'A'
  },
  {
    questionOrder: 27,
    questionText: "Why did two 4's skip lunch?",
    optionA: 'They were not hungry',
    optionB: 'Because they already 8 (ate)',
    optionC: 'They had no money',
    optionD: 'They were studying',
    correctOption: 'B'
  },
  {
    questionOrder: 28,
    questionText: 'Why was 6 afraid of 7?',
    optionA: 'Because 7 was bigger',
    optionB: 'Because 7 8 (ate) 9',
    optionC: 'Because 7 was odd',
    optionD: 'Because 6 was smaller',
    correctOption: 'B'
  },
  {
    questionOrder: 29,
    questionText: "What is a math teacher's favorite season?",
    optionA: 'Winter',
    optionB: 'SUMmer',
    optionC: 'Autumn',
    optionD: 'Spring',
    correctOption: 'B'
  },
  {
    questionOrder: 30,
    questionText: "What is a math teacher's favorite dessert?",
    optionA: 'Ice cream',
    optionB: 'Pi (Pie)',
    optionC: 'Cake',
    optionD: 'Chocolate',
    correctOption: 'B'
  }
];

async function importCreativeRiddlesDiplomaSet3() {
  const transaction = await sequelize.transaction();
  try {
    const round = await QuizRound.findByPk(TARGET_ROUND_ID, { transaction });
    if (!round) {
      throw new Error(`Target round not found: ${TARGET_ROUND_ID}`);
    }

    console.log(`Target Round Found: "${round.title}" (ID: ${round.id})`);
    console.log(`Current Status: ${round.status}`);

    const existingCount = await Question.count({ where: { roundId: round.id }, transaction });
    console.log(`Existing Question Count in SET 3: ${existingCount}`);

    if (existingCount > 0) {
      console.log(`Clearing ${existingCount} existing questions before import...`);
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
          marks: 1.0,
          isActive: true
        },
        { transaction }
      );
      console.log(`[INSERTED] Q${q.questionOrder}: "${created.questionText.slice(0, 35)}..." -> Correct Option: ${created.correctOption}`);
      insertedCount++;
    }

    round.totalMarks = 30.0;
    await round.save({ transaction });

    await transaction.commit();

    console.log(`\nImport completed successfully!`);
    console.log(`Questions inserted: ${insertedCount}`);

    const finalCount = await Question.count({ where: { roundId: round.id } });
    console.log(`Final Question Count for Creative Riddles 1st Year Diploma SET 3: ${finalCount}`);

  } catch (err) {
    await transaction.rollback();
    console.error('❌ Import failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

importCreativeRiddlesDiplomaSet3();
