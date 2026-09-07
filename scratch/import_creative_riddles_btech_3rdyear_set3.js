require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const TARGET_ROUND_ID = '32cc8515-c64a-4ebc-a84b-baa98a4a2105';

const questionsData = [
  {
    questionOrder: 1,
    questionText: 'Q1. 🔐 + 💻 + 🛡️ → ?Answer:',
    optionA: 'Cyber Security / Data Protection',
    optionB: 'Firewall Configuration',
    optionC: 'Password Reset',
    optionD: 'Anti-Virus Update',
    correctOption: 'A'
  },
  {
    questionOrder: 2,
    questionText: 'Q2. 🎧 + 🔇 + 🔊 → ?Answer:',
    optionA: 'Noise Cancellation / Volume Control',
    optionB: 'Audio Recording',
    optionC: 'Radio Station',
    optionD: 'Microphone Setup',
    correctOption: 'A'
  },
  {
    questionOrder: 3,
    questionText: 'Q3. 🚗 + 🚗 + 🚗 + 🛑 → ?Answer:',
    optionA: 'Traffic Jam / Traffic Congestion',
    optionB: 'Highway Toll Station',
    optionC: 'Parking Lot',
    optionD: 'Car Wash',
    correctOption: 'A'
  },
  {
    questionOrder: 4,
    questionText: 'Q4. 🛰️ + 📡 + 🌍 → ?Answer:',
    optionA: 'Satellite Telecommunication / Global Broadcast',
    optionB: 'Weather Warning',
    optionC: 'Radio Tower',
    optionD: 'Ocean Exploration',
    correctOption: 'A'
  },
  {
    questionOrder: 5,
    questionText: 'Q5. 💽 + 💻 + 📁 → ?Answer:',
    optionA: 'Data Backup / File Storage',
    optionB: 'Operating System Install',
    optionC: 'CD Burning',
    optionD: 'Folder Deletion',
    correctOption: 'A'
  },
  {
    questionOrder: 6,
    questionText: 'Q6. 🧩 + 🧠 + 🔎 + 💡 → ?Answer:',
    optionA: 'Problem Solving / Innovation',
    optionB: 'Memory Loss',
    optionC: 'Brain Scan',
    optionD: 'Research Laboratory',
    correctOption: 'A'
  },
  {
    questionOrder: 7,
    questionText: 'Q7. I begin as an idea and become something that can be demonstrated. What am I?Answer:',
    optionA: 'A project / Prototype',
    optionB: 'A dream',
    optionC: 'A shadow',
    optionD: 'A rumor',
    correctOption: 'A'
  },
  {
    questionOrder: 8,
    questionText: 'Q8. I follow a sequence of steps to solve a problem. What am I?Answer:',
    optionA: 'An algorithm',
    optionB: 'A flowchart',
    optionC: 'A computer screen',
    optionD: 'A calculator',
    correctOption: 'A'
  },
  {
    questionOrder: 9,
    questionText: 'Q9. I can disappear when spoken aloud. What am I?Answer:',
    optionA: 'Silence',
    optionB: 'A secret',
    optionC: 'A shadow',
    optionD: 'An echo',
    correctOption: 'A'
  },
  {
    questionOrder: 10,
    questionText: 'Q10. I can be broken without being touched and repaired without tools. What am I?Answer:',
    optionA: 'Trust / A promise',
    optionB: 'Glass',
    optionC: 'A mirror',
    optionD: 'A bone',
    correctOption: 'A'
  },
  {
    questionOrder: 11,
    questionText: 'Q11. I can prove where you were without actually seeing you. What am I?Answer:',
    optionA: 'A digital log / Digital footprint / Alibi',
    optionB: 'A photograph',
    optionC: 'A witness',
    optionD: 'A keycard',
    correctOption: 'A'
  },
  {
    questionOrder: 12,
    questionText: 'Q12. I am difficult to build, easy to lose, and valuable in every relationship. What am I?Answer:',
    optionA: 'Trust',
    optionB: 'Wealth',
    optionC: 'Reputation',
    optionD: 'Memory',
    correctOption: 'A'
  },
  {
    questionOrder: 13,
    questionText: 'Q13. I am filled with words but cannot speak until someone opens me. What am I?Answer:',
    optionA: 'A book',
    optionB: 'A box',
    optionC: 'A phone',
    optionD: 'A letter',
    correctOption: 'A'
  },
  {
    questionOrder: 14,
    questionText: 'Q14. I become visible only when light passes through tiny drops of water. What am I?Answer:',
    optionA: 'A rainbow',
    optionB: 'Fog',
    optionC: 'A mirage',
    optionD: 'A shadow',
    correctOption: 'A'
  },
  {
    questionOrder: 15,
    questionText: 'Q15. Two fathers and two sons enter a room, but there are only three people. How is that possible?Answer:',
    optionA: 'They are grandfather, father, and son',
    optionB: 'One father is adoptive',
    optionC: 'One son is missing',
    optionD: 'It is an optical illusion',
    correctOption: 'A'
  },
  {
    questionOrder: 16,
    questionText: 'Q16. A student has seven candles. Two go out, while the others burn completely. How many candles remain?Answer:',
    optionA: 'Two (the two that went out remain unconsumed)',
    optionB: 'Seven',
    optionC: 'Five',
    optionD: 'Zero',
    correctOption: 'A'
  },
  {
    questionOrder: 17,
    questionText: 'Q17. A person says, “I have no brothers or sisters, but that man\'s father is my father\'s son.” Who is the man?Answer:',
    optionA: 'His son',
    optionB: 'Himself',
    optionC: 'His father',
    optionD: 'His uncle',
    correctOption: 'A'
  },
  {
    questionOrder: 18,
    questionText: 'Q18. I rise when heated, can cover a mirror, and disappear into the air. What am I?Answer:',
    optionA: 'Steam / Water vapor',
    optionB: 'Smoke',
    optionC: 'Dust',
    optionD: 'Fog',
    correctOption: 'A'
  },
  {
    questionOrder: 19,
    questionText: 'Q19. I am born in a second but can remain forever. What am I?Answer:',
    optionA: 'A memory / Photograph',
    optionB: 'A thought',
    optionC: 'A sound',
    optionD: 'A spark',
    correctOption: 'A'
  },
  {
    questionOrder: 20,
    questionText: 'Q20. I can imprison the mind even though I have no walls. What am I?Answer:',
    optionA: 'Fear / Ignorance',
    optionB: 'A cage',
    optionC: 'Sleep',
    optionD: 'A maze',
    correctOption: 'A'
  },
  {
    questionOrder: 21,
    questionText: 'Q21. How many animals did Moses take on the ark?Answer:',
    optionA: 'Zero (Noah built the ark, not Moses)',
    optionB: 'Two of every kind',
    optionC: 'Seven pairs',
    optionD: '100',
    correctOption: 'A'
  },
  {
    questionOrder: 22,
    questionText: 'Q22. How can a person go eight days without sleep?Answer:',
    optionA: 'By sleeping at night',
    optionB: 'By drinking coffee',
    optionC: 'By exercising',
    optionD: 'It is impossible',
    correctOption: 'A'
  },
  {
    questionOrder: 23,
    questionText: 'Q23. A woman gives a man a photograph. The man says, “This person\'s father is the only son of my father.” Who is in the photograph?Answer:',
    optionA: 'His child / Daughter or Son',
    optionB: 'His father',
    optionC: 'Himself',
    optionD: 'His mother',
    correctOption: 'A'
  },
  {
    questionOrder: 24,
    questionText: 'Q24. You have one word that can mean both a positive and negative action depending on context. What is it?Answer:',
    optionA: 'A contronym (e.g. Sanction / Cleave)',
    optionB: 'Synonym',
    optionC: 'Antonym',
    optionD: 'Homophone',
    correctOption: 'A'
  },
  {
    questionOrder: 25,
    questionText: 'Q25. I am between 1 and 3 but I am not 2. Give one possible answer.Answer:',
    optionA: '1.5 (or any non-integer between 1 and 3)',
    optionB: '4',
    optionC: '0',
    optionD: '5',
    correctOption: 'A'
  },
  {
    questionOrder: 26,
    questionText: 'Q26. You overtake the person in second place during a race. What position are you now in?Answer:',
    optionA: '2nd place',
    optionB: '1st place',
    optionC: '3rd place',
    optionD: 'Last place',
    correctOption: 'A'
  },
  {
    questionOrder: 27,
    questionText: 'Q27. A snail climbs 3 meters every day and slides down 2 meters every night in a 10-meter well. How many days does it take to escape?Answer:',
    optionA: '8 days',
    optionB: '10 days',
    optionC: '7 days',
    optionD: '9 days',
    correctOption: 'A'
  },
  {
    questionOrder: 28,
    questionText: 'Q28. What is the sum of all integers from 1 to 100?Answer:',
    optionA: '5050',
    optionB: '5000',
    optionC: '5100',
    optionD: '4950',
    correctOption: 'A'
  },
  {
    questionOrder: 29,
    questionText: 'Q29. How many times can you subtract 10 from 100?Answer:',
    optionA: 'Only once (after that, you are subtracting from 90)',
    optionB: '10 times',
    optionC: '9 times',
    optionD: 'Infinitely',
    correctOption: 'A'
  },
  {
    questionOrder: 30,
    questionText: 'Q30. If five machines make five products in five minutes, how long would 100 machines take to make 100 products?Answer:',
    optionA: '5 minutes',
    optionB: '100 minutes',
    optionC: '20 minutes',
    optionD: '1 minute',
    correctOption: 'A'
  }
];

async function importQuestions() {
  const transaction = await sequelize.transaction();
  try {
    console.log('=== IMPORTING QUESTIONS FOR CREATIVE RIDDLES B.TECH 3RD YEAR SET 3 ===\n');

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
    console.log(`Final Question Count for SET 3: ${finalCount}`);
  } catch (error) {
    await transaction.rollback();
    console.error('Import failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

importQuestions();
