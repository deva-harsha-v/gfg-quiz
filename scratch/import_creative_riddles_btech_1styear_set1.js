require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const TARGET_ROUND_ID = 'ebde34b4-ee43-49d1-a4dc-df845b10cdce';

const questionsData = [
  {
    questionOrder: 1,
    questionText: 'Q1. 💻 + 🐛 + 🔧 → ?Answer:',
    optionA: 'Debugging / Bug Repair',
    optionB: 'Hardware Upgrade',
    optionC: 'Virus Attack',
    optionD: 'Screen Replacement',
    correctOption: 'A'
  },
  {
    questionOrder: 2,
    questionText: 'Q2. 📚 + ✍️ + 🎓 → ?Answer:',
    optionA: 'Study / Graduation / Degree',
    optionB: 'Video Gaming',
    optionC: 'Shopping',
    optionD: 'Cooking',
    correctOption: 'A'
  },
  {
    questionOrder: 3,
    questionText: 'Q3. 📱 + 🔌 + ⚡ → ?Answer:',
    optionA: 'Fast Charging / Battery Charger',
    optionB: 'Headphone Connection',
    optionC: 'Screen Guard',
    optionD: 'SIM Card',
    correctOption: 'A'
  },
  {
    questionOrder: 4,
    questionText: 'Q4. 🔐 + 💻 + 🛡️ → ?Answer:',
    optionA: 'Cyber Security / Firewall',
    optionB: 'Keylogger',
    optionC: 'Software Piracy',
    optionD: 'Dust Cover',
    correctOption: 'A'
  },
  {
    questionOrder: 5,
    questionText: 'Q5. 🎓 + 🪪 + 🏫 → ?Answer:',
    optionA: 'Student ID / Campus Identity',
    optionB: 'Library Fine',
    optionC: 'Bus Ticket',
    optionD: 'Driving License',
    correctOption: 'A'
  },
  {
    questionOrder: 6,
    questionText: 'Q6. 🏫 + 📶 + 📱 → ?Answer:',
    optionA: 'Campus Wi-Fi / College Network',
    optionB: 'Cell Tower Construction',
    optionC: 'Radio Station',
    optionD: 'Satellite TV',
    correctOption: 'A'
  },
  {
    questionOrder: 7,
    questionText: 'Q7. I have keys but no locks and space but no room. What am I?Answer:',
    optionA: 'Keyboard',
    optionB: 'Piano',
    optionC: 'Map',
    optionD: 'House',
    correctOption: 'A'
  },
  {
    questionOrder: 8,
    questionText: 'Q8. I have a face and two hands, but I cannot smile or clap. What am I?Answer:',
    optionA: 'Clock',
    optionB: 'Mirror',
    optionC: 'Portrait',
    optionD: 'Puppet',
    correctOption: 'A'
  },
  {
    questionOrder: 9,
    questionText: 'Q9. I get wetter the more I dry. What am I?Answer:',
    optionA: 'Towel',
    optionB: 'Sponge',
    optionC: 'Cloud',
    optionD: 'Raincoat',
    correctOption: 'A'
  },
  {
    questionOrder: 10,
    questionText: 'Q10. I have many pages, but I am not a tree. What am I?Answer:',
    optionA: 'Book',
    optionB: 'Website',
    optionC: 'Newspaper',
    optionD: 'Library',
    correctOption: 'A'
  },
  {
    questionOrder: 11,
    questionText: 'Q11. I become smaller every time I take a bath. What am I?Answer:',
    optionA: 'Soap',
    optionB: 'Candle',
    optionC: 'Ice Cube',
    optionD: 'Sponge',
    correctOption: 'A'
  },
  {
    questionOrder: 12,
    questionText: 'Q12. I follow you in sunlight but disappear in darkness. What am I?Answer:',
    optionA: 'Shadow',
    optionB: 'Reflection',
    optionC: 'Wind',
    optionD: 'Echo',
    correctOption: 'A'
  },
  {
    questionOrder: 13,
    questionText: 'Q13. I travel around the world while remaining attached to one corner of an envelope. What am I?Answer:',
    optionA: 'Postage Stamp',
    optionB: 'Letter',
    optionC: 'Airplane',
    optionD: 'Address Tag',
    correctOption: 'A'
  },
  {
    questionOrder: 14,
    questionText: 'Q14. The more you remove from me, the larger I become. What am I?Answer:',
    optionA: 'Hole',
    optionB: 'Shadow',
    optionC: 'Pit',
    optionD: 'Secret',
    correctOption: 'A'
  },
  {
    questionOrder: 15,
    questionText: 'Q15. I have one eye but cannot see anything. What am I?Answer:',
    optionA: 'Needle / Storm',
    optionB: 'Potato',
    optionC: 'Target',
    optionD: 'Camera',
    correctOption: 'A'
  },
  {
    questionOrder: 16,
    questionText: 'Q16. I have many holes but can still hold water. What am I?Answer:',
    optionA: 'Sponge',
    optionB: 'Bucket',
    optionC: 'Net',
    optionD: 'Filter',
    correctOption: 'A'
  },
  {
    questionOrder: 17,
    questionText: 'Q17. I rise when rain falls and slowly disappear under the sun. What am I?Answer:',
    optionA: 'Umbrella / Puddle',
    optionB: 'Cloud',
    optionC: 'Rainbow',
    optionD: 'Plant',
    correctOption: 'A'
  },
  {
    questionOrder: 18,
    questionText: 'Q18. I belong to you, but other people usually say me more than you do. What am I?Answer:',
    optionA: 'Your Name',
    optionB: 'Phone Number',
    optionC: 'Address',
    optionD: 'Signature',
    correctOption: 'A'
  },
  {
    questionOrder: 19,
    questionText: 'Q19. The more you know about me, the larger I become. What am I?Answer:',
    optionA: 'Knowledge',
    optionB: 'Darkness',
    optionC: 'Hole',
    optionD: 'Fear',
    correctOption: 'A'
  },
  {
    questionOrder: 20,
    questionText: 'Q20. I can be given, kept, broken, and fulfilled. What am I?Answer:',
    optionA: 'Promise',
    optionB: 'Rule',
    optionC: 'Gift',
    optionD: 'Heart',
    correctOption: 'A'
  },
  {
    questionOrder: 21,
    questionText: 'Q21. I become stronger when I am shared between people. What am I?Answer:',
    optionA: 'Friendship / Trust',
    optionB: 'Money',
    optionC: 'Food',
    optionD: 'Distance',
    correctOption: 'A'
  },
  {
    questionOrder: 22,
    questionText: 'Q22. I am born in a second but can remain forever. What am I?Answer:',
    optionA: 'Memory',
    optionB: 'Spark',
    optionC: 'Bubble',
    optionD: 'Flash',
    correctOption: 'A'
  },
  {
    questionOrder: 23,
    questionText: 'Q23. The more I am divided among people, the more I can grow. What am I?Answer:',
    optionA: 'Knowledge',
    optionB: 'Pizza',
    optionC: 'Money',
    optionD: 'Land',
    correctOption: 'A'
  },
  {
    questionOrder: 24,
    questionText: 'Q24. I am lighter than air but can weigh heavily on a person\'s conscience. What am I?Answer:',
    optionA: 'Lie / Secret / Guilt',
    optionB: 'Feather',
    optionC: 'Cloud',
    optionD: 'Smoke',
    correctOption: 'A'
  },
  {
    questionOrder: 25,
    questionText: 'Q25. I have no value by myself, but I can change the value of another digit. What number am I?Answer:',
    optionA: 'Zero (0)',
    optionB: 'One (1)',
    optionC: 'Nine (9)',
    optionD: 'Infinity',
    correctOption: 'A'
  },
  {
    questionOrder: 26,
    questionText: 'Q26. I am between 1 and 3 but I am not 2. Give one possible answer.Answer:',
    optionA: 'The word "and" / 1.5',
    optionB: 'Number 4',
    optionC: 'Number 0',
    optionD: 'Number 5',
    correctOption: 'A'
  },
  {
    questionOrder: 27,
    questionText: 'Q27. I am an odd number. Remove my first letter, and I become even. What number word am I?Answer:',
    optionA: 'Seven (S-EVEN)',
    optionB: 'Three',
    optionC: 'Nine',
    optionD: 'Eleven',
    correctOption: 'A'
  },
  {
    questionOrder: 28,
    questionText: 'Q28. You overtake the person in second place during a race. What position are you now in?Answer:',
    optionA: '2nd place',
    optionB: '1st place',
    optionC: '3rd place',
    optionD: 'Last place',
    correctOption: 'A'
  },
  {
    questionOrder: 29,
    questionText: 'Q29. A square has four corners. If one corner is cut off, how many corners does the new shape have?Answer:',
    optionA: '5 corners',
    optionB: '3 corners',
    optionC: '4 corners',
    optionD: '6 corners',
    correctOption: 'A'
  },
  {
    questionOrder: 30,
    questionText: 'Q30. How many months have at least 28 days?Answer:',
    optionA: 'All 12 months',
    optionB: 'Only 1 month (February)',
    optionC: '6 months',
    optionD: '7 months',
    correctOption: 'A'
  }
];

async function importCreativeRiddlesBTech1stYearSet1() {
  const transaction = await sequelize.transaction();
  try {
    const round = await QuizRound.findByPk(TARGET_ROUND_ID, { transaction });
    if (!round) {
      throw new Error(`Target round not found: ${TARGET_ROUND_ID}`);
    }

    console.log(`Target Round Found: "${round.title}" (ID: ${round.id})`);
    console.log(`Current Status: ${round.status}`);

    const existingCount = await Question.count({ where: { roundId: round.id }, transaction });
    console.log(`Existing Question Count in B.Tech 1st Year SET 1: ${existingCount}`);

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
    console.log(`Final Question Count for Creative Riddles B.Tech 1st Year SET 1: ${finalCount}`);

  } catch (err) {
    await transaction.rollback();
    console.error('❌ Import failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

importCreativeRiddlesBTech1stYearSet1();
