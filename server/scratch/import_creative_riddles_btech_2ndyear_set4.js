require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const TARGET_ROUND_ID = '7cda83db-4e3c-4872-a62d-547ce921b987';

const questionsData = [
  {
    questionOrder: 1,
    questionText: 'Q1. 💻 + 🐛 + 🔧 → ?Answer:',
    optionA: 'Debugging / Software Repair',
    optionB: 'Hardware Upgrade',
    optionC: 'Virus Attack',
    optionD: 'Screen Cleaning',
    correctOption: 'A'
  },
  {
    questionOrder: 2,
    questionText: 'Q2. 🔐 + 💻 + 🛡️ → ?Answer:',
    optionA: 'Cyber Security / Firewall',
    optionB: 'Keylogger',
    optionC: 'Software Piracy',
    optionD: 'Keyboard Cover',
    correctOption: 'A'
  },
  {
    questionOrder: 3,
    questionText: 'Q3. 🏆 + 🎉 + 🥇 → ?Answer:',
    optionA: 'First Rank / Gold Medal Celebration',
    optionB: 'Exam Hall',
    optionC: 'Library Study',
    optionD: 'Class Attendance',
    correctOption: 'A'
  },
  {
    questionOrder: 4,
    questionText: 'Q4. ☀️ + 🌑 + 🌍 → ?Answer:',
    optionA: 'Solar Eclipse / Celestial Alignment',
    optionB: 'Thunderstorm',
    optionC: 'Tornado',
    optionD: 'Earthquake',
    correctOption: 'A'
  },
  {
    questionOrder: 5,
    questionText: 'Q5. 💾 + 📡 + 📥 → ?Answer:',
    optionA: 'Data Download / Cloud Sync',
    optionB: 'Printer Jam',
    optionC: 'Monitor Brightness',
    optionD: 'Battery Charge',
    correctOption: 'A'
  },
  {
    questionOrder: 6,
    questionText: 'Q6. 🔭 + 🌌 + ⭐ → ?Answer:',
    optionA: 'Stargazing / Astronomical Observation',
    optionB: 'Weather Forecast',
    optionC: 'Ocean Diving',
    optionD: 'Mountain Climbing',
    correctOption: 'A'
  },
  {
    questionOrder: 7,
    questionText: 'Q7. I have many pages, but I am not a tree. What am I?Answer:',
    optionA: 'Book / Document',
    optionB: 'Forest',
    optionC: 'Table',
    optionD: 'House',
    correctOption: 'A'
  },
  {
    questionOrder: 8,
    questionText: 'Q8. I have cities, roads, and rivers but no real people or vehicles. What am I?Answer:',
    optionA: 'Map',
    optionB: 'Globe',
    optionC: 'Atlas',
    optionD: 'Satellite Photo',
    correctOption: 'A'
  },
  {
    questionOrder: 9,
    questionText: 'Q9. I follow a sequence of steps to solve a problem. What am I?Answer:',
    optionA: 'Algorithm',
    optionB: 'Hardware',
    optionC: 'Monitor',
    optionD: 'RAM',
    correctOption: 'A'
  },
  {
    questionOrder: 10,
    questionText: 'Q10. I learn from examples but never attend school. What am I?Answer:',
    optionA: 'Machine Learning Model / AI',
    optionB: 'Student',
    optionC: 'Textbook',
    optionD: 'Blackboard',
    correctOption: 'A'
  },
  {
    questionOrder: 11,
    questionText: 'Q11. I am lighter than a feather, yet nobody can hold me for very long. What am I?Answer:',
    optionA: 'Breath',
    optionB: 'Shadow',
    optionC: 'Cloud',
    optionD: 'Thought',
    correctOption: 'A'
  },
  {
    questionOrder: 12,
    questionText: 'Q12. I can cross an ocean in seconds without leaving my original location. What am I?Answer:',
    optionA: 'Internet Signal / Email / Fiber Optic Data',
    optionB: 'Boat',
    optionC: 'Airplane',
    optionD: 'Fish',
    correctOption: 'A'
  },
  {
    questionOrder: 13,
    questionText: 'Q13. I travel around the world while remaining attached to one corner of an envelope. What am I?Answer:',
    optionA: 'Postage Stamp',
    optionB: 'Letter',
    optionC: 'Address Tag',
    optionD: 'Seal',
    correctOption: 'A'
  },
  {
    questionOrder: 14,
    questionText: 'Q14. I have many holes but can still hold water. What am I?Answer:',
    optionA: 'Sponge',
    optionB: 'Bucket',
    optionC: 'Net',
    optionD: 'Filter',
    correctOption: 'A'
  },
  {
    questionOrder: 15,
    questionText: 'Q15. I belong to you, but other people usually say me more than you do. What am I?Answer:',
    optionA: 'Your Name',
    optionB: 'Phone Number',
    optionC: 'Address',
    optionD: 'Signature',
    correctOption: 'A'
  },
  {
    questionOrder: 16,
    questionText: 'Q16. I can fly without wings and cry without eyes. What am I?Answer:',
    optionA: 'Cloud',
    optionB: 'Bird',
    optionC: 'Kite',
    optionD: 'Airplane',
    correctOption: 'A'
  },
  {
    questionOrder: 17,
    questionText: 'Q17. A room has four corners, and a cat sits in every corner. Each cat sees three other cats. How many cats are there?Answer:',
    optionA: '4 cats',
    optionB: '12 cats',
    optionC: '3 cats',
    optionD: '16 cats',
    correctOption: 'A'
  },
  {
    questionOrder: 18,
    questionText: 'Q18. I rise when heated, can cover a mirror, and disappear into the air. What am I?Answer:',
    optionA: 'Steam / Water Vapor',
    optionB: 'Smoke',
    optionC: 'Dust',
    optionD: 'Rain',
    correctOption: 'A'
  },
  {
    questionOrder: 19,
    questionText: 'Q19. I can be given, kept, broken, and fulfilled. What am I?Answer:',
    optionA: 'Promise',
    optionB: 'Rule',
    optionC: 'Gift',
    optionD: 'Heart',
    correctOption: 'A'
  },
  {
    questionOrder: 20,
    questionText: 'Q20. I become stronger when I am shared between people. What am I?Answer:',
    optionA: 'Friendship / Trust',
    optionB: 'Money',
    optionC: 'Food',
    optionD: 'Distance',
    correctOption: 'A'
  },
  {
    questionOrder: 21,
    questionText: 'Q21. The more I am divided among people, the more I can grow. What am I?Answer:',
    optionA: 'Knowledge',
    optionB: 'Pizza',
    optionC: 'Money',
    optionD: 'Land',
    correctOption: 'A'
  },
  {
    questionOrder: 22,
    questionText: 'Q22. What has a mouth, head, bed, and runs but never walks?Answer:',
    optionA: 'River',
    optionB: 'Human',
    optionC: 'Cave',
    optionD: 'Mountain',
    correctOption: 'A'
  },
  {
    questionOrder: 23,
    questionText: 'Q23. Before Mount Everest was discovered, what was the highest mountain in the world?Answer:',
    optionA: 'Mount Everest',
    optionB: 'K2',
    optionC: 'Kanchenjunga',
    optionD: 'Kilimanjaro',
    correctOption: 'A'
  },
  {
    questionOrder: 24,
    questionText: 'Q24. Which weighs more: one kilogram of iron or one kilogram of cotton?Answer:',
    optionA: 'They weigh the same',
    optionB: 'Iron',
    optionC: 'Cotton',
    optionD: 'Depends on humidity',
    correctOption: 'A'
  },
  {
    questionOrder: 25,
    questionText: 'Q25. I am an odd number. Remove my first letter, and I become even. What number word am I?Answer:',
    optionA: 'Seven (S-EVEN)',
    optionB: 'Three',
    optionC: 'Nine',
    optionD: 'Eleven',
    correctOption: 'A'
  },
  {
    questionOrder: 26,
    questionText: 'Q26. A square has four corners. If one corner is cut off, how many corners does the new shape have?Answer:',
    optionA: '5 corners',
    optionB: '3 corners',
    optionC: '4 corners',
    optionD: '6 corners',
    correctOption: 'A'
  },
  {
    questionOrder: 27,
    questionText: 'Q27.A farmer has 19 sheep. All but 7 die. How many remain?Answer:',
    optionA: '7 sheep',
    optionB: '12 sheep',
    optionC: '19 sheep',
    optionD: '0 sheep',
    correctOption: 'A'
  },
  {
    questionOrder: 28,
    questionText: 'Q28. A clock shows 3:15. What is the angle between the hands?Answer:',
    optionA: '7.5 degrees',
    optionB: '0 degrees',
    optionC: '15 degrees',
    optionD: '90 degrees',
    correctOption: 'A'
  },
  {
    questionOrder: 29,
    questionText: 'Q29. What is ½ × ⅔ × ¾ × ⅘ × ⅚ × ⁶⁄₇ × ⅞ × ⅘ × ⁹⁄₁₀ × 1000?Answer:',
    optionA: '80',
    optionB: '100',
    optionC: '50',
    optionD: '120',
    correctOption: 'A'
  },
  {
    questionOrder: 30,
    questionText: 'Q30. How many total squares are on a standard 8 × 8 chessboard?Answer:',
    optionA: '204 total squares',
    optionB: '64 squares',
    optionC: '128 squares',
    optionD: '256 squares',
    correctOption: 'A'
  }
];

async function importCreativeRiddlesBTech2ndYearSet4() {
  const transaction = await sequelize.transaction();
  try {
    const round = await QuizRound.findByPk(TARGET_ROUND_ID, { transaction });
    if (!round) {
      throw new Error(`Target round not found: ${TARGET_ROUND_ID}`);
    }

    console.log(`Target Round Found: "${round.title}" (ID: ${round.id})`);
    console.log(`Current Status: ${round.status}`);

    const existingCount = await Question.count({ where: { roundId: round.id }, transaction });
    console.log(`Existing Question Count in B.Tech 2nd Year SET 4: ${existingCount}`);

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
    console.log(`Final Question Count for Creative Riddles B.Tech 2nd Year SET 4: ${finalCount}`);

  } catch (err) {
    await transaction.rollback();
    console.error('❌ Import failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

importCreativeRiddlesBTech2ndYearSet4();
