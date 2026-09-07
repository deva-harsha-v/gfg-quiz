require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const TARGET_ROUND_ID = 'e7b13da9-4bc1-42a0-9b14-a9aab5cce381';

const questionsData = [
  {
    questionOrder: 1,
    questionText: 'Q1. 📚 + ✍️ + 🎓 → ?Answer:',
    optionA: 'Degree Graduation / Academic Study',
    optionB: 'Video Gaming',
    optionC: 'Shopping',
    optionD: 'Cooking',
    correctOption: 'A'
  },
  {
    questionOrder: 2,
    questionText: 'Q2. 🚌 + ⏰ + 🏫 → ?Answer:',
    optionA: 'College Bus Schedule / Morning Bus',
    optionB: 'Railway Station',
    optionC: 'Flight Departure',
    optionD: 'Traffic Signal',
    correctOption: 'A'
  },
  {
    questionOrder: 3,
    questionText: 'Q3. 🧑‍💻 + ☕ + 🌙 → ?Answer:',
    optionA: 'Late Night Coding / Night Shift',
    optionB: 'Morning Exercise',
    optionC: 'Shopping',
    optionD: 'Sports Day',
    correctOption: 'A'
  },
  {
    questionOrder: 4,
    questionText: 'Q4. 🚗 + 🚗 + 🚗 + 🛑 → ?Answer:',
    optionA: 'Traffic Jam / Red Light Stop',
    optionB: 'Car Race',
    optionC: 'Parking Lot',
    optionD: 'Car Wash',
    correctOption: 'A'
  },
  {
    questionOrder: 5,
    questionText: 'Q5. ⚗️ + 🧪 + 💥 → ?Answer:',
    optionA: 'Chemical Reaction / Lab Explosion',
    optionB: 'Cooking Recipe',
    optionC: 'Music Studio',
    optionD: 'Painting Class',
    correctOption: 'A'
  },
  {
    questionOrder: 6,
    questionText: 'Q6. 🔊 + 🧱 + 🔇 → ?Answer:',
    optionA: 'Soundproofing / Acoustic Barrier',
    optionB: 'Loudspeaker',
    optionC: 'Microphone',
    optionD: 'Radio Station',
    correctOption: 'A'
  },
  {
    questionOrder: 7,
    questionText: 'Q7. I get wetter the more I dry. What am I?Answer:',
    optionA: 'Towel',
    optionB: 'Sponge',
    optionC: 'Cloud',
    optionD: 'Raincoat',
    correctOption: 'A'
  },
  {
    questionOrder: 8,
    questionText: 'Q8. I store information in an organized form for applications to use. What am I?Aswer:',
    optionA: 'Database',
    optionB: 'CPU',
    optionC: 'Monitor',
    optionD: 'Keyboard',
    correctOption: 'A'
  },
  {
    questionOrder: 9,
    questionText: 'Q9. I can capture a moment forever with a single click. What am I?Answer:',
    optionA: 'Camera / Photo',
    optionB: 'Mirror',
    optionC: 'Window',
    optionD: 'Clock',
    correctOption: 'A'
  },
  {
    questionOrder: 10,
    questionText: 'Q10. The more you use me properly, the sharper I become. What am I?Answer:',
    optionA: 'Brain / Mind',
    optionB: 'Pencil',
    optionC: 'Scissors',
    optionD: 'Razor',
    correctOption: 'A'
  },
  {
    questionOrder: 11,
    questionText: 'Q11. I can be copied endlessly without becoming smaller. What am I?Answer:',
    optionA: 'Digital File / Information',
    optionB: 'Paper Book',
    optionC: 'Coin',
    optionD: 'Bread',
    correctOption: 'A'
  },
  {
    questionOrder: 12,
    questionText: 'Q12. I separate white light into different visible colors. What am I?Answer:',
    optionA: 'Prism',
    optionB: 'Mirror',
    optionC: 'Lens',
    optionD: 'Window',
    correctOption: 'A'
  },
  {
    questionOrder: 13,
    questionText: 'Q13. The more you remove from me, the larger I become. What am I?Answer:',
    optionA: 'Hole',
    optionB: 'Shadow',
    optionC: 'Pit',
    optionD: 'Secret',
    correctOption: 'A'
  },
  {
    questionOrder: 14,
    questionText: 'Q14. I become shorter while helping you see in darkness. What am I?Answer:',
    optionA: 'Candle',
    optionB: 'Flashlight',
    optionC: 'Matchstick',
    optionD: 'Bulb',
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
    questionText: "Q16. A person says, “I have no brothers or sisters, but that man's father is my father's son.” Who is the man?Answer:",
    optionA: 'His son',
    optionB: 'His father',
    optionC: 'Himself',
    optionD: 'His nephew',
    correctOption: 'A'
  },
  {
    questionOrder: 17,
    questionText: 'Q17. I have roots that nobody sees, and I grow taller without ever walking. What am I?Answer:',
    optionA: 'Mountain / Tree',
    optionB: 'Building',
    optionC: 'Tower',
    optionD: 'Ladder',
    correctOption: 'A'
  },
  {
    questionOrder: 18,
    questionText: 'Q18. Forward I am heavy, but backward I am not. What am I?Answer:',
    optionA: 'The word "TON"',
    optionB: 'Anchor',
    optionC: 'Truck',
    optionD: 'Stone',
    correctOption: 'A'
  },
  {
    questionOrder: 19,
    questionText: 'Q19. I am born in a second but can remain forever. What am I?Answer:',
    optionA: 'Memory',
    optionB: 'Spark',
    optionC: 'Bubble',
    optionD: 'Flash',
    correctOption: 'A'
  },
  {
    questionOrder: 20,
    questionText: "Q20. I am lighter than air but can weigh heavily on a person's conscience. What am I?Answer:",
    optionA: 'Lie / Secret / Guilt',
    optionB: 'Feather',
    optionC: 'Cloud',
    optionD: 'Smoke',
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
    questionText: 'Q22. A train travels east while smoke blows west. Which direction does the smoke go if the train is electric?Answer:',
    optionA: 'There is no smoke',
    optionB: 'West',
    optionC: 'East',
    optionD: 'North',
    correctOption: 'A'
  },
  {
    questionOrder: 23,
    questionText: 'Q23. You have two coins totaling 30, and one is not a 10-coin. What are they?Answer:',
    optionA: 'A 20-coin and a 10-coin',
    optionB: 'Two 15-coins',
    optionC: 'Three 10-coins',
    optionD: 'Impossible',
    correctOption: 'A'
  },
  {
    questionOrder: 24,
    questionText: 'Q24. How can a person go eight days without sleep?Answer:',
    optionA: 'By sleeping at night',
    optionB: 'Drinking coffee',
    optionC: 'Taking energy drinks',
    optionD: 'Meditation',
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
    optionA: 'The word "and"',
    optionB: 'Number 4',
    optionC: 'Number 0',
    optionD: 'Number 5',
    correctOption: 'A'
  },
  {
    questionOrder: 27,
    questionText: 'Q27. If a clock shows 6:00, what angle do the hands form?Answer: 180 degrees',
    optionA: '180 degrees',
    optionB: '90 degrees',
    optionC: '0 degrees',
    optionD: '360 degrees',
    correctOption: 'A'
  },
  {
    questionOrder: 28,
    questionText: 'Q28. How many times can you subtract 10 from 100?Answer: Once',
    optionA: 'Once',
    optionB: '10 times',
    optionC: '9 times',
    optionD: 'Infinite',
    correctOption: 'A'
  },
  {
    questionOrder: 29,
    questionText: 'Q29. If five machines make five products in five minutes, how long would 100 machines take to make 100 products?Answer: Five minutes',
    optionA: 'Five minutes',
    optionB: '100 minutes',
    optionC: '500 minutes',
    optionD: '1 minute',
    correctOption: 'A'
  },
  {
    questionOrder: 30,
    questionText: 'Q30. If a rectangle has length 12 and width 5, what is its area?Answer: 60 square units',
    optionA: '60 square units',
    optionB: '34 square units',
    optionC: '17 square units',
    optionD: '120 square units',
    correctOption: 'A'
  }
];

async function importCreativeRiddlesBTech2ndYearSet3() {
  const transaction = await sequelize.transaction();
  try {
    const round = await QuizRound.findByPk(TARGET_ROUND_ID, { transaction });
    if (!round) {
      throw new Error(`Target round not found: ${TARGET_ROUND_ID}`);
    }

    console.log(`Target Round Found: "${round.title}" (ID: ${round.id})`);
    console.log(`Current Status: ${round.status}`);

    const existingCount = await Question.count({ where: { roundId: round.id }, transaction });
    console.log(`Existing Question Count in B.Tech 2nd Year SET 3: ${existingCount}`);

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
    console.log(`Final Question Count for Creative Riddles B.Tech 2nd Year SET 3: ${finalCount}`);

  } catch (err) {
    await transaction.rollback();
    console.error('❌ Import failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

importCreativeRiddlesBTech2ndYearSet3();
