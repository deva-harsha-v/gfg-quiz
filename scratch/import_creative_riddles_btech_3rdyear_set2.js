require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const TARGET_ROUND_ID = 'af711d4b-e231-4fc0-be0c-49d8bbcab4d5';

const questionsData = [
  {
    questionOrder: 1,
    questionText: 'Q1. 📱 + 🔌 + ⚡ → ?Answer:',
    optionA: 'Phone Charging / Charging a Smartphone',
    optionB: 'Battery Replacement',
    optionC: 'Screen Protector Installation',
    optionD: 'Wi-Fi Connection',
    correctOption: 'A'
  },
  {
    questionOrder: 2,
    questionText: 'Q2. 📦 + 🚚 + 🏠 → ?Answer:',
    optionA: 'Package Delivery / Home Delivery',
    optionB: 'House Moving',
    optionC: 'Factory Production',
    optionD: 'Cargo Shipping',
    correctOption: 'A'
  },
  {
    questionOrder: 3,
    questionText: 'Q3. 🌋 + 🔥 + 💨 → ?Answer:',
    optionA: 'Volcanic Eruption / Volcanic Ash',
    optionB: 'Forest Fire',
    optionC: 'Solar Flare',
    optionD: 'Dust Storm',
    correctOption: 'A'
  },
  {
    questionOrder: 4,
    questionText: 'Q4. ⚗️ + 🧪 + 💥 → ?Answer:',
    optionA: 'Chemical Reaction / Laboratory Explosion',
    optionB: 'Nuclear Fusion',
    optionC: 'Fireworks Display',
    optionD: 'Cooking Experiment',
    correctOption: 'A'
  },
  {
    questionOrder: 5,
    questionText: 'Q5. 🔭 + 🌌 + ⭐ → ?Answer:',
    optionA: 'Stargazing / Astronomy Observation',
    optionB: 'Space Travel',
    optionC: 'Weather Station',
    optionD: 'Solar Power Generation',
    correctOption: 'A'
  },
  {
    questionOrder: 6,
    questionText: 'Q6. 🚀 + 🌌 + 🪐 → ?Answer:',
    optionA: 'Interplanetary Space Mission / Space Exploration',
    optionB: 'Satellite Launch',
    optionC: 'Airplane Flight',
    optionD: 'Hot Air Balloon',
    correctOption: 'A'
  },
  {
    questionOrder: 7,
    questionText: 'Q7. I store information in an organized form for applications to use. What am I?Answer:',
    optionA: 'A database',
    optionB: 'A web browser',
    optionC: 'A monitor',
    optionD: 'A printer',
    correctOption: 'A'
  },
  {
    questionOrder: 8,
    questionText: 'Q8. I help you find information by taking you from one web page to another. What am I?Answer:',
    optionA: 'A hyperlink / Search engine',
    optionB: 'A firewall',
    optionC: 'A router',
    optionD: 'A power cable',
    correctOption: 'A'
  },
  {
    questionOrder: 9,
    questionText: 'Q9. I have no voice, but I can return your exact sound. What am I?Answer:',
    optionA: 'An echo',
    optionB: 'A mirror',
    optionC: 'A shadow',
    optionD: 'A wind chime',
    correctOption: 'A'
  },
  {
    questionOrder: 10,
    questionText: 'Q10. I am always increasing, but nobody can reverse me. What am I?Answer:',
    optionA: 'Age / Time',
    optionB: 'Height',
    optionC: 'Temperature',
    optionD: 'Speed',
    correctOption: 'A'
  },
  {
    questionOrder: 11,
    questionText: 'Q11. I can unlock a door without touching it when the correct pattern is recognized. What am I?Answer:',
    optionA: 'Facial recognition / Smart lock',
    optionB: 'Mechanical key',
    optionC: 'Padlock',
    optionD: 'Door handle',
    correctOption: 'A'
  },
  {
    questionOrder: 12,
    questionText: 'Q12. I can be compressed without being physically squeezed. What am I?Answer:',
    optionA: 'Digital file / ZIP archive',
    optionB: 'Sponge',
    optionC: 'Balloon',
    optionD: 'Rubber ball',
    correctOption: 'A'
  },
  {
    questionOrder: 13,
    questionText: 'Q13. I have teeth but cannot bite food. What am I?Answer:',
    optionA: 'A comb / Saw',
    optionB: 'A dog',
    optionC: 'An alligator',
    optionD: 'A shark',
    correctOption: 'A'
  },
  {
    questionOrder: 14,
    questionText: 'Q14. I am always running, yet I never get tired or move from my place. What am I?Answer:',
    optionA: 'A river / Clock',
    optionB: 'An athlete',
    optionC: 'A car',
    optionD: 'A horse',
    correctOption: 'A'
  },
  {
    questionOrder: 15,
    questionText: 'Q15. Three switches control three bulbs in another room. You may enter the room only once. How can you identify each switch?Answer:',
    optionA: 'Turn on first switch for a while, turn off, turn on second switch, then enter (check heat & light)',
    optionB: 'Turn on all three switches at once',
    optionC: 'Turn off all three switches',
    optionD: 'Flip switches randomly while inside the room',
    correctOption: 'A'
  },
  {
    questionOrder: 16,
    questionText: 'Q16. A doctor gives you three tablets and says to take one every 30 minutes. How long do they last?Answer:',
    optionA: '60 minutes / 1 hour',
    optionB: '90 minutes',
    optionC: '30 minutes',
    optionD: '120 minutes',
    correctOption: 'A'
  },
  {
    questionOrder: 17,
    questionText: 'Q17. What can you hold in your right hand but never in your left hand?Answer:',
    optionA: 'Your left elbow / left hand',
    optionB: 'Your right elbow',
    optionC: 'A cup',
    optionD: 'A pen',
    correctOption: 'A'
  },
  {
    questionOrder: 18,
    questionText: 'Q18. A father and son are in a car accident. The father dies, and the surgeon says, “That is my son.” How?Answer:',
    optionA: 'The surgeon is his mother',
    optionB: 'The surgeon is his uncle',
    optionC: 'The surgeon is his brother',
    optionD: 'The surgeon is a stranger',
    correctOption: 'A'
  },
  {
    questionOrder: 19,
    questionText: 'Q19. I am lighter than air but can weigh heavily on a person\'s conscience. What am I?Answer:',
    optionA: 'A lie / Guilt',
    optionB: 'A feather',
    optionC: 'Smoke',
    optionD: 'Hydrogen gas',
    correctOption: 'A'
  },
  {
    questionOrder: 20,
    questionText: 'Q20. The more you share me, the more I can multiply. What am I?Answer:',
    optionA: 'Happiness / Knowledge',
    optionB: 'Money',
    optionC: 'Food',
    optionD: 'Water',
    correctOption: 'A'
  },
  {
    questionOrder: 21,
    questionText: 'Q21. If a red house is made of red bricks and a blue house is made of blue bricks, what is a greenhouse made of?Answer:',
    optionA: 'Glass',
    optionB: 'Green bricks',
    optionC: 'Wood',
    optionD: 'Plastic',
    correctOption: 'A'
  },
  {
    questionOrder: 22,
    questionText: 'Q22. A woman was born in 2000 and died in 1995. How is this possible?Answer:',
    optionA: '2000 and 1995 are BC dates',
    optionB: 'She time traveled',
    optionC: 'It was a typo',
    optionD: '2000 was her street number',
    correctOption: 'A'
  },
  {
    questionOrder: 23,
    questionText: 'Q23. What has many needles but cannot sew?Answer:',
    optionA: 'A pine tree / Cactus',
    optionB: 'A tailor',
    optionC: 'A syringe',
    optionD: 'A sewing machine',
    correctOption: 'A'
  },
  {
    questionOrder: 24,
    questionText: 'Q24. Three people check into a hotel and pay 30 units. Later, 5 units are returned. A bellboy keeps 2 units and gives 1 unit to each person. Where did the missing unit go?Answer:',
    optionA: 'There is no missing unit (25 room + 2 bellboy + 3 returned = 30)',
    optionB: 'The manager kept it',
    optionC: 'The bellboy lost it',
    optionD: 'In tax fees',
    correctOption: 'A'
  },
  {
    questionOrder: 25,
    questionText: 'Q25. How many zeros are there in one thousand?Answer:',
    optionA: '3',
    optionB: '2',
    optionC: '4',
    optionD: '1',
    correctOption: 'A'
  },
  {
    questionOrder: 26,
    questionText: 'Q26. How many sides do two triangles have altogether?Answer:',
    optionA: '6',
    optionB: '3',
    optionC: '8',
    optionD: '4',
    correctOption: 'A'
  },
  {
    questionOrder: 27,
    questionText: 'Q27. What is the smallest number divisible by every number from 1 through 10?Answer:',
    optionA: '2520',
    optionB: '1260',
    optionC: '5040',
    optionD: '360',
    correctOption: 'A'
  },
  {
    questionOrder: 28,
    questionText: 'Q28. A number leaves remainder 2 when divided by 3, remainder 3 when divided by 5, and remainder 2 when divided by 7. What is the smallest such number?Answer:',
    optionA: '23',
    optionB: '53',
    optionC: '38',
    optionD: '68',
    correctOption: 'A'
  },
  {
    questionOrder: 29,
    questionText: 'Q29. If a rectangle has length 12 and width 5, what is its area?Answer:',
    optionA: '60',
    optionB: '34',
    optionC: '17',
    optionD: '120',
    correctOption: 'A'
  },
  {
    questionOrder: 30,
    questionText: 'Q30. A number is increased by 20% and becomes 120. What was the original number?Answer:',
    optionA: '100',
    optionB: '90',
    optionC: '96',
    optionD: '110',
    correctOption: 'A'
  }
];

