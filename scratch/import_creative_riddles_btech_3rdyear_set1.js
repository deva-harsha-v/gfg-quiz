require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const TARGET_ROUND_ID = 'f2828f04-39b8-4fc5-b35e-e282c171c3d0';

const questionsData = [
  {
    questionOrder: 1,
    questionText: 'Q1. 📚 + ✍️ + 🎓 → ?Answer:',
    optionA: 'Graduation / Academic Success',
    optionB: 'Library Card',
    optionC: 'Homework Assignment',
    optionD: 'Book Club',
    correctOption: 'A'
  },
  {
    questionOrder: 2,
    questionText: 'Q2. 🌍 + 🔥 + 🌡️ → ?Answer:',
    optionA: 'Global Warming / Climate Change',
    optionB: 'Volcanic Eruption',
    optionC: 'Solar Flare',
    optionD: 'Summer Vacation',
    correctOption: 'A'
  },
  {
    questionOrder: 3,
    questionText: 'Q3. 🌍 + 🌡️ + 🔥 + 🌪️ → ?Answer:',
    optionA: 'Climate Crisis / Extreme Weather',
    optionB: 'Earthquake',
    optionC: 'Tsunami',
    optionD: 'Sandstorm',
    correctOption: 'A'
  },
  {
    questionOrder: 4,
    questionText: 'Q4. 🌪️ + ☁️ + ⚡ → ?Answer:',
    optionA: 'Thunderstorm / Severe Storm',
    optionB: 'Tornado Warning',
    optionC: 'Light Rain',
    optionD: 'Sunny Day',
    correctOption: 'A'
  },
  {
    questionOrder: 5,
    questionText: 'Q5. 🔬 + ⚛️ + 💥 → ?Answer:',
    optionA: 'Nuclear Fission / Particle Physics Reaction',
    optionB: 'Chemical Synthesis',
    optionC: 'Solar Power',
    optionD: 'Wind Energy',
    correctOption: 'A'
  },
  {
    questionOrder: 6,
    questionText: 'Q6. 🛰️ + 🌍 + 📍 → ?Answer:',
    optionA: 'GPS / Navigation Satellite',
    optionB: 'Weather Forecast',
    optionC: 'Radio Transmission',
    optionD: 'Deep Space Probe',
    correctOption: 'A'
  },
  {
    questionOrder: 7,
    questionText: 'Q7. I follow you in sunlight but disappear in darkness. What am I?Answer:',
    optionA: 'Your shadow',
    optionB: 'Your reflection',
    optionC: 'Your voice',
    optionD: 'Your breath',
    correctOption: 'A'
  },
  {
    questionOrder: 8,
    questionText: 'Q8. I have cities, roads, and rivers but no real people or vehicles. What am I?Answer:',
    optionA: 'A map',
    optionB: 'A painting',
    optionC: 'A globe',
    optionD: 'A photograph',
    correctOption: 'A'
  },
  {
    questionOrder: 9,
    questionText: 'Q9. I am lighter than a feather, yet nobody can hold me for very long. What am I?Answer:',
    optionA: 'Your breath',
    optionB: 'A bubble',
    optionC: 'A cloud',
    optionD: 'Smoke',
    correctOption: 'A'
  },
  {
    questionOrder: 10,
    questionText: 'Q10. I am not alive, but I grow. Water can destroy me. What am I?Answer:',
    optionA: 'Fire',
    optionB: 'Plant',
    optionC: 'Mold',
    optionD: 'Salt',
    correctOption: 'A'
  },
  {
    questionOrder: 11,
    questionText: 'Q11. I can bend the apparent path of light without physically bending the object. What am I?Answer:',
    optionA: 'A lens / Prism',
    optionB: 'A mirror',
    optionC: 'A magnet',
    optionD: 'A laser',
    correctOption: 'A'
  },
  {
    questionOrder: 12,
    questionText: 'Q12. I have branches but no leaves, and I can represent generations. What am I?Answer:',
    optionA: 'A family tree',
    optionB: 'A river',
    optionC: 'A bank branch',
    optionD: 'A lightning bolt',
    correctOption: 'A'
  },
  {
    questionOrder: 13,
    questionText: 'Q13. I can be opened without a key and closed without a door. What am I?Answer:',
    optionA: 'Your eyes / Mind',
    optionB: 'A safe',
    optionC: 'A box',
    optionD: 'A drawer',
    correctOption: 'A'
  },
  {
    questionOrder: 14,
    questionText: 'Q14. I fit inside your pocket but can contain books, music, and videos. What am I?Answer:',
    optionA: 'A smartphone',
    optionB: 'A wallet',
    optionC: 'A notepad',
    optionD: 'A key ring',
    correctOption: 'A'
  },
  {
    questionOrder: 15,
    questionText: 'Q15. I am taken from the earth and enclosed in wood, but people use me to write. What am I?Answer:',
    optionA: 'Pencil lead / Graphite',
    optionB: 'Chalk',
    optionC: 'Ink',
    optionD: 'Charcoal',
    correctOption: 'A'
  },
  {
    questionOrder: 16,
    questionText: 'Q16. A one-story house has everything painted blue. What color are its stairs?Answer:',
    optionA: 'There are no stairs (one-story house)',
    optionB: 'Blue',
    optionC: 'White',
    optionD: 'Transparent',
    correctOption: 'A'
  },
  {
    questionOrder: 17,
    questionText: 'Q17. I have a thumb and four fingers but no bones. What am I?Answer:',
    optionA: 'A glove',
    optionB: 'A mitten',
    optionC: 'A hand print',
    optionD: 'A robot hand',
    correctOption: 'A'
  },
  {
    questionOrder: 18,
    questionText: 'Q18. If you have me, you may want to share me; once shared, I am no longer yours alone. What am I?Answer:',
    optionA: 'A secret',
    optionB: 'A gift',
    optionC: 'A story',
    optionD: 'A photograph',
    correctOption: 'A'
  },
  {
    questionOrder: 19,
    questionText: 'Q19. I can be given, kept, broken, and fulfilled. What am I?Answer:',
    optionA: 'A promise',
    optionB: 'A rule',
    optionC: 'A heart',
    optionD: 'A vow',
    correctOption: 'A'
  },
  {
    questionOrder: 20,
    questionText: 'Q20. I am born in a second but can remain forever. What am I?Answer:',
    optionA: 'A memory',
    optionB: 'A thought',
    optionC: 'A photo',
    optionD: 'A dream',
    correctOption: 'A'
  },
  {
    questionOrder: 21,
    questionText: 'Q21. You are in a dark room with a candle, stove, and lamp. You have one match. What do you light first?Answer:',
    optionA: 'The match',
    optionB: 'The candle',
    optionC: 'The stove',
    optionD: 'The lamp',
    correctOption: 'A'
  },
  {
    questionOrder: 22,
    questionText: 'Q22. Before Mount Everest was discovered, what was the highest mountain in the world?Answer:',
    optionA: 'Mount Everest',
    optionB: 'K2',
    optionC: 'Kangchenjunga',
    optionD: 'Mount Kilimanjaro',
    correctOption: 'A'
  },
  {
    questionOrder: 23,
    questionText: 'Q23. If yesterday was tomorrow, today would be Friday. What day is today?Answer:',
    optionA: 'Sunday',
    optionB: 'Wednesday',
    optionC: 'Saturday',
    optionD: 'Thursday',
    correctOption: 'A'
  },
  {
    questionOrder: 24,
    questionText: 'Q24. Which weighs more: one kilogram of iron or one kilogram of cotton?Answer:',
    optionA: 'They weigh the same',
    optionB: 'One kilogram of iron',
    optionC: 'One kilogram of cotton',
    optionD: 'It depends on temperature',
    correctOption: 'A'
  },
  {
    questionOrder: 25,
    questionText: 'Q25. If you divide 10 by one-half, what is the result?Answer:',
    optionA: '20',
    optionB: '5',
    optionC: '10',
    optionD: '15',
    correctOption: 'A'
  },
  {
    questionOrder: 26,
    questionText: 'Q26. A dozen equals how many items?Answer:',
    optionA: '12',
    optionB: '6',
    optionC: '10',
    optionD: '24',
    correctOption: 'A'
  },
  {
    questionOrder: 27,
    questionText: 'Q27. If x + 7 = 19, what is x?Answer:',
    optionA: '12',
    optionB: '10',
    optionC: '14',
    optionD: '7',
    correctOption: 'A'
  },
  {
    questionOrder: 28,
    questionText: 'Q28. What is the sum of the interior angles of a triangle?Answer:',
    optionA: '180°',
    optionB: '360°',
    optionC: '90°',
    optionD: '270°',
    correctOption: 'A'
  },
  {
    questionOrder: 29,
    questionText: 'Q29. If a cube has an edge length of 3 units, what is its volume?Answer:',
    optionA: '27 cubic units',
    optionB: '9 cubic units',
    optionC: '18 cubic units',
    optionD: '54 cubic units',
    correctOption: 'A'
  },
  {
    questionOrder: 30,
    questionText: 'Q30. A father is four times as old as his son. Their total age is 50 years. How old is the son?Answer:',
    optionA: '10 years',
    optionB: '12 years',
    optionC: '15 years',
    optionD: '8 years',
    correctOption: 'A'
  }
];

async function importQuestions() {
  const transaction = await sequelize.transaction();
  try {
    console.log('=== IMPORTING QUESTIONS FOR CREATIVE RIDDLES B.TECH 3RD YEAR SET 1 ===\n');

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
    console.log(`Final Question Count for SET 1: ${finalCount}`);
  } catch (error) {
    await transaction.rollback();
    console.error('Import failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

importQuestions();
