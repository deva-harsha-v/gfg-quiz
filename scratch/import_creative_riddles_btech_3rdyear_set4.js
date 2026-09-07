require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const TARGET_ROUND_ID = '454fd194-5034-4a0f-935a-813257aea462';

const questionsData = [
  {
    questionOrder: 1,
    questionText: 'Q1. 🎓 + 🪪 + 🏫 → ?Answer:',
    optionA: 'Student Identity Card / School Admission',
    optionB: 'Library Card',
    optionC: 'Graduation Ceremony',
    optionD: 'Report Card',
    correctOption: 'A'
  },
  {
    questionOrder: 2,
    questionText: 'Q2. ♻️ + ⚡ + 🌱 → ?Answer:',
    optionA: 'Renewable Energy / Green Energy',
    optionB: 'Electric Vehicle',
    optionC: 'Plant Fertilizer',
    optionD: 'Solar Eclipse',
    correctOption: 'A'
  },
  {
    questionOrder: 3,
    questionText: 'Q3. 👁️ + 🌀 + 🤔 → ?Answer:',
    optionA: 'Optical Illusion / Confusion',
    optionB: 'Eye Test',
    optionC: 'Meditation',
    optionD: 'Hypnosis',
    correctOption: 'A'
  },
  {
    questionOrder: 4,
    questionText: 'Q4. 🔺 + 🌈 + 💡 → ?Answer:',
    optionA: 'Light Prism Dispersion / Spectrum',
    optionB: 'Rainbow Formation',
    optionC: 'Laser Beam',
    optionD: 'Traffic Signal',
    correctOption: 'A'
  },
  {
    questionOrder: 5,
    questionText: 'Q5. ⚙️ + 🔋 + ♾️ → ?Answer:',
    optionA: 'Perpetual Motion Machine / Infinite Power',
    optionB: 'Battery Charger',
    optionC: 'Solar Panel',
    optionD: 'Wind Turbine',
    correctOption: 'A'
  },
  {
    questionOrder: 6,
    questionText: 'Q6. 🔊 + 🧱 + 🔇 → ?Answer:',
    optionA: 'Soundproofing / Acoustic Insulation',
    optionB: 'Speaker System',
    optionC: 'Construction Site Noise',
    optionD: 'Headphones',
    correctOption: 'A'
  },
  {
    questionOrder: 7,
    questionText: 'Q7. I can capture a moment forever with a single click. What am I?Answer:',
    optionA: 'A camera / Photograph',
    optionB: 'A mouse',
    optionC: 'A clock',
    optionD: 'A mirror',
    correctOption: 'A'
  },
  {
    questionOrder: 8,
    questionText: 'Q8. I can contain thousands of books but fit inside a small device. What am I?Answer:',
    optionA: 'An E-reader / Digital library',
    optionB: 'A bookshelf',
    optionC: 'A notebook',
    optionD: 'A newspaper',
    correctOption: 'A'
  },
  {
    questionOrder: 9,
    questionText: 'Q9. I can be earned slowly and lost in a moment, yet I cannot be physically held. What am I?Answer:',
    optionA: 'Trust / Reputation',
    optionB: 'Money',
    optionC: 'A trophy',
    optionD: 'Gold',
    correctOption: 'A'
  },
  {
    questionOrder: 10,
    questionText: 'Q10. I can fill an entire room while occupying no physical space. What am I?Answer:',
    optionA: 'Light / Sound',
    optionB: 'Furniture',
    optionC: 'Air',
    optionD: 'Dust',
    correctOption: 'A'
  },
  {
    questionOrder: 11,
    questionText: 'Q11. I can be kept only by first giving me. What am I?Answer:',
    optionA: 'Your word / A promise',
    optionB: 'A gift',
    optionC: 'Money',
    optionD: 'A book',
    correctOption: 'A'
  },
  {
    questionOrder: 12,
    questionText: 'Q12. I decide which path a program follows based on a true-or-false result. What am I?Answer:',
    optionA: 'A conditional statement / If-Else',
    optionB: 'A loop',
    optionC: 'A variable',
    optionD: 'A compiler',
    correctOption: 'A'
  },
  {
    questionOrder: 13,
    questionText: 'Q13. I have a head and a tail but no body. What am I?Answer:',
    optionA: 'A coin',
    optionB: 'A snake',
    optionC: 'A kite',
    optionD: 'A fish',
    correctOption: 'A'
  },
  {
    questionOrder: 14,
    questionText: 'Q14. I can be written, erased, and rewritten, but I never argue. What am I?Answer:',
    optionA: 'Code / Text editor / Blackboard',
    optionB: 'A person',
    optionC: 'A debate',
    optionD: 'An argument',
    correctOption: 'A'
  },
  {
    questionOrder: 15,
    questionText: 'Q15. I am made of tiny drops and can hide an entire mountain. The wind moves me, and the sun removes me. What am I?Answer:',
    optionA: 'Fog / Mist',
    optionB: 'Rain',
    optionC: 'Snow',
    optionD: 'Cloud',
    correctOption: 'A'
  },
  {
    questionOrder: 16,
    questionText: 'Q16. I can be caught but never thrown, and I can spread silently from person to person. What am I?Answer:',
    optionA: 'A cold / Yawn',
    optionB: 'A ball',
    optionC: 'A frisbee',
    optionD: 'A stone',
    correctOption: 'A'
  },
  {
    questionOrder: 17,
    questionText: 'Q17. Forward I am heavy, but backward I am not. What am I?Answer:',
    optionA: 'The word "Ton" ("not" backward)',
    optionB: 'A rock',
    optionC: 'A truck',
    optionD: 'An elephant',
    correctOption: 'A'
  },
  {
    questionOrder: 18,
    questionText: 'Q18. The more steps you take, the more of me you leave behind. What am I?Answer:',
    optionA: 'Footsteps',
    optionB: 'Time',
    optionC: 'Shadows',
    optionD: 'Dust',
    correctOption: 'A'
  },
  {
    questionOrder: 19,
    questionText: 'Q19. I become stronger when I am shared between people. What am I?Answer:',
    optionA: 'Unity / Friendship / Connection',
    optionB: 'Secret',
    optionC: 'Food',
    optionD: 'Money',
    correctOption: 'A'
  },
  {
    questionOrder: 20,
    questionText: 'Q20. I grow stronger whenever I successfully face difficulty. What am I?Answer:',
    optionA: 'Resilience / Character',
    optionB: 'Fear',
    optionC: 'Doubt',
    optionD: 'Weakness',
    correctOption: 'A'
  },
  {
    questionOrder: 21,
    questionText: 'Q21. Before Mount Everest was discovered, what was the highest mountain in the world?Answer:',
    optionA: 'Mount Everest',
    optionB: 'K2',
    optionC: 'Kangchenjunga',
    optionD: 'Mount Fuji',
    correctOption: 'A'
  },
  {
    questionOrder: 22,
    questionText: 'Q22. A person falls from a 20-foot ladder without injury. How?Answer:',
    optionA: 'They fell off the bottom rung',
    optionB: 'They wore a helmet',
    optionC: 'They landed on a cushion',
    optionD: 'They were suspended by a harness',
    correctOption: 'A'
  },
  {
    questionOrder: 23,
    questionText: 'Q23. What question can you never answer “yes” to truthfully?Answer:',
    optionA: '"Are you asleep yet?"',
    optionB: '"What is your name?"',
    optionC: '"Are you awake?"',
    optionD: '"Do you speak English?"',
    correctOption: 'A'
  },
  {
    questionOrder: 24,
    questionText: 'Q24. What can be increased without adding anything?Answer:',
    optionA: 'Distance / Space / A hole',
    optionB: 'Water',
    optionC: 'Weight',
    optionD: 'Height',
    correctOption: 'A'
  },
  {
    questionOrder: 25,
    questionText: 'Q25. A number multiplied by itself equals twice the number. What positive number is it?Answer:',
    optionA: '2',
    optionB: '1',
    optionC: '4',
    optionD: '0',
    correctOption: 'A'
  },
  {
    questionOrder: 26,
    questionText: 'Q26. How many sides does a circle have?Answer:',
    optionA: 'Two (inside and outside) / Zero straight sides',
    optionB: 'One',
    optionC: 'Four',
    optionD: 'Infinite straight sides',
    correctOption: 'A'
  },
  {
    questionOrder: 27,
    questionText: 'Q27. Ten people each shake hands once with every other person. How many handshakes occur?Answer:',
    optionA: '45',
    optionB: '90',
    optionC: '100',
    optionD: '50',
    correctOption: 'A'
  },
  {
    questionOrder: 28,
    questionText: 'Q28. What is the next number: 1, 3, 6, 10, 15, __?Answer:',
    optionA: '21',
    optionB: '20',
    optionC: '18',
    optionD: '25',
    correctOption: 'A'
  },
  {
    questionOrder: 29,
    questionText: 'Q29. What is the smallest prime number?Answer:',
    optionA: '2',
    optionB: '1',
    optionC: '3',
    optionD: '0',
    correctOption: 'A'
  },
  {
    questionOrder: 30,
    questionText: 'Q30. A car travels 240 km in 4 hours. What is its average speed?Answer: 60 km/h',
    optionA: '60 km/h',
    optionB: '50 km/h',
    optionC: '80 km/h',
    optionD: '40 km/h',
    correctOption: 'A'
  }
];

async function importQuestions() {
  const transaction = await sequelize.transaction();
  try {
    console.log('=== IMPORTING QUESTIONS FOR CREATIVE RIDDLES B.TECH 3RD YEAR SET 4 ===\n');

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
    console.log(`Final Question Count for SET 4: ${finalCount}`);
  } catch (error) {
    await transaction.rollback();
    console.error('Import failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

importQuestions();
