require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const TARGET_ROUND_ID = '9ba34dbd-6cc1-4ce8-9900-5ca5829f1b0f';

const questionsData = [
  {
    questionOrder: 1,
    questionText: 'Q1. 🏫 + 📶 + 📱 → ?Answer:',
    optionA: 'Campus Wi-Fi / Smart Campus',
    optionB: 'School Bus',
    optionC: 'Mobile Charger',
    optionD: 'Online Exam',
    correctOption: 'A'
  },
  {
    questionOrder: 2,
    questionText: 'Q2. 📊 + 🔍 + 💻 → ?Answer:',
    optionA: 'Data Analytics / Business Intelligence',
    optionB: 'Web Browsing',
    optionC: 'Screen Recorder',
    optionD: 'Spreadsheet Formula',
    correctOption: 'A'
  },
  {
    questionOrder: 3,
    questionText: 'Q3. 🦠 + 🔬 + 🧫 → ?Answer:',
    optionA: 'Microbiology / Cell Culture Research',
    optionB: 'Astronomy',
    optionC: 'Mechanical Design',
    optionD: 'Civil Engineering',
    correctOption: 'A'
  },
  {
    questionOrder: 4,
    questionText: 'Q4. 💾 + 📡 + 📥 → ?Answer:',
    optionA: 'Cloud Download / File Retrieval',
    optionB: 'Disk Formatting',
    optionC: 'Email Spam',
    optionD: 'Printer Queue',
    correctOption: 'A'
  },
  {
    questionOrder: 5,
    questionText: 'Q5. ⛓️ + 🔐 + 💰 → ?Answer:',
    optionA: 'Blockchain / Cryptocurrency Security',
    optionB: 'Bank Vault Lock',
    optionC: 'Credit Card Swipe',
    optionD: 'ATM PIN',
    correctOption: 'A'
  },
  {
    questionOrder: 6,
    questionText: 'Q6. 🧱 + 🔥 + 🛡️ → ?Answer:',
    optionA: 'Firewall / Fire Barrier Protection',
    optionB: 'Brick Oven',
    optionC: 'Shield Wall',
    optionD: 'Armor Plate',
    correctOption: 'A'
  },
  {
    questionOrder: 7,
    questionText: 'Q7. I can show you places without taking you there. What am I?Answer:',
    optionA: 'A map / Video / Screen',
    optionB: 'A car',
    optionC: 'A train',
    optionD: 'An airplane',
    correctOption: 'A'
  },
  {
    questionOrder: 8,
    questionText: 'Q8. I can be typed, copied, deleted, and formatted. What am I?Answer:',
    optionA: 'Digital text / Document',
    optionB: 'Paper',
    optionC: 'Ink',
    optionD: 'Keyboard',
    correctOption: 'A'
  },
  {
    questionOrder: 9,
    questionText: 'Q9. I separate white light into different visible colors. What am I?Answer:',
    optionA: 'A prism / Raindrop',
    optionB: 'A mirror',
    optionC: 'A shadow',
    optionD: 'A flashlight',
    correctOption: 'A'
  },
  {
    questionOrder: 10,
    questionText: 'Q10. I am created by the absence of light and shaped by an object. What am I?Answer:',
    optionA: 'A shadow',
    optionB: 'A reflection',
    optionC: 'A mirage',
    optionD: 'A rainbow',
    correctOption: 'A'
  },
  {
    questionOrder: 11,
    questionText: 'Q11. I can cross an ocean in seconds without leaving my original location. What am I?Answer:',
    optionA: 'An email / Radio signal / Digital data',
    optionB: 'A ship',
    optionC: 'A dolphin',
    optionD: 'An island',
    correctOption: 'A'
  },
  {
    questionOrder: 12,
    questionText: 'Q12. I contain instructions that a computer can understand and execute. What am I?Answer:',
    optionA: 'Computer code / Software program',
    optionB: 'A power supply',
    optionC: 'A keyboard',
    optionD: 'A computer mouse',
    correctOption: 'A'
  },
  {
    questionOrder: 13,
    questionText: 'Q13. I am full of words, yet I never say a single one aloud. What am I?Answer:',
    optionA: 'A book',
    optionB: 'A radio',
    optionC: 'A speaker',
    optionD: 'A microphone',
    correctOption: 'A'
  },
  {
    questionOrder: 14,
    questionText: 'Q14. I can carry people across water while remaining on top of it. What am I?Answer:',
    optionA: 'A boat / Ship / Ferry',
    optionB: 'A submarine',
    optionC: 'An anchor',
    optionD: 'A surfboard',
    correctOption: 'A'
  },
  {
    questionOrder: 15,
    questionText: 'Q15. A plane crashes on an international border. Where should the survivors be buried?Answer:',
    optionA: 'Survivors are not buried',
    optionB: 'In the country of origin',
    optionC: 'On the border line',
    optionD: 'In the nearest graveyard',
    correctOption: 'A'
  },
  {
    questionOrder: 16,
    questionText: 'Q16. A rooster stands on a roof and supposedly lays an egg. Which direction does it roll?Answer:',
    optionA: 'Roosters do not lay eggs',
    optionB: 'Left',
    optionC: 'Right',
    optionD: 'Downward',
    correctOption: 'A'
  },
  {
    questionOrder: 17,
    questionText: 'Q17. I appear once in “minute,” twice in “moment,” and never in “thousand.” What am I?Answer:',
    optionA: 'The letter M',
    optionB: 'The letter E',
    optionC: 'The letter T',
    optionD: 'The letter O',
    correctOption: 'A'
  },
  {
    questionOrder: 18,
    questionText: 'Q18. I have thirteen hearts but no other organs. What am I?Answer:',
    optionA: 'A deck of playing cards',
    optionB: 'An octopus',
    optionC: 'An alien',
    optionD: 'A chest of drawers',
    correctOption: 'A'
  },
  {
    questionOrder: 19,
    questionText: 'Q19. The more I am divided among people, the more I can grow. What am I?Answer:',
    optionA: 'Knowledge / Happiness',
    optionB: 'Money',
    optionC: 'Cake',
    optionD: 'Land',
    correctOption: 'A'
  },
  {
    questionOrder: 20,
    questionText: 'Q20. I arrive after you miss me, and I leave before you realize my value. What am I?Answer:',
    optionA: 'Opportunity / Time',
    optionB: 'Money',
    optionC: 'Health',
    optionD: 'Sleep',
    correctOption: 'A'
  },
  {
    questionOrder: 21,
    questionText: 'Q21. A man is looking at a portrait. Someone asks whose portrait it is. He says, “I have no siblings, but that person\'s father is my father\'s son.” Who is pictured?Answer:',
    optionA: 'His son',
    optionB: 'Himself',
    optionC: 'His father',
    optionD: 'His nephew',
    correctOption: 'A'
  },
  {
    questionOrder: 22,
    questionText: 'Q22. A man shaves several times every day but still has a beard. Who is he?Answer:',
    optionA: 'A barber',
    optionB: 'An actor',
    optionC: 'A magician',
    optionD: 'A soldier',
    correctOption: 'A'
  },
  {
    questionOrder: 23,
    questionText: 'Q23. What can fill a bucket but weighs nothing?Answer:',
    optionA: 'Light / Holes',
    optionB: 'Water',
    optionC: 'Sand',
    optionD: 'Rocks',
    correctOption: 'A'
  },
  {
    questionOrder: 24,
    questionText: 'Q24. What can be seen once in a lifetime, twice in a moment, and never in one hundred years?Answer:',
    optionA: 'The letter M',
    optionB: 'The letter E',
    optionC: 'The letter O',
    optionD: 'The letter T',
    correctOption: 'A'
  },
  {
    questionOrder: 25,
    questionText: 'Q25. What is the smallest positive integer?Answer:',
    optionA: '1',
    optionB: '0',
    optionC: '2',
    optionD: '-1',
    correctOption: 'A'
  },
  {
    questionOrder: 26,
    questionText: 'Q26. What number is halfway between 20 and 30?Answer:',
    optionA: '25',
    optionB: '24',
    optionC: '26',
    optionD: '22.5',
    correctOption: 'A'
  },
  {
    questionOrder: 27,
    questionText: 'Q27. What is ½ × ⅔ × ¾ × ⅘ × ⅚ × ⁶⁄₇ × ⅞ × ⅘ × ⁹⁄₁₀ × 1000?Answer:',
    optionA: '32',
    optionB: '50',
    optionC: '40',
    optionD: '100',
    correctOption: 'A'
  },
  {
    questionOrder: 28,
    questionText: 'Q28. If you reverse a two-digit number and subtract the smaller from the larger, the answer is always divisible by what number?Answer:',
    optionA: '9',
    optionB: '11',
    optionC: '10',
    optionD: '7',
    correctOption: 'A'
  },
  {
    questionOrder: 29,
    questionText: 'Q29. How many total squares are on a standard 8 × 8 chessboard?Answer:',
    optionA: '204',
    optionB: '64',
    optionC: '128',
    optionD: '256',
    correctOption: 'A'
  },
  {
    questionOrder: 30,
    questionText: 'Q30. Find the missing number: 3, 9, 27, __, 243.Answer:',
    optionA: '81',
    optionB: '54',
    optionC: '72',
    optionD: '108',
    correctOption: 'A'
  }
];

async function importQuestions() {
  const transaction = await sequelize.transaction();
  try {
    console.log('=== IMPORTING QUESTIONS FOR CREATIVE RIDDLES B.TECH 3RD YEAR SET 5 ===\n');

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