async function importQuestions() {
  const transaction = await sequelize.transaction();
  try {
    console.log('=== IMPORTING QUESTIONS FOR CREATIVE RIDDLES B.TECH 3RD YEAR SET 2 ===\n');

    const round = await QuizRound.findByPk(TARGET_ROUND_ID, { transaction });
    if (!round) {
      throw new Error(`Target QuizRound with ID ${TARGET_ROUND_ID} not found.`);
    }

    console.log(`Target Round Found: ${round.title} (ID: ${round.id}, Status: ${round.status})`);

    const existingQuestions = await Question.findAll({
      where: { roundId: TARGET_ROUND_ID },
      transaction
    });

    console.log(`Existing questions count in round: ${existingQuestions.length}`);

    let addedCount = 0;
    let skippedCount = 0;

    for (const q of questionsData) {
      const exists = existingQuestions.some(
        eq => eq.questionText.trim() === q.questionText.trim() || eq.questionOrder === q.questionOrder
      );

      if (exists) {
        console.log(`Skipping existing Q${q.questionOrder}`);
        skippedCount++;
      } else {
        await Question.create(
          {
            roundId: TARGET_ROUND_ID,
            questionText: q.questionText,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctOption: q.correctOption,
            questionOrder: q.questionOrder,
            marks: 1.0,
            negativeMarks: 0.0,
            isActive: true
          },
          { transaction }
        );
        addedCount++;
      }
    }

    await transaction.commit();
    console.log(`\nImport complete! Added: ${addedCount}, Skipped: ${skippedCount}`);

    const finalCount = await Question.count({ where: { roundId: TARGET_ROUND_ID } });
    console.log(`Final Question Count for SET 2: ${finalCount}`);
  } catch (error) {
    await transaction.rollback();
    console.error('Import failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

importQuestions();
