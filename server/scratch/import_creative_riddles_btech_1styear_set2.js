require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const TARGET_ROUND_ID = '81c72cc0-4cf6-40c1-a4f1-68a547b9aad7';

const questionsData = [
  {
    questionOrder: 1,
    questionText: 'Q1. 🚌 + ⏰ + 🏫 → ?Answer:',
    optionA: 'College Bus Schedule / Morning Bus',
    optionB: 'Railway Station',
    optionC: 'Flight Departure',
    optionD: 'Traffic Signal',
    correctOption: 'A'
  },
  {
    questionOrder: 2,
    questionText: 'Q2. 💻 + 📝 + 📚 → ?Answer:',
    optionA: 'Digital Study / E-Notes / Online Learning',
    optionB: 'Video Game Streaming',
    optionC: 'Shopping Cart',
    optionD: 'Music Album',
    correctOption: 'A'
  },
  {
    questionOrder: 3,
    questionText: 'Q3. 🏆 + 🎉 + 🥇 → ?Answer:',
    optionA: 'First Rank / Gold Medal Celebration',
    optionB: 'Exam Hall',
    optionC: 'Classroom Lecture',
    optionD: 'Library Fine',
    correctOption: 'A'
  },
  {
    questionOrder: 4,
    questionText: 'Q4. 🔄 + 💻 + ♾️ → ?Answer:',
    optionA: 'Infinite Loop / Continuous Execution',
    optionB: 'Screen Saver',
    optionC: 'Mouse Click',
    optionD: 'Keyboard Shortcut',
    correctOption: 'A'
  },
  {
    questionOrder: 5,
    questionText: 'Q5. 🖨️ + 📄 + 🖱️ → ?Answer:',
    optionA: 'Document Printing / Desktop Setup',
    optionB: 'Scanner',
    optionC: 'Hard Drive',
    optionD: 'Router',
    correctOption: 'A'
  },
  {
    questionOrder: 6,
    questionText: 'Q6. 🌍 + 🔥 + 🌡️ → ?Answer:',
    optionA: 'Global Warming / Climate Heat',
    optionB: 'Volcano Eruption',
    optionC: 'Solar Eclipse',
    optionD: 'Rainfall',
    correctOption: 'A'
  },
  {
    questionOrder: 7,
    questionText: 'Q7. I can be opened, closed, saved, and shared, but I am not a door. What am I?Answer:',
    optionA: 'Digital File / Document',
    optionB: 'Window',
    optionC: 'Locker',
    optionD: 'Box',
    correctOption: 'A'
  },
  {
    questionOrder: 8,
    questionText: 'Q8. I have cities, roads, and rivers but no real people or vehicles. What am I?Answer:',
    optionA: 'Map',
    optionB: 'Globe',
    optionC: 'Atlas',
    optionD: 'Satellite Image',
    correctOption: 'A'
  },
  {
    questionOrder: 9,
    questionText: 'Q9. I remember information only while power is available. What am I?Answer:',
    optionA: 'RAM (Volatile Memory)',
    optionB: 'Hard Disk',
    optionC: 'USB Drive',
    optionD: 'CD-ROM',
    correctOption: 'A'
  },
  {
    questionOrder: 10,
    questionText: 'Q10. I store information in an organized form for applications to use. What am I?Answer:',
    optionA: 'Database',
    optionB: 'CPU',
    optionC: 'Monitor',
    optionD: 'Keyboard',
    correctOption: 'A'
  },
  {
    questionOrder: 11,
    questionText: 'Q11. I am created using HTML, CSS, and JavaScript and viewed in a browser. What am I?Answer:',
    optionA: 'Webpage / Website',
    optionB: 'Operating System',
    optionC: 'Database Server',
    optionD: 'Mobile Hardware',
    correctOption: 'A'
  },
  {
    questionOrder: 12,
    questionText: 'Q12. I help you find information by taking you from one web page to another. What am I?Answer:',
    optionA: 'Hyperlink / URL',
    optionB: 'Router',
    optionC: 'Printer',
    optionD: 'Power Cable',
    correctOption: 'A'
  },
  {
    questionOrder: 13,
    questionText: 'Q13. I become shorter while helping you see in darkness. What am I?Answer:',
    optionA: 'Candle',
    optionB: 'Flashlight',
    optionC: 'Matchstick',
    optionD: 'Bulb',
    correctOption: 'A'
  },
  {
    questionOrder: 14,
    questionText: 'Q14. I have a neck and arms but no head or hands. What am I?Answer:',
    optionA: 'Shirt / Sweater',
    optionB: 'Bottle',
    optionC: 'Guitar',
    optionD: 'Chair',
    correctOption: 'A'
  },
  {
    questionOrder: 15,
    questionText: 'Q15. I can be opened without a key and closed without a door. What am I?Answer:',
    optionA: 'Book / Eyes',
    optionB: 'Safe Box',
    optionC: 'Padlock',
    optionD: 'Locker',
    correctOption: 'A'
  },
  {
    questionOrder: 16,
    questionText: 'Q16. I have a mouse, windows, and a desktop but no living creature inside me. What am I?Answer:',
    optionA: 'Computer System',
    optionB: 'House',
    optionC: 'Barn',
    optionD: 'Office Building',
    correctOption: 'A'
  },
  {
    questionOrder: 17,
    questionText: 'Q17. I am a cloud that never rains and a drive that never moves. What am I?Answer:',
    optionA: 'Cloud Storage / Hard Drive',
    optionB: 'Cumulus Cloud',
    optionC: 'Car Drive',
    optionD: 'Storm',
    correctOption: 'A'
  },
  {
    questionOrder: 18,
    questionText: 'Q18. I fit inside your pocket but can contain books, music, and videos. What am I?Answer:',
    optionA: 'Smartphone / Memory Card',
    optionB: 'Paper Notebook',
    optionC: 'Wallet',
    optionD: 'Keychain',
    correctOption: 'A'
  },
  {
    questionOrder: 19,
    questionText: 'Q19. I can travel through centuries without moving from my original place. What am I?Answer:',
    optionA: 'History Book / Ancient Monument',
    optionB: 'Clock',
    optionC: 'Tree',
    optionD: 'Vehicle',
    correctOption: 'A'
  },
  {
    questionOrder: 20,
    questionText: 'Q20. I disappear the moment you speak my name. What am I?Answer:',
    optionA: 'Silence',
    optionB: 'Secret',
    optionC: 'Darkness',
    optionD: 'Whisper',
    correctOption: 'A'
  },
  {
    questionOrder: 21,
    questionText: 'Q21. I cannot be seen but can be lost in seconds and rebuilt only slowly. What am I?Answer:',
    optionA: 'Trust / Reputation',
    optionB: 'Money',
    optionC: 'Keys',
    optionD: 'Shadow',
    correctOption: 'A'
  },
  {
    questionOrder: 22,
    questionText: 'Q22. The more people possess me, the less unique I become. What am I?Answer:',
    optionA: 'A Secret / Common Trend',
    optionB: 'Gold',
    optionC: 'Knowledge',
    optionD: 'Time',
    correctOption: 'A'
  },
  {
    questionOrder: 23,
    questionText: 'Q23. I can destroy relationships but fit inside a mouth. What am I?Answer:',
    optionA: 'Lie / Harsh Tongue',
    optionB: 'Food',
    optionC: 'Water',
    optionD: 'Teeth',
    correctOption: 'A'
  },
  {
    questionOrder: 24,
    questionText: 'Q24. Without me, questions are rarely asked and discoveries rarely begin. What am I?Answer:',
    optionA: 'Curiosity',
    optionB: 'Paper',
    optionC: 'Pen',
    optionD: 'Book',
    correctOption: 'A'
  },
  {
    questionOrder: 25,
    questionText: 'Q25. If there are six apples and you take four, how many apples do you have?Answer:',
    optionA: '4 (the ones you took)',
    optionB: '2',
    optionC: '6',
    optionD: '0',
    correctOption: 'A'
  },
  {
    questionOrder: 26,
    questionText: 'Q26. A farmer has 19 sheep. All but 7 die. How many remain?Answer:',
    optionA: '7 sheep',
    optionB: '12 sheep',
    optionC: '19 sheep',
    optionD: '0 sheep',
    correctOption: 'A'
  },
  {
    questionOrder: 27,
    questionText: 'Q27. What number becomes smaller when turned upside down?Answer:',
    optionA: '9 (becomes 6)',
    optionB: '8',
    optionC: '0',
    optionD: '1',
    correctOption: 'A'
  },
  {
    questionOrder: 28,
    questionText: 'Q28. A number multiplied by itself equals twice the number. What positive number is it?Answer:',
    optionA: '2 (2 x 2 = 4 = 2 x 2)',
    optionB: '4',
    optionC: '1',
    optionD: '8',
    correctOption: 'A'
  },
  {
    questionOrder: 29,
    questionText: 'Q29. I am an even number. Remove half of my shape, and I become zero. What number am I?Answer:',
    optionA: '8 (cut horizontally leaves 0)',
    optionB: '6',
    optionC: '4',
    optionD: '2',
    correctOption: 'A'
  },
  {
    questionOrder: 30,
    questionText: 'Q30. How many sides does a circle have?Answer:',
    optionA: '2 (inside and outside)',
    optionB: '0',
    optionC: '1',
    optionD: 'Infinite',
    correctOption: 'A'
  }
];

async function importCreativeRiddlesBTech1stYearSet2() {
  const transaction = await sequelize.transaction();
  try {
    const round = await QuizRound.findByPk(TARGET_ROUND_ID, { transaction });
    if (!round) {
      throw new Error(`Target round not found: ${TARGET_ROUND_ID}`);
    }

    console.log(`Target Round Found: "${round.title}" (ID: ${round.id})`);
    console.log(`Current Status: ${round.status}`);

    const existingCount = await Question.count({ where: { roundId: round.id }, transaction });
    console.log(`Existing Question Count in B.Tech 1st Year SET 2: ${existingCount}`);

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
    console.log(`Final Question Count for Creative Riddles B.Tech 1st Year SET 2: ${finalCount}`);

  } catch (err) {
    await transaction.rollback();
    console.error('❌ Import failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

importCreativeRiddlesBTech1stYearSet2();
