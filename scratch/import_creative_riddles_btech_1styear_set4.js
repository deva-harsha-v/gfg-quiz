require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const TARGET_ROUND_ID = 'f5a9d069-a97d-409a-bc1a-130788902798';

const questionsData = [
  {
    questionOrder: 1,
    questionText: 'Q1. 📱 + 🌐 + 📝 → ?Answer:',
    optionA: 'Online Exam / Web Assignment',
    optionB: 'Video Call',
    optionC: 'Camera Photo',
    optionD: 'Radio Broadcast',
    correctOption: 'A'
  },
  {
    questionOrder: 2,
    questionText: 'Q2. 📝 + 📅 + 🎓 → ?Answer:',
    optionA: 'Exam Schedule / Graduation Dates',
    optionB: 'Canteen Menu',
    optionC: 'Sports Registration',
    optionD: 'Bus Time Table',
    correctOption: 'A'
  },
  {
    questionOrder: 3,
    questionText: 'Q3. ⏰ + 🌅 + 🔔 → ?Answer:',
    optionA: 'Morning Alarm / College Bell',
    optionB: 'Night Shift',
    optionC: 'Lunch Break',
    optionD: 'Sunset',
    correctOption: 'A'
  },
  {
    questionOrder: 4,
    questionText: 'Q4. 🛒 + 💳 + 🛍️ → ?Answer:',
    optionA: 'Online Shopping / Card Payment',
    optionB: 'Bank Loan',
    optionC: 'Paper Cash',
    optionD: 'Library Fine',
    correctOption: 'A'
  },
  {
    questionOrder: 5,
    questionText: 'Q5. 🍳 + 🥘 + 🍽️ → ?Answer:',
    optionA: 'Cooking / Canteen Meal',
    optionB: 'Washing Clothes',
    optionC: 'Grocery Store',
    optionD: 'Food Delivery',
    correctOption: 'A'
  },
  {
    questionOrder: 6,
    questionText: 'Q6. 🌧️ + ☂️ + 💧 → ?Answer:',
    optionA: 'Rainy Day / Umbrella',
    optionB: 'Sunny Afternoon',
    optionC: 'Snowstorm',
    optionD: 'Desert Heat',
    correctOption: 'A'
  },
  {
    questionOrder: 7,
    questionText: 'Q7. I carry your voice across long distances without walking anywhere. What am I?Answer:',
    optionA: 'Telephone / Smartphone',
    optionB: 'Postcard',
    optionC: 'Bicycle',
    optionD: 'Mirror',
    correctOption: 'A'
  },
  {
    questionOrder: 8,
    questionText: 'Q8. I can contain thousands of books but fit inside a small device. What am I?Answer:',
    optionA: 'E-Reader / Digital Library',
    optionB: 'Paper Notebook',
    optionC: 'School Bag',
    optionD: 'Book Shelf',
    correctOption: 'A'
  },
  {
    questionOrder: 9,
    questionText: 'Q9. I wake you up but never sleep myself. What am I?Answer:',
    optionA: 'Alarm Clock',
    optionB: 'Bed',
    optionC: 'Pillow',
    optionD: 'Blanket',
    correctOption: 'A'
  },
  {
    questionOrder: 10,
    questionText: 'Q10. I can show you places without taking you there. What am I?Answer:',
    optionA: 'Map / Screen',
    optionB: 'Car',
    optionC: 'Bus',
    optionD: 'Shoes',
    correctOption: 'A'
  },
  {
    questionOrder: 11,
    questionText: 'Q11. I can travel through wires and power machines, but I cannot be seen. What am I?Answer:',
    optionA: 'Electricity / Current',
    optionB: 'Water',
    optionC: 'Oil',
    optionD: 'Gasoline',
    correctOption: 'A'
  },
  {
    questionOrder: 12,
    questionText: 'Q12. I can be typed, copied, deleted, and formatted. What am I?Answer:',
    optionA: 'Text / Digital Document',
    optionB: 'Paper',
    optionC: 'Ink',
    optionD: 'Pen',
    correctOption: 'A'
  },
  {
    questionOrder: 13,
    questionText: 'Q13. I have a bed but never sleep and a mouth but never eat. What am I?Answer:',
    optionA: 'River',
    optionB: 'Person',
    optionC: 'Cat',
    optionD: 'House',
    correctOption: 'A'
  },
  {
    questionOrder: 14,
    questionText: 'Q14. I can be broken even though nobody can touch me. What am I?Answer:',
    optionA: 'Promise / Heart / Silence',
    optionB: 'Glass',
    optionC: 'Cup',
    optionD: 'Plate',
    correctOption: 'A'
  },
  {
    questionOrder: 15,
    questionText: 'Q15. I am filled with words but cannot speak until someone opens me. What am I?Answer:',
    optionA: 'Book',
    optionB: 'Box',
    optionC: 'Door',
    optionD: 'Bag',
    correctOption: 'A'
  },
  {
    questionOrder: 16,
    questionText: 'Q16. I can show you your face but cannot remember it. What am I?Answer:',
    optionA: 'Mirror',
    optionB: 'Portrait',
    optionC: 'Camera Memory',
    optionD: 'Statue',
    correctOption: 'A'
  },
  {
    questionOrder: 17,
    questionText: 'Q17. I have legs but never walk, and I support you when you sit. What am I?Answer:',
    optionA: 'Chair / Stool',
    optionB: 'Dog',
    optionC: 'Human',
    optionD: 'Horse',
    correctOption: 'A'
  },
  {
    questionOrder: 18,
    questionText: 'Q18. I become visible only when light passes through tiny drops of water. What am I?Answer:',
    optionA: 'Rainbow',
    optionB: 'Cloud',
    optionC: 'Sunlight',
    optionD: 'Fog',
    correctOption: 'A'
  },
  {
    questionOrder: 19,
    questionText: 'Q19. I cannot be measured with a ruler, but I determine how important something is. What am I?Answer:',
    optionA: 'Value / Worth',
    optionB: 'Height',
    optionC: 'Width',
    optionD: 'Weight',
    correctOption: 'A'
  },
  {
    questionOrder: 20,
    questionText: 'Q20. I can exist only after a choice has been made. What am I?Answer:',
    optionA: 'Decision / Result',
    optionB: 'Option',
    optionC: 'Question',
    optionD: 'Menu',
    correctOption: 'A'
  },
  {
    questionOrder: 21,
    questionText: 'Q21. I increase when ignored but decrease when understood. What am I?Answer:',
    optionA: 'Confusion / Ignorance / Misunderstanding',
    optionB: 'Knowledge',
    optionC: 'Wisdom',
    optionD: 'Clarity',
    correctOption: 'A'
  },
  {
    questionOrder: 22,
    questionText: 'Q22. I am free to give but expensive to lose. What am I?Answer:',
    optionA: 'Respect / Trust / Time',
    optionB: 'Money',
    optionC: 'Gold',
    optionD: 'Property',
    correctOption: 'A'
  },
  {
    questionOrder: 23,
    questionText: 'Q23. I can open doors without touching a handle. What am I?Answer:',
    optionA: 'Keycard / Sensor / Opportunity',
    optionB: 'Padlock',
    optionC: 'Crowbar',
    optionD: 'Hammer',
    correctOption: 'A'
  },
  {
    questionOrder: 24,
    questionText: 'Q24. I can change your future without changing your past. What am I?Answer:',
    optionA: 'Education / Hard Work / Today',
    optionB: 'Yesterday',
    optionC: 'History',
    optionD: 'Memory',
    correctOption: 'A'
  },
  {
    questionOrder: 25,
    questionText: 'Q25. How many degrees are in a right angle?Answer:',
    optionA: '90 degrees',
    optionB: '180 degrees',
    optionC: '45 degrees',
    optionD: '360 degrees',
    correctOption: 'A'
  },
  {
    questionOrder: 26,
    questionText: 'Q26. What number is halfway between 20 and 30?Answer:',
    optionA: '25',
    optionB: '24',
    optionC: '26',
    optionD: '22',
    correctOption: 'A'
  },
  {
    questionOrder: 27,
    questionText: 'Q27. If 8 + 8 = 16, what is 8 × 8?Answer:',
    optionA: '64',
    optionB: '56',
    optionC: '72',
    optionD: '32',
    correctOption: 'A'
  },
  {
    questionOrder: 28,
    questionText: 'Q28. How many zeros are there in one thousand?Answer:',
    optionA: '3 zeros',
    optionB: '2 zeros',
    optionC: '4 zeros',
    optionD: '1 zero',
    correctOption: 'A'
  },
  {
    questionOrder: 29,
    questionText: 'Q29. What is the sum of the first five natural numbers?Answer:',
    optionA: '15',
    optionB: '10',
    optionC: '20',
    optionD: '25',
    correctOption: 'A'
  },
  {
    questionOrder: 30,
    questionText: 'Q30. How many sides do two triangles have altogether?Answer:',
    optionA: '6 sides',
    optionB: '4 sides',
    optionC: '8 sides',
    optionD: '5 sides',
    correctOption: 'A'
  }
];

async function importCreativeRiddlesBTech1stYearSet4() {
  const transaction = await sequelize.transaction();
  try {
    const round = await QuizRound.findByPk(TARGET_ROUND_ID, { transaction });
    if (!round) {
      throw new Error(`Target round not found: ${TARGET_ROUND_ID}`);
    }

    console.log(`Target Round Found: "${round.title}" (ID: ${round.id})`);
    console.log(`Current Status: ${round.status}`);

    const existingCount = await Question.count({ where: { roundId: round.id }, transaction });
    console.log(`Existing Question Count in B.Tech 1st Year SET 4: ${existingCount}`);

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
    console.log(`Final Question Count for Creative Riddles B.Tech 1st Year SET 4: ${finalCount}`);

  } catch (err) {
    await transaction.rollback();
    console.error('❌ Import failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

importCreativeRiddlesBTech1stYearSet4();
