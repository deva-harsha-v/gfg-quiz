require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const TARGET_ROUND_ID = '442ce90e-8835-4f98-84f5-8c351a4facec';

const questionsData = [
  {
    questionOrder: 1,
    questionText: 'Q1. 🖨️ + 📄 + 🖱️ → ?Answer:',
    optionA: 'Desktop Printing / Print Job',
    optionB: 'Scanner',
    optionC: 'Hard Drive',
    optionD: 'Router',
    correctOption: 'A'
  },
  {
    questionOrder: 2,
    questionText: 'Q2. 📦 + 🚚 + 🏠 → ?Answer:',
    optionA: 'Parcel Delivery / Home Logistics',
    optionB: 'Warehouse',
    optionC: 'Shopping Mall',
    optionD: 'Bus Stop',
    correctOption: 'A'
  },
  {
    questionOrder: 3,
    questionText: 'Q3. 🎧 + 🔇 + 🔊 → ?Answer:',
    optionA: 'Noise Control / Audio Volume',
    optionB: 'Screen Brightness',
    optionC: 'Camera Flash',
    optionD: 'Battery Saver',
    correctOption: 'A'
  },
  {
    questionOrder: 4,
    questionText: 'Q4. 🧲 + ⚡ + 🧭 → ?Answer:',
    optionA: 'Electromagnetism / Magnetic Field Navigation',
    optionB: 'Solar Flare',
    optionC: 'Wind Turbine',
    optionD: 'Nuclear Fission',
    correctOption: 'A'
  },
  {
    questionOrder: 5,
    questionText: 'Q5. ☁️ + 🌧️ + 🌊 + ☀️ → ?Answer:',
    optionA: 'Water Cycle / Hydrological Process',
    optionB: 'Global Warming',
    optionC: 'Volcanic Eruption',
    optionD: 'Tornado',
    correctOption: 'A'
  },
  {
    questionOrder: 6,
    questionText: 'Q6. 🌱 + 💧 + ☀️ → ?Answer:',
    optionA: 'Photosynthesis / Plant Growth',
    optionB: 'Deforestation',
    optionC: 'Soil Erosion',
    optionD: 'Composting',
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
    questionText: 'Q9. I am created using HTML, CSS, and JavaScript and viewed in a browser. What am I?Answer:',
    optionA: 'Webpage / Website',
    optionB: 'Operating System',
    optionC: 'Database Server',
    optionD: 'Mobile Hardware',
    correctOption: 'A'
  },
  {
    questionOrder: 10,
    questionText: 'Q10. I have no weight, but enough of me can damage even the strongest structure. What am I?Answer:',
    optionA: 'Earthquake Vibration / Sound Wave',
    optionB: 'Feather',
    optionC: 'Cloud',
    optionD: 'Shadow',
    correctOption: 'A'
  },
  {
    questionOrder: 11,
    questionText: 'Q11. I have no physical shape, yet digital systems depend on me. What am I?Answer:',
    optionA: 'Software / Code',
    optionB: 'Keyboard',
    optionC: 'Monitor',
    optionD: 'Power Cord',
    correctOption: 'A'
  },
  {
    questionOrder: 12,
    questionText: 'Q12. I am invisible when working correctly, but everyone notices me when I stop. What am I?Answer:',
    optionA: 'Server / Electricity / Oxygen',
    optionB: 'Car Paint',
    optionC: 'Desk',
    optionD: 'Poster',
    correctOption: 'A'
  },
  {
    questionOrder: 13,
    questionText: 'Q13. I have a mouse, windows, and a desktop but no living creature inside me. What am I?Answer:',
    optionA: 'Computer',
    optionB: 'House',
    optionC: 'Office Building',
    optionD: 'Barn',
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
    optionA: 'Comb / Saw',
    optionB: 'Fork',
    optionC: 'Knife',
    optionD: 'Spoon',
    correctOption: 'A'
  },
  {
    questionOrder: 16,
    questionText: 'Q16. A student has seven candles. Two go out, while the others burn completely. How many candles remain?Answer:',
    optionA: '2',
    optionB: '5',
    optionC: '7',
    optionD: '0',
    correctOption: 'A'
  },
  {
    questionOrder: 17,
    questionText: 'Q17. I can be caught but never thrown, and I can spread silently from person to person. What am I?Answer:',
    optionA: 'Cold / Virus / Yawn',
    optionB: 'Ball',
    optionC: 'Frisbee',
    optionD: 'Pillow',
    correctOption: 'A'
  },
  {
    questionOrder: 18,
    questionText: 'Q18. A person walks into a room, shoots himself, and walks out alive. How?Answer:',
    optionA: 'He shot a photograph of himself',
    optionB: 'He used fake bullets',
    optionC: 'He missed the target',
    optionD: 'He wore armor',
    correctOption: 'A'
  },
  {
    questionOrder: 19,
    questionText: 'Q19. I can destroy relationships but fit inside a mouth. What am I?Answer:',
    optionA: 'Lie / Rumor / Tongue',
    optionB: 'Food',
    optionC: 'Water',
    optionD: 'Toothpaste',
    correctOption: 'A'
  },
  {
    questionOrder: 20,
    questionText: 'Q20. Without me, questions are rarely asked and discoveries rarely begin. What am I?Answer:',
    optionA: 'Curiosity',
    optionB: 'Paper',
    optionC: 'Pen',
    optionD: 'Book',
    correctOption: 'A'
  },
  {
    questionOrder: 21,
    questionText: 'Q21. I can imprison the mind even though I have no walls. What am I?Answer:',
    optionA: 'Fear / Obsession',
    optionB: 'Jail',
    optionC: 'Room',
    optionD: 'Box',
    correctOption: 'A'
  },
  {
    questionOrder: 22,
    questionText: 'Q22. What has an eye but cannot see and moves faster than any human?Answer:',
    optionA: 'Hurricane / Cyclone',
    optionB: 'Needle',
    optionC: 'Potato',
    optionD: 'Target',
    correctOption: 'A'
  },
  {
    questionOrder: 23,
    questionText: 'Q23. A person falls from a 20-foot ladder without injury. How?Answer:',
    optionA: 'He fell from the bottom rung',
    optionB: 'He wore a parachute',
    optionC: 'He fell onto a mattress',
    optionD: 'He caught a rope',
    correctOption: 'A'
  },
  {
    questionOrder: 24,
    questionText: 'Q24. A woman was born in 2000 and died in 1995. How is this possible?Answer:',
    optionA: 'The years were BC',
    optionB: 'She lived on a different planet',
    optionC: 'It was a hospital room number',
    optionD: 'She time traveled',
    correctOption: 'A'
  },
  {
    questionOrder: 25,
    questionText: 'Q25. I am an even number. Remove half of my shape, and I become zero. What number am I?Answer:',
    optionA: '8',
    optionB: '6',
    optionC: '4',
    optionD: '2',
    correctOption: 'A'
  },
  {
    questionOrder: 26,
    questionText: 'Q26. How many sides does a circle have?Answer:',
    optionA: '2 (inside and outside)',
    optionB: '0',
    optionC: '1',
    optionD: 'Infinite',
    correctOption: 'A'
  },
  {
    questionOrder: 27,
    questionText: 'Q27. What is half of 12 plus 6?Answer:',
    optionA: '12',
    optionB: '9',
    optionC: '6',
    optionD: '18',
    correctOption: 'A'
  },
  {
    questionOrder: 28,
    questionText: 'Q28. A number leaves remainder 2 when divided by 3, remainder 3 when divided by 5, and remainder 2 when divided by 7. What is the smallest such number?Answer:',
    optionA: '23',
    optionB: '53',
    optionC: '38',
    optionD: '17',
    correctOption: 'A'
  },
  {
    questionOrder: 29,
    questionText: 'Q29. What is the next number: 1, 3, 6, 10, 15, __?Answer:',
    optionA: '21',
    optionB: '20',
    optionC: '18',
    optionD: '25',
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

async function importCreativeRiddlesBTech2ndYearSet2() {
  const transaction = await sequelize.transaction();
  try {
    const round = await QuizRound.findByPk(TARGET_ROUND_ID, { transaction });
    if (!round) {
      throw new Error(`Target round not found: ${TARGET_ROUND_ID}`);
    }

    console.log(`Target Round Found: "${round.title}" (ID: ${round.id})`);
    console.log(`Current Status: ${round.status}`);

    const existingCount = await Question.count({ where: { roundId: round.id }, transaction });
    console.log(`Existing Question Count in B.Tech 2nd Year SET 2: ${existingCount}`);

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
    console.log(`Final Question Count for Creative Riddles B.Tech 2nd Year SET 2: ${finalCount}`);

  } catch (err) {
    await transaction.rollback();
    console.error('❌ Import failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

importCreativeRiddlesBTech2ndYearSet2();
