require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const TARGET_ROUND_ID = 'f054696b-945b-41be-803b-a652b4c94765';

const questionsData = [
  {
    questionOrder: 1,
    questionText: '🛒 + 🛍️ →Answer:',
    optionA: 'Shopping',
    optionB: 'Traveling',
    optionC: 'Cooking',
    optionD: 'Sleeping',
    correctOption: 'A'
  },
  {
    questionOrder: 2,
    questionText: '👕 + 🪞 →Answer:',
    optionA: 'Laundry',
    optionB: 'Dressing / Outfit Check',
    optionC: 'Ironing',
    optionD: 'Tailoring',
    correctOption: 'B'
  },
  {
    questionOrder: 3,
    questionText: '🏃 + 🚌 →Answer:',
    optionA: 'Driving a car',
    optionB: 'Catching a bus',
    optionC: 'Riding a bicycle',
    optionD: 'Flying a plane',
    correctOption: 'B'
  },
  {
    questionOrder: 4,
    questionText: '💳 + 🛍️ →Answer:',
    optionA: 'Cash Payment',
    optionB: 'Card Shopping / Digital Payment',
    optionC: 'ATM Withdrawal',
    optionD: 'Bank Deposit',
    correctOption: 'B'
  },
  {
    questionOrder: 5,
    questionText: '📦 + 🚚 →Answer:',
    optionA: 'Parcel Delivery / Delivery Truck',
    optionB: 'Factory Production',
    optionC: 'Warehouse Construction',
    optionD: 'Trash Disposal',
    correctOption: 'A'
  },
  {
    questionOrder: 6,
    questionText: '🌙 + 📱 →Answer:',
    optionA: 'Night Mode / Late Night Phone Use',
    optionB: 'Solar Charger',
    optionC: 'Alarm Clock',
    optionD: 'Camera Flash',
    correctOption: 'A'
  },
  {
    questionOrder: 7,
    questionText: 'I show that you belong to a college. Students usually carry me on campus.',
    optionA: 'Library Book',
    optionB: 'ID Card',
    optionC: 'Bus Pass',
    optionD: 'Ticket',
    correctOption: 'B'
  },
  {
    questionOrder: 8,
    questionText: 'I am a place where students perform practical work. CSE students spend time here with computers.',
    optionA: 'Computer Lab',
    optionB: 'Canteen',
    optionC: 'Auditorium',
    optionD: 'Playground',
    correctOption: 'A'
  },
  {
    questionOrder: 9,
    questionText: 'I store information in an organized way. Apps use me to save user data.',
    optionA: 'CPU',
    optionB: 'Database',
    optionC: 'RAM',
    optionD: 'Monitor',
    correctOption: 'B'
  },
  {
    questionOrder: 10,
    questionText: 'I am made using HTML, CSS and JavaScript. You can open me using a browser.',
    optionA: 'Operating System',
    optionB: 'Webpage / Website',
    optionC: 'Database Server',
    optionD: 'Mobile Hardware',
    correctOption: 'B'
  },
  {
    questionOrder: 11,
    questionText: 'I can store your files and programs. I can be carried in your pocket.',
    optionA: 'USB / Pen Drive',
    optionB: 'Desktop Tower',
    optionC: 'Server Rack',
    optionD: 'Mainframe',
    correctOption: 'A'
  },
  {
    questionOrder: 12,
    questionText: 'I find information on the internet. You type words into me to search.',
    optionA: 'Web Server',
    optionB: 'Search Engine',
    optionC: 'Router',
    optionD: 'Firewall',
    correctOption: 'B'
  },
  {
    questionOrder: 13,
    questionText: 'I am lighter than a feather, but no person can hold me for very long; what am I?',
    optionA: 'Breath',
    optionB: 'Shadow',
    optionC: 'Cloud',
    optionD: 'Thought',
    correctOption: 'A'
  },
  {
    questionOrder: 14,
    questionText: 'Two fathers and two sons go to a college fest, but only three people enter the hall. How is this possible?',
    optionA: 'One father stayed outside',
    optionB: 'They are grandfather, father, and son',
    optionC: 'Two of them are twins',
    optionD: 'It is a trick question with 4 people',
    correctOption: 'B'
  },
  {
    questionOrder: 15,
    questionText: 'I am a word of five letters. When you remove my first letter, I still sound the same; when you remove my last letter, I still sound the same; when you remove both, I still sound the same. What word am I?',
    optionA: 'EMPTY',
    optionB: 'QUEUE',
    optionC: 'LEVEL',
    optionD: 'RADAR',
    correctOption: 'B'
  },
  {
    questionOrder: 16,
    questionText: 'A student has seven candles. The wind blows out two, while the others burn completely. How many candles remain at the end?',
    optionA: '5',
    optionB: '2',
    optionC: '7',
    optionD: '0',
    correctOption: 'B'
  },
  {
    questionOrder: 17,
    questionText: 'I am the beginning of eternity, the end of time and space, and the beginning of every end; what am I?',
    optionA: 'The letter E',
    optionB: 'Nothing',
    optionC: 'Death',
    optionD: 'Infinity',
    correctOption: 'A'
  },
  {
    questionOrder: 18,
    questionText: 'A person looks at a photograph and says, “Brothers and sisters I have none, but this person’s father is my father’s son.” Who is in the photograph?',
    optionA: 'Himself',
    optionB: 'His son',
    optionC: 'His father',
    optionD: 'His nephew',
    correctOption: 'B'
  },
  {
    questionOrder: 19,
    questionText: 'I am always ahead of you, but you can never catch me. What am I?',
    optionA: 'Future',
    optionB: 'Shadow',
    optionC: 'Memory',
    optionD: 'Past',
    correctOption: 'A'
  },
  {
    questionOrder: 20,
    questionText: 'The more you know me, the larger I become. What am I?',
    optionA: 'Knowledge',
    optionB: 'Dark',
    optionC: 'Hole',
    optionD: 'Secret',
    correctOption: 'A'
  },
  {
    questionOrder: 21,
    questionText: 'I can be given, kept, broken, and fulfilled. What am I?',
    optionA: 'A Heart',
    optionB: 'A Promise',
    optionC: 'A Rule',
    optionD: 'A Gift',
    correctOption: 'B'
  },
  {
    questionOrder: 22,
    questionText: 'I exist only when shared by at least two people. What am I?',
    optionA: 'A Secret',
    optionB: 'A Relationship / Friendship',
    optionC: 'A Mirror',
    optionD: 'A Shadow',
    correctOption: 'B'
  },
  {
    questionOrder: 23,
    questionText: 'I am born in a second and can live forever. What am I?',
    optionA: 'A Memory',
    optionB: 'A Butterfly',
    optionC: 'A Spark',
    optionD: 'A Bubble',
    correctOption: 'A'
  },
  {
    questionOrder: 24,
    questionText: 'The richer you are in me, the poorer you appear. What am I?',
    optionA: 'Gold',
    optionB: 'Debt',
    optionC: 'Wisdom',
    optionD: 'Time',
    correctOption: 'B'
  },
  {
    questionOrder: 25,
    questionText: 'A number is written using only straight lines. Add one line and it becomes a different number. What could it be?',
    optionA: 'Roman Numeral (e.g., I to T or V to X)',
    optionB: '8',
    optionC: '0',
    optionD: '3',
    correctOption: 'A'
  },
  {
    questionOrder: 26,
    questionText: 'A square has four corners. You cut off one corner. How many corners does the new shape have?',
    optionA: '3',
    optionB: '5',
    optionC: '4',
    optionD: '2',
    correctOption: 'B'
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

async function importCreativeRiddlesDiplomaSet1() {
  const transaction = await sequelize.transaction();
  try {
    const round = await QuizRound.findByPk(TARGET_ROUND_ID, { transaction });
    if (!round) {
      throw new Error(`Target round not found: ${TARGET_ROUND_ID}`);
    }

    console.log(`Target Round Found: "${round.title}" (ID: ${round.id})`);

    const existingCount = await Question.count({ where: { roundId: round.id }, transaction });
    console.log(`Existing Question Count in SET 1: ${existingCount}`);

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
    console.log(`Final Question Count for Creative Riddles 1st Year Diploma SET 1: ${finalCount}`);

  } catch (err) {
    await transaction.rollback();
    console.error('❌ Import failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

importCreativeRiddlesDiplomaSet1();
