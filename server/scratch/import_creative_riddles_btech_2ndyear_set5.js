require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const TARGET_ROUND_ID = 'a8b5b454-e66c-4c42-9ad8-7156fc8bfebc';

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
    questionText: 'Q2. 💻 + 📝 + 📚 → ?Answer:',
    optionA: 'Online Studying / E-Learning',
    optionB: 'Gaming Session',
    optionC: 'Video Editing',
    optionD: 'Social Media Browsing',
    correctOption: 'A'
  },
  {
    questionOrder: 3,
    questionText: 'Q3. 🌍 + 🔥 + 🌡️ → ?Answer:',
    optionA: 'Global Warming / Climate Change',
    optionB: 'Solar Eclipse',
    optionC: 'Volcanic Eruption',
    optionD: 'Forest Fire',
    correctOption: 'A'
  },
  {
    questionOrder: 4,
    questionText: 'Q4. 🧬 + 🔬 + 🧪 → ?Answer:',
    optionA: 'Genetic Research / Biotechnology',
    optionB: 'Space Exploration',
    optionC: 'Software Engineering',
    optionD: 'Civil Construction',
    correctOption: 'A'
  },
  {
    questionOrder: 5,
    questionText: 'Q5. 👁️ + 🌀 + 🤔 → ?Answer:',
    optionA: 'Optical Illusion / Confusion',
    optionB: 'Eye Test',
    optionC: 'Virtual Reality',
    optionD: 'Meditation',
    correctOption: 'A'
  },
  {
    questionOrder: 6,
    questionText: 'Q6. 🛰️ + 📡 + 🌍 → ?Answer:',
    optionA: 'Satellite Communication / Global Positioning',
    optionB: 'Weather Station',
    optionC: 'Radio Station',
    optionD: 'Deep Sea Diving',
    correctOption: 'A'
  },
  {
    questionOrder: 7,
    questionText: 'Q7. I become smaller every time I take a bath. What am I?Answer:',
    optionA: 'Soap',
    optionB: 'Towel',
    optionC: 'Sponge',
    optionD: 'Water',
    correctOption: 'A'
  },
  {
    questionOrder: 8,
    questionText: 'Q8. I can be opened, closed, saved, and shared, but I am not a door. What am I?Answer:',
    optionA: 'A File / Document',
    optionB: 'A Window',
    optionC: 'A Book',
    optionD: 'A Key',
    correctOption: 'A'
  },
  {
    questionOrder: 9,
    questionText: 'Q9. I connect many computers so that they can communicate. What am I?Answer:',
    optionA: 'A Network / Internet',
    optionB: 'A Power Cable',
    optionC: 'A Hard Drive',
    optionD: 'A Printer',
    correctOption: 'A'
  },
  {
    questionOrder: 10,
    questionText: 'Q10. I am a fingerprint made from data and used to detect changes. What am I?Answer:',
    optionA: 'Hash Value / Checksum',
    optionB: 'Password',
    optionC: 'IP Address',
    optionD: 'MAC Address',
    correctOption: 'A'
  },
  {
    questionOrder: 11,
    questionText: 'Q11. I can be kept only by first giving me. What am I?Answer:',
    optionA: 'Your word / A promise',
    optionB: 'Money',
    optionC: 'A secret',
    optionD: 'Advice',
    correctOption: 'A'
  },
  {
    questionOrder: 12,
    questionText: 'Q12. I am always increasing, but nobody can reverse me. What am I?Answer:',
    optionA: 'Age / Time',
    optionB: 'Height',
    optionC: 'Weight',
    optionD: 'Temperature',
    correctOption: 'A'
  },
  {
    questionOrder: 13,
    questionText: 'Q13. I have one eye but cannot see anything. What am I?Answer:',
    optionA: 'A needle',
    optionB: 'A storm',
    optionC: 'A potato',
    optionD: 'A camera',
    correctOption: 'A'
  },
  {
    questionOrder: 14,
    questionText: 'Q14. I have a neck and arms but no head or hands. What am I?Answer:',
    optionA: 'A shirt',
    optionB: 'A bottle',
    optionC: 'A guitar',
    optionD: 'A clock',
    correctOption: 'A'
  },
  {
    questionOrder: 15,
    questionText: 'Q15. I am a cloud that never rains and a drive that never moves. What am I?Answer:',
    optionA: 'Cloud storage / Hard drive',
    optionB: 'Fog',
    optionC: 'USB Drive',
    optionD: 'Car engine',
    correctOption: 'A'
  },
  {
    questionOrder: 16,
    questionText: 'Q16. I am the beginning of eternity and the beginning of every end. What letter am I?Answer:',
    optionA: 'The letter E',
    optionB: 'The letter A',
    optionC: 'The letter T',
    optionD: 'The letter Z',
    correctOption: 'A'
  },
  {
    questionOrder: 17,
    questionText: 'Q17. I am made of tiny drops and can hide an entire mountain. The wind moves me, and the sun removes me. What am I?Answer:',
    optionA: 'Fog / Mist',
    optionB: 'Rain',
    optionC: 'Snow',
    optionD: 'Smoke',
    correctOption: 'A'
  },
  {
    questionOrder: 18,
    questionText: 'Q18. A rooster stands on a roof and supposedly lays an egg. Which direction does it roll?Answer:',
    optionA: 'Roosters do not lay eggs',
    optionB: 'Left',
    optionC: 'Right',
    optionD: 'Straight down',
    correctOption: 'A'
  },
  {
    questionOrder: 19,
    questionText: 'Q19. The more you know about me, the larger I become. What am I?Answer:',
    optionA: 'Knowledge / Curiosity',
    optionB: 'Secret',
    optionC: 'Shadow',
    optionD: 'Memory',
    correctOption: 'A'
  },
  {
    questionOrder: 20,
    questionText: 'Q20. I grow stronger whenever I successfully face difficulty. What am I?Answer:',
    optionA: 'Resilience / Character',
    optionB: 'Muscle',
    optionC: 'Fear',
    optionD: 'Doubt',
    correctOption: 'A'
  },
  {
    questionOrder: 21,
    questionText: 'Q21. I become useful only when acted upon. What am I?Answer:',
    optionA: 'Potential / An Idea',
    optionB: 'Water',
    optionC: 'Air',
    optionD: 'Sun',
    correctOption: 'A'
  },
  {
    questionOrder: 22,
    questionText: 'Q22. A farmer has 17 sheep. All but 9 die. How many remain?Answer:',
    optionA: '9',
    optionB: '8',
    optionC: '17',
    optionD: '0',
    correctOption: 'A'
  },
  {
    questionOrder: 23,
    questionText: 'Q23. A man is looking at a portrait. Someone asks whose portrait it is. He says, “I have no siblings, but that person\'s father is my father\'s son.” Who is pictured?Answer:',
    optionA: 'His son',
    optionB: 'Himself',
    optionC: 'His father',
    optionD: 'His nephew',
    correctOption: 'A'
  },
  {
    questionOrder: 24,
    questionText: 'Q24. A man shaves several times every day but still has a beard. Who is he?Answer:',
    optionA: 'A barber',
    optionB: 'An actor',
    optionC: 'A magician',
    optionD: 'A soldier',
    correctOption: 'A'
  },
  {
    questionOrder: 25,
    questionText: 'Q25. You overtake the person in second place during a race. What position are you now in?Answer:',
    optionA: '2nd place',
    optionB: '1st place',
    optionC: '3rd place',
    optionD: 'Last place',
    correctOption: 'A'
  },
  {
    questionOrder: 26,
    questionText: 'Q26. A number multiplied by itself equals twice the number. What positive number is it?Answer:',
    optionA: '2',
    optionB: '1',
    optionC: '4',
    optionD: '0',
    correctOption: 'A'
  },
  {
    questionOrder: 27,
    questionText: 'Q27. What is the next number: 1, 4, 9, 16, 25, __?Answer:',
    optionA: '36',
    optionB: '30',
    optionC: '35',
    optionD: '49',
    correctOption: 'A'
  },
  {
    questionOrder: 28,
    questionText: 'Q28. A bat and a ball cost 110 rupees. The bat costs 100 rupees more than the ball. How much does the ball cost?Answer:',
    optionA: '5 rupees',
    optionB: '10 rupees',
    optionC: '15 rupees',
    optionD: '1 rupee',
    correctOption: 'A'
  },
  {
    questionOrder: 29,
    questionText: 'Q29. If you reverse a two-digit number and subtract the smaller from the larger, the answer is always divisible by what number?Answer:',
    optionA: '9',
    optionB: '11',
    optionC: '10',
    optionD: '7',
    correctOption: 'A'
  },
  {
    questionOrder: 30,
    questionText: 'Q30. Ten people each shake hands once with every other person. How many handshakes occur?Answer:',
    optionA: '45',
    optionB: '90',
    optionC: '100',
    optionD: '50',
    correctOption: 'A'
  }
];

async function importQuestions() {
  const transaction = await sequelize.transaction();
  try {
    console.log('=== IMPORTING QUESTIONS FOR CREATIVE RIDDLES B.TECH 2ND YEAR SET 5 ===\n');

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
    console.log(`Final Question Count for SET 5: ${finalCount}`);
  } catch (error) {
    await transaction.rollback();
    console.error('Import failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

importQuestions();
