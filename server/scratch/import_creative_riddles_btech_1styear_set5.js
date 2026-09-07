require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const TARGET_ROUND_ID = '22e4a2d6-3603-402e-a002-a2171c34ff01';

const questionsData = [
  {
    questionOrder: 1,
    questionText: 'Q1. 👨‍🎓 + 📚 + 🏫 → ?Answer:',
    optionA: 'College Student / Campus Library',
    optionB: 'Shopping Mall',
    optionC: 'Cinema Hall',
    optionD: 'Railway Station',
    correctOption: 'A'
  },
  {
    questionOrder: 2,
    questionText: 'Q2. 📧 + 📎 + 📤 → ?Answer:',
    optionA: 'Sending Email Attachment',
    optionB: 'Printer Jam',
    optionC: 'Hard Drive Format',
    optionD: 'Phone Call',
    correctOption: 'A'
  },
  {
    questionOrder: 3,
    questionText: 'Q3. 🎥 + 🎬 + 🍿 → ?Answer:',
    optionA: 'Movie Theater / Cinema Night',
    optionB: 'Cooking Class',
    optionC: 'Library Study',
    optionD: 'Exam Hall',
    correctOption: 'A'
  },
  {
    questionOrder: 4,
    questionText: 'Q4. 🚆 + 🎫 + 🧳 → ?Answer:',
    optionA: 'Train Journey / Travel',
    optionB: 'College Hostel',
    optionC: 'Canteen Order',
    optionD: 'Physics Lab',
    correctOption: 'A'
  },
  {
    questionOrder: 5,
    questionText: 'Q5. 🧑‍💻 + ☕ + 🌙 → ?Answer:',
    optionA: 'Late Night Coding / Night Shift',
    optionB: 'Morning Exercise',
    optionC: 'Shopping',
    optionD: 'Sports Day',
    correctOption: 'A'
  },
  {
    questionOrder: 6,
    questionText: 'Q6. 📖 + 🔍 + 💡 → ?Answer:',
    optionA: 'Research / Finding Solution',
    optionB: 'Buying Books',
    optionC: 'Painting',
    optionD: 'Dancing',
    correctOption: 'A'
  },
  {
    questionOrder: 7,
    questionText: 'Q7. I help people communicate without speaking face to face. What am I?Answer:',
    optionA: 'Messaging App / Email / Phone',
    optionB: 'Mirror',
    optionC: 'Megaphone',
    optionD: 'Table',
    correctOption: 'A'
  },
  {
    questionOrder: 8,
    questionText: 'Q8. I can hold a lot of information even though I am smaller than your hand. What am I?Answer:',
    optionA: 'MicroSD Card / Pen Drive',
    optionB: 'Book',
    optionC: 'Classroom',
    optionD: 'Backpack',
    correctOption: 'A'
  },
  {
    questionOrder: 9,
    questionText: 'Q9. I appear after rain and reflect the sunlight in many colors. What am I?Answer:',
    optionA: 'Rainbow',
    optionB: 'Cloud',
    optionC: 'Lightning',
    optionD: 'Fog',
    correctOption: 'A'
  },
  {
    questionOrder: 10,
    questionText: 'Q10. I tell you which direction to travel without moving myself. What am I?Answer:',
    optionA: 'Compass / Signpost',
    optionB: 'Car',
    optionC: 'Bicycle',
    optionD: 'Pedestrian',
    correctOption: 'A'
  },
  {
    questionOrder: 11,
    questionText: 'Q11. I have a screen but I am not a television; I can fit in your pocket. What am I?Answer:',
    optionA: 'Smartphone',
    optionB: 'Desktop PC',
    optionC: 'Cinema Screen',
    optionD: 'Billboard',
    correctOption: 'A'
  },
  {
    questionOrder: 12,
    questionText: 'Q12. I protect your eyes from bright sunlight but cannot see anything myself. What am I?Answer:',
    optionA: 'Sunglasses',
    optionB: 'Window',
    optionC: 'Mirror',
    optionD: 'Curtain',
    correctOption: 'A'
  },
  {
    questionOrder: 13,
    questionText: 'Q13. I have numbers and hands but cannot write. What am I?Answer:',
    optionA: 'Clock / Watch',
    optionB: 'Calculator',
    optionC: 'Book',
    optionD: 'Pen',
    correctOption: 'A'
  },
  {
    questionOrder: 14,
    questionText: 'Q14. I can be filled with air but cannot breathe. What am I?Answer:',
    optionA: 'Balloon / Tire',
    optionB: 'Human',
    optionC: 'Dog',
    optionD: 'Tree',
    correctOption: 'A'
  },
  {
    questionOrder: 15,
    questionText: 'Q15. I have a head and a tail but no body. What am I?Answer:',
    optionA: 'Coin',
    optionB: 'Snake',
    optionC: 'Comet',
    optionD: 'Kite',
    correctOption: 'A'
  },
  {
    questionOrder: 16,
    questionText: 'Q16. I open wide every morning but never wake up. What am I?Answer:',
    optionA: 'Door / Window / Gate',
    optionB: 'Cat',
    optionC: 'Student',
    optionD: 'Bird',
    correctOption: 'A'
  },
  {
    questionOrder: 17,
    questionText: 'Q17. I am cut before I am served but never complain. What am I?Answer:',
    optionA: 'Cake / Deck of Cards',
    optionB: 'Tennis Ball',
    optionC: 'Book',
    optionD: 'Plate',
    correctOption: 'A'
  },
  {
    questionOrder: 18,
    questionText: 'Q18. I can be written, erased, and rewritten, but I never argue. What am I?Answer:',
    optionA: 'Blackboard / Whiteboard / Paper',
    optionB: 'Teacher',
    optionC: 'Student',
    optionD: 'Principal',
    correctOption: 'A'
  },
  {
    questionOrder: 19,
    questionText: 'Q19. I become useful only when acted upon. What am I?Answer:',
    optionA: 'Plan / Idea / Tool',
    optionB: 'Stone',
    optionC: 'Cloud',
    optionD: 'Dust',
    correctOption: 'A'
  },
  {
    questionOrder: 20,
    questionText: 'Q20. I can make a weak person powerful and a powerful person weak without changing their body. What am I?Answer:',
    optionA: 'Knowledge / Information / Truth',
    optionB: 'Gold',
    optionC: 'Food',
    optionD: 'Water',
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
    questionText: 'Q22. I am difficult to give honestly but easy to give carelessly. What am I?Answer:',
    optionA: 'Advice / Promise',
    optionB: 'Money',
    optionC: 'Gift',
    optionD: 'Food',
    correctOption: 'A'
  },
  {
    questionOrder: 23,
    questionText: 'Q23. I can be lost without anyone stealing it. What am I?Answer:',
    optionA: 'Time / Patience / Way',
    optionB: 'Wallet',
    optionC: 'Car',
    optionD: 'Watch',
    correctOption: 'A'
  },
  {
    questionOrder: 24,
    questionText: 'Q24. I become more valuable when fewer people understand me. What am I?Answer:',
    optionA: 'Secret / Cipher Code',
    optionB: 'News',
    optionC: 'Song',
    optionD: 'Movie',
    correctOption: 'A'
  },
  {
    questionOrder: 25,
    questionText: 'Q25. If a clock shows 6:00, what angle do the hands form?Answer:',
    optionA: '180 degrees',
    optionB: '90 degrees',
    optionC: '0 degrees',
    optionD: '360 degrees',
    correctOption: 'A'
  },
  {
    questionOrder: 26,
    questionText: 'Q26. A number is doubled and then reduced by 4 to get 10. What is the number?Answer:',
    optionA: '7',
    optionB: '8',
    optionC: '6',
    optionD: '5',
    correctOption: 'A'
  },
  {
    questionOrder: 27,
    questionText: 'Q27. What is the next number: 5, 10, 15, 20, __?Answer:',
    optionA: '25',
    optionB: '30',
    optionC: '22',
    optionD: '24',
    correctOption: 'A'
  },
  {
    questionOrder: 28,
    questionText: 'Q28. If 50% of a number is 20, what is the number?Answer:',
    optionA: '40',
    optionB: '30',
    optionC: '50',
    optionD: '60',
    correctOption: 'A'
  },
  {
    questionOrder: 29,
    questionText: 'Q29. How many minutes are there in two and a half hours?Answer:',
    optionA: '150 minutes',
    optionB: '120 minutes',
    optionC: '180 minutes',
    optionD: '90 minutes',
    correctOption: 'A'
  },
  {
    questionOrder: 30,
    questionText: 'Q30. What is the value of 3²?Answer:',
    optionA: '9',
    optionB: '6',
    optionC: '3',
    optionD: '12',
    correctOption: 'A'
  }
];

async function importCreativeRiddlesBTech1stYearSet5() {
  const transaction = await sequelize.transaction();
  try {
    const round = await QuizRound.findByPk(TARGET_ROUND_ID, { transaction });
    if (!round) {
      throw new Error(`Target round not found: ${TARGET_ROUND_ID}`);
    }

    console.log(`Target Round Found: "${round.title}" (ID: ${round.id})`);
    console.log(`Current Status: ${round.status}`);

    const existingCount = await Question.count({ where: { roundId: round.id }, transaction });
    console.log(`Existing Question Count in B.Tech 1st Year SET 5: ${existingCount}`);

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
    console.log(`Final Question Count for Creative Riddles B.Tech 1st Year SET 5: ${finalCount}`);

  } catch (err) {
    await transaction.rollback();
    console.error('❌ Import failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

importCreativeRiddlesBTech1stYearSet5();
