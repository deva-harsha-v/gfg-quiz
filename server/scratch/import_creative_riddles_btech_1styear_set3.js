require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const TARGET_ROUND_ID = '7e2ad610-115f-4482-b3d3-b4c9771b2840';

const questionsData = [
  {
    questionOrder: 1,
    questionText: 'Q1. 📦 + 🚚 + 🏠 → ?Answer:',
    optionA: 'Home Delivery / Parcel Courier',
    optionB: 'Warehouse',
    optionC: 'Shopping Mall',
    optionD: 'Bus Depot',
    correctOption: 'A'
  },
  {
    questionOrder: 2,
    questionText: 'Q2. 🎧 + 🔇 + 🔊 → ?Answer:',
    optionA: 'Noise Control / Volume Adjustment / Headphone Audio',
    optionB: 'Screen Brightness',
    optionC: 'Camera Zoom',
    optionD: 'Battery Saver',
    correctOption: 'A'
  },
  {
    questionOrder: 3,
    questionText: 'Q3. ♻️ + ⚡ + 🌱 → ?Answer:',
    optionA: 'Green Energy / Renewable Power',
    optionB: 'Coal Mining',
    optionC: 'Gasoline Engine',
    optionD: 'Nuclear Waste',
    correctOption: 'A'
  },
  {
    questionOrder: 4,
    questionText: 'Q4. 📊 + 🔍 + 💻 → ?Answer:',
    optionA: 'Data Analytics / Software Inspection',
    optionB: 'Video Editing',
    optionC: 'Graphic Design',
    optionD: 'Typing Tutor',
    correctOption: 'A'
  },
  {
    questionOrder: 5,
    questionText: 'Q5. 🤖 + 🧠 + 💡 → ?Answer:',
    optionA: 'Artificial Intelligence / Smart Robotics',
    optionB: 'Mechanical Gear',
    optionC: 'Manual Assembly',
    optionD: 'Solar Panel',
    correctOption: 'A'
  },
  {
    questionOrder: 6,
    questionText: 'Q6. 🔑 + 🔐 + 👤 → ?Answer:',
    optionA: 'User Authentication / Account Security',
    optionB: 'File Deletion',
    optionC: 'Guest Mode',
    optionD: 'Screen Printing',
    correctOption: 'A'
  },
  {
    questionOrder: 7,
    questionText: 'Q7. I connect many computers so that they can communicate. What am I?Answer:',
    optionA: 'Network / Router / Internet',
    optionB: 'Power Strip',
    optionC: 'Monitor',
    optionD: 'Hard Drive',
    correctOption: 'A'
  },
  {
    questionOrder: 8,
    questionText: 'Q8. I begin as an idea and become something that can be demonstrated. What am I?Answer:',
    optionA: 'Project / Prototype',
    optionB: 'Ticket',
    optionC: 'Receipt',
    optionD: 'Textbook',
    correctOption: 'A'
  },
  {
    questionOrder: 9,
    questionText: 'Q9. I am used to prove your identity when entering an account. What am I?Answer:',
    optionA: 'Password / OTP / Biometrics',
    optionB: 'Username',
    optionC: 'IP Address',
    optionD: 'Browser',
    correctOption: 'A'
  },
  {
    questionOrder: 10,
    questionText: 'Q10. I follow a sequence of steps to solve a problem. What am I?Answer:',
    optionA: 'Algorithm',
    optionB: 'Hardware',
    optionC: 'Monitor',
    optionD: 'RAM',
    correctOption: 'A'
  },
  {
    questionOrder: 11,
    questionText: 'Q11. I am an event where students compete in coding and innovation. What am I?Answer:',
    optionA: 'Hackathon / Tech Fest',
    optionB: 'Annual Day',
    optionC: 'Sports Meet',
    optionD: 'Alumni Dinner',
    correctOption: 'A'
  },
  {
    questionOrder: 12,
    questionText: 'Q12. I can capture a moment forever with a single click. What am I?Answer:',
    optionA: 'Camera / Photo',
    optionB: 'Mirror',
    optionC: 'Window',
    optionD: 'Clock',
    correctOption: 'A'
  },
  {
    questionOrder: 13,
    questionText: 'Q13. I have a battery and screen, but my main purpose is to calculate and communicate. What am I?Answer:',
    optionA: 'Smartphone / Tablet',
    optionB: 'Television',
    optionC: 'Wrist Watch',
    optionD: 'Flashlight',
    correctOption: 'A'
  },
  {
    questionOrder: 14,
    questionText: 'Q14. I can carry thousands of people but never take a single step. What am I?Answer:',
    optionA: 'Train / Ship / Airplane',
    optionB: 'Elevator',
    optionC: 'Bicycle',
    optionD: 'Escalator',
    correctOption: 'A'
  },
  {
    questionOrder: 15,
    questionText: 'Q15. I have teeth but cannot bite food. What am I?Answer:',
    optionA: 'Comb / Saw / Zipper',
    optionB: 'Fork',
    optionC: 'Knife',
    optionD: 'Spoon',
    correctOption: 'A'
  },
  {
    questionOrder: 16,
    questionText: 'Q16. I have a ring but no finger and can produce sound. What am I?Answer:',
    optionA: 'Telephone / Bell',
    optionB: 'Door Lock',
    optionC: 'Key Ring',
    optionD: 'Whistle',
    correctOption: 'A'
  },
  {
    questionOrder: 17,
    questionText: 'Q17. I can fly without wings and cry without eyes. What am I?Answer:',
    optionA: 'Cloud',
    optionB: 'Bird',
    optionC: 'Kite',
    optionD: 'Airplane',
    correctOption: 'A'
  },
  {
    questionOrder: 18,
    questionText: 'Q18. I am always running, yet I never get tired or move from my place. What am I?Answer:',
    optionA: 'River / Tap Water / Clock',
    optionB: 'Athlete',
    optionC: 'Car',
    optionD: 'Windmill',
    correctOption: 'A'
  },
  {
    questionOrder: 19,
    questionText: 'Q19. I grow stronger whenever I successfully face difficulty. What am I?Answer:',
    optionA: 'Character / Resilience',
    optionB: 'Glass',
    optionC: 'Paper',
    optionD: 'Ice',
    correctOption: 'A'
  },
  {
    questionOrder: 20,
    questionText: 'Q20. I can imprison the mind even though I have no walls. What am I?Answer:',
    optionA: 'Fear / Doubt',
    optionB: 'Prison',
    optionC: 'Room',
    optionD: 'Box',
    correctOption: 'A'
  },
  {
    questionOrder: 21,
    questionText: 'Q21. I arrive after you miss me, and I leave before you realize my value. What am I?Answer:',
    optionA: 'Opportunity / Time',
    optionB: 'Bus',
    optionC: 'Train',
    optionD: 'Package',
    correctOption: 'A'
  },
  {
    questionOrder: 22,
    questionText: 'Q22. The more you share me, the more I can multiply. What am I?Answer:',
    optionA: 'Knowledge / Happiness',
    optionB: 'Money',
    optionC: 'Food',
    optionD: 'Land',
    correctOption: 'A'
  },
  {
    questionOrder: 23,
    questionText: 'Q23. I become smaller when you discuss me and larger when you constantly feed me. What am I?Answer:',
    optionA: 'Problem / Worry',
    optionB: 'Fire',
    optionC: 'Pet',
    optionD: 'Plant',
    correctOption: 'A'
  },
  {
    questionOrder: 24,
    questionText: 'Q24. I have no body, but I can cause an entire crowd to move. What am I?Answer:',
    optionA: 'Music / Siren / Voice',
    optionB: 'Building',
    optionC: 'Statue',
    optionD: 'Tree',
    correctOption: 'A'
  },
  {
    questionOrder: 25,
    questionText: 'Q25. What is half of 12 plus 6?Answer:',
    optionA: '12',
    optionB: '9',
    optionC: '6',
    optionD: '18',
    correctOption: 'A'
  },
  {
    questionOrder: 26,
    questionText: 'Q26. If you divide 10 by one-half, what is the result?Answer:',
    optionA: '20',
    optionB: '5',
    optionC: '10',
    optionD: '2.5',
    correctOption: 'A'
  },
  {
    questionOrder: 27,
    questionText: 'Q27. What is the next number: 1, 4, 9, 16, 25, __?Answer:',
    optionA: '36',
    optionB: '30',
    optionC: '35',
    optionD: '49',
    correctOption: 'A'
  },
  {
    questionOrder: 28,
    questionText: 'Q28. A dozen equals how many items?Answer:',
    optionA: '12',
    optionB: '10',
    optionC: '6',
    optionD: '24',
    correctOption: 'A'
  },
  {
    questionOrder: 29,
    questionText: 'Q29. If three cats catch three mice in three minutes, how long would 100 cats take to catch 100 mice at the same rate?Answer:',
    optionA: '3 minutes',
    optionB: '100 minutes',
    optionC: '300 minutes',
    optionD: '1 minute',
    correctOption: 'A'
  },
  {
    questionOrder: 30,
    questionText: 'Q30. What is the smallest positive integer?Answer:',
    optionA: '1',
    optionB: '0',
    optionC: '-1',
    optionD: '2',
    correctOption: 'A'
  }
];

async function importCreativeRiddlesBTech1stYearSet3() {
  const transaction = await sequelize.transaction();
  try {
    const round = await QuizRound.findByPk(TARGET_ROUND_ID, { transaction });
    if (!round) {
      throw new Error(`Target round not found: ${TARGET_ROUND_ID}`);
    }

    console.log(`Target Round Found: "${round.title}" (ID: ${round.id})`);
    console.log(`Current Status: ${round.status}`);

    const existingCount = await Question.count({ where: { roundId: round.id }, transaction });
    console.log(`Existing Question Count in B.Tech 1st Year SET 3: ${existingCount}`);

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
    console.log(`Final Question Count for Creative Riddles B.Tech 1st Year SET 3: ${finalCount}`);

  } catch (err) {
    await transaction.rollback();
    console.error('❌ Import failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

importCreativeRiddlesBTech1stYearSet3();
