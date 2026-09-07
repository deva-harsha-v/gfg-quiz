require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const TARGET_ROUND_ID = 'dcfd2a99-461a-4ce3-a4f7-607754025e88';

const questionsData = [
  {
    questionOrder: 1,
    questionText: 'Q1. ♻️ + ⚡ + 🌱 → ?Answer:',
    optionA: 'Green Renewable Energy',
    optionB: 'Coal Power Plant',
    optionC: 'Nuclear Waste',
    optionD: 'Petrol Engine',
    correctOption: 'A'
  },
  {
    questionOrder: 2,
    questionText: 'Q2. 🤖 + 🧠 + 💡 → ?Answer:',
    optionA: 'AI / Smart Innovation',
    optionB: 'Mechanical Gear',
    optionC: 'Manual Assembly',
    optionD: 'Solar Panel',
    correctOption: 'A'
  },
  {
    questionOrder: 3,
    questionText: 'Q3. 📱 + 🌐 + 📝 → ?Answer:',
    optionA: 'Online Exam / Digital Form',
    optionB: 'Camera Photo',
    optionC: 'Radio Broadcast',
    optionD: 'Video Stream',
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
    questionText: 'Q5. 🌋 + 🔥 + 💨 → ?Answer:',
    optionA: 'Volcanic Eruption / Magma Ash',
    optionB: 'Ocean Wave',
    optionC: 'Glacial Drift',
    optionD: 'Rainfall',
    correctOption: 'A'
  },
  {
    questionOrder: 6,
    questionText: 'Q6. 🧱 + 🔥 + 🛡️ → ?Answer:',
    optionA: 'Firewall / Protective Construction',
    optionB: 'Water Pipe',
    optionC: 'Glass Window',
    optionD: 'Wooden Door',
    correctOption: 'A'
  },
  {
    questionOrder: 7,
    questionText: 'Q7. I help you find information by taking you from one web page to another. What am I?Answer:',
    optionA: 'Hyperlink / URL',
    optionB: 'Router',
    optionC: 'Printer',
    optionD: 'Power Cable',
    correctOption: 'A'
  },
  {
    questionOrder: 8,
    questionText: 'Q8. I am an event where students compete in coding and innovation. What am I?Answer:',
    optionA: 'Hackathon / Tech Fest',
    optionB: 'Annual Sports Day',
    optionC: 'Class Lecture',
    optionD: 'Canteen Break',
    correctOption: 'A'
  },
  {
    questionOrder: 9,
    questionText: 'Q9. I wake you up but never sleep myself. What am I?Answer:',
    optionA: 'Alarm Clock',
    optionB: 'Pillow',
    optionC: 'Bed',
    optionD: 'Blanket',
    correctOption: 'A'
  },
  {
    questionOrder: 10,
    questionText: 'Q10. I have branches but no leaves, and I can represent generations. What am I?Answer:',
    optionA: 'Family Tree',
    optionB: 'Pine Tree',
    optionC: 'River Bank',
    optionD: 'Bank Branch',
    correctOption: 'A'
  },
  {
    questionOrder: 11,
    questionText: 'Q11. I have no voice, but I can return your exact sound. What am I?Answer:',
    optionA: 'Echo',
    optionB: 'Mirror',
    optionC: 'Shadow',
    optionD: 'Wind',
    correctOption: 'A'
  },
  {
    questionOrder: 12,
    questionText: 'Q12. I can disappear when spoken aloud. What am I?Answer:',
    optionA: 'Silence',
    optionB: 'Secret',
    optionC: 'Darkness',
    optionD: 'Whisper',
    correctOption: 'A'
  },
  {
    questionOrder: 13,
    questionText: 'Q13. I am always running, yet I never get tired or move from my place. What am I?Answer:',
    optionA: 'River / Tap Water / Clock',
    optionB: 'Athlete',
    optionC: 'Car Engine',
    optionD: 'Windmill',
    correctOption: 'A'
  },
  {
    questionOrder: 14,
    questionText: 'Q14. I have a bed but never sleep and a mouth but never eat. What am I?Answer:',
    optionA: 'River',
    optionB: 'Human',
    optionC: 'Cave',
    optionD: 'Mountain',
    correctOption: 'A'
  },
  {
    questionOrder: 15,
    questionText: 'Q15. I am filled with words but cannot speak until someone opens me. What am I?Answer:',
    optionA: 'Book',
    optionB: 'Box',
    optionC: 'Door',
    optionD: 'Envelope',
    correctOption: 'A'
  },
  {
    questionOrder: 16,
    questionText: 'Q16. A man gives one child 10 cents and another 15 cents. What time is it?Answer:',
    optionA: 'Quarter to two',
    optionB: '10:15 AM',
    optionC: '12:00 PM',
    optionD: '3:00 PM',
    correctOption: 'A'
  },
  {
    questionOrder: 17,
    questionText: 'Q17. A plane crashes on an international border. Where should the survivors be buried?Answer:',
    optionA: 'Nowhere',
    optionB: 'In the country of origin',
    optionC: 'On the border line',
    optionD: 'In the crash country',
    correctOption: 'A'
  },
  {
    questionOrder: 18,
    questionText: 'Q18. A doctor gives you three tablets and says to take one every 30 minutes. How long do they last?Answer:',
    optionA: '60 minutes',
    optionB: '90 minutes',
    optionC: '30 minutes',
    optionD: '120 minutes',
    correctOption: 'A'
  },
  {
    questionOrder: 19,
    questionText: 'Q19. I become smaller when you discuss me and larger when you constantly feed me. What am I?Answer:',
    optionA: 'Problem / Fear',
    optionB: 'Fire',
    optionC: 'Pet',
    optionD: 'Plant',
    correctOption: 'A'
  },
  {
    questionOrder: 20,
    questionText: 'Q20. I have no body, but I can cause an entire crowd to move. What am I?Answer:',
    optionA: 'Music / Siren / Alarm',
    optionB: 'Building',
    optionC: 'Statue',
    optionD: 'Tree',
    correctOption: 'A'
  },
  {
    questionOrder: 21,
    questionText: 'Q21. I can exist in the past but influence every decision you make today. What am I?Answer:',
    optionA: 'Experience / Memory',
    optionB: 'Tomorrow',
    optionC: 'Weather',
    optionD: 'Shadow',
    correctOption: 'A'
  },
  {
    questionOrder: 22,
    questionText: 'Q22. What has many needles but cannot sew?Answer:',
    optionA: 'Pine Tree / Cactus',
    optionB: 'Tailor',
    optionC: 'Sewing Machine',
    optionD: 'Thread Spool',
    correctOption: 'A'
  },
  {
    questionOrder: 23,
    questionText: 'Q23. What can go up a chimney down but cannot go down a chimney up?Answer:',
    optionA: 'An Umbrella',
    optionB: 'Santa Claus',
    optionC: 'Smoke',
    optionD: 'Fire',
    correctOption: 'A'
  },
  {
    questionOrder: 24,
    questionText: 'Q24. A person has 10 socks: five black and five white. How many must they pick in darkness to guarantee a matching pair?Answer:',
    optionA: '3 socks',
    optionB: '5 socks',
    optionC: '2 socks',
    optionD: '6 socks',
    correctOption: 'A'
  },
  {
    questionOrder: 25,
    questionText: 'Q25. What is the smallest positive integer?Answer:',
    optionA: '1',
    optionB: '0',
    optionC: '-1',
    optionD: '2',
    correctOption: 'A'
  },
  {
    questionOrder: 26,
    questionText: 'Q26. How many degrees are in a right angle?Answer:',
    optionA: '90 degrees',
    optionB: '180 degrees',
    optionC: '45 degrees',
    optionD: '360 degrees',
    correctOption: 'A'
  },
  {
    questionOrder: 27,
    questionText: 'Q27. What is the sum of the first five natural numbers?Answer:',
    optionA: '15',
    optionB: '10',
    optionC: '20',
    optionD: '25',
    correctOption: 'A'
  },
  {
    questionOrder: 28,
    questionText: 'Q28. What is the smallest prime number?Answer:',
    optionA: '2',
    optionB: '1',
    optionC: '3',
    optionD: '0',
    correctOption: 'A'
  },
  {
    questionOrder: 29,
    questionText: 'Q29. Find the value of 2⁵.Answer:',
    optionA: '32',
    optionB: '10',
    optionC: '16',
    optionD: '64',
    correctOption: 'A'
  },
  {
    questionOrder: 30,
    questionText: 'Q30. What is the sum of the interior angles of a triangle?Answer:',
    optionA: '180 degrees',
    optionB: '360 degrees',
    optionC: '90 degrees',
    optionD: '270 degrees',
    correctOption: 'A'
  }
];

async function importCreativeRiddlesBTech2ndYearSet1() {
  const transaction = await sequelize.transaction();
  try {
    const round = await QuizRound.findByPk(TARGET_ROUND_ID, { transaction });
    if (!round) {
      throw new Error(`Target round not found: ${TARGET_ROUND_ID}`);
    }

    console.log(`Target Round Found: "${round.title}" (ID: ${round.id})`);
    console.log(`Current Status: ${round.status}`);

    const existingCount = await Question.count({ where: { roundId: round.id }, transaction });
    console.log(`Existing Question Count in B.Tech 2nd Year SET 1: ${existingCount}`);

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
    console.log(`Final Question Count for Creative Riddles B.Tech 2nd Year SET 1: ${finalCount}`);

  } catch (err) {
    await transaction.rollback();
    console.error('❌ Import failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

importCreativeRiddlesBTech2ndYearSet1();
