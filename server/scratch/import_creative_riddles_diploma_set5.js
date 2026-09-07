require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const TARGET_ROUND_ID = '05ea7f34-9315-4745-aaf9-ea3da322e46b';

const questionsData = [
  {
    questionOrder: 1,
    questionText: '💻 + 📚 + ✍️ + 🎓Answer:',
    optionA: 'Online Course / Degree Completion',
    optionB: 'Video Game Stream',
    optionC: 'Library Renovation',
    optionD: 'Social Media Post',
    correctOption: 'A'
  },
  {
    questionOrder: 2,
    questionText: '💻 + 🐛 + 🔧 + 💡Answer:',
    optionA: 'Debugging / Bug Fix',
    optionB: 'Hardware Upgrade',
    optionC: 'Virus Attack',
    optionD: 'Network Setup',
    correctOption: 'A'
  },
  {
    questionOrder: 3,
    questionText: '📝 + 📤 + ⏰ + 🎓Answer:',
    optionA: 'Assignment Submission / Exam Deadline',
    optionB: 'Class Attendance',
    optionC: 'Sports Day Registration',
    optionD: 'Canteen Order',
    correctOption: 'A'
  },
  {
    questionOrder: 4,
    questionText: '🔄 + 💻 + ♾️Answer:',
    optionA: 'Infinite Loop / Program Reboot',
    optionB: 'Battery Low',
    optionC: 'Screen Rotation',
    optionD: 'Wi-Fi Disconnect',
    correctOption: 'A'
  },
  {
    questionOrder: 5,
    questionText: '🔐 + 💻 + 🛡️Answer:',
    optionA: 'Cyber Security / Password Protection',
    optionB: 'Keylogger',
    optionC: 'Software Piracy',
    optionD: 'Monitor Filter',
    correctOption: 'A'
  },
  {
    questionOrder: 6,
    questionText: '🚫 + 🔑 + 💻Answer:',
    optionA: 'Access Denied / Lockout',
    optionB: 'Keyboard Cleaning',
    optionC: 'Wi-Fi Sharing',
    optionD: 'Printer Error',
    correctOption: 'A'
  },
  {
    questionOrder: 7,
    questionText: 'I have keys but no locks. I have space but no room. What am I?',
    optionA: 'Keyboard',
    optionB: 'Piano',
    optionC: 'Map',
    optionD: 'House',
    correctOption: 'A'
  },
  {
    questionOrder: 8,
    questionText: 'I can be cracked, made, told and played. But I am not a game.',
    optionA: 'Joke',
    optionB: 'Code',
    optionC: 'Puzzle',
    optionD: 'Egg',
    correctOption: 'A'
  },
  {
    questionOrder: 9,
    questionText: 'I have a face and two hands, but I cannot smile or clap.',
    optionA: 'Clock',
    optionB: 'Mirror',
    optionC: 'Portrait',
    optionD: 'Puppet',
    correctOption: 'A'
  },
  {
    questionOrder: 10,
    questionText: 'I have many pages, but I am not a tree. I can tell you many stories.',
    optionA: 'Book',
    optionB: 'Website',
    optionC: 'Newspaper',
    optionD: 'Library',
    correctOption: 'A'
  },
  {
    questionOrder: 11,
    questionText: 'I get wetter the more I dry.',
    optionA: 'Towel',
    optionB: 'Sponge',
    optionC: 'Cloud',
    optionD: 'Raincoat',
    correctOption: 'A'
  },
  {
    questionOrder: 12,
    questionText: 'I go up but never come down. Everyone gets one every year.',
    optionA: 'Age',
    optionB: 'Height',
    optionC: 'Temperature',
    optionD: 'Stairs',
    correctOption: 'A'
  },
  {
    questionOrder: 13,
    questionText: 'I have hands but cannot clap, and I tell you when your class begins; what am I?',
    optionA: 'Clock / Bell',
    optionB: 'Teacher',
    optionC: 'Classroom Door',
    optionD: 'Time Table',
    correctOption: 'A'
  },
  {
    questionOrder: 14,
    questionText: 'I become wetter as I dry you; what am I?',
    optionA: 'Towel',
    optionB: 'Soap',
    optionC: 'Water',
    optionD: 'Fan',
    correctOption: 'A'
  },
  {
    questionOrder: 15,
    questionText: 'I have many keys but cannot open a single lock; what am I?',
    optionA: 'Keyboard / Piano',
    optionB: 'Keychain',
    optionC: 'Safe Box',
    optionD: 'Door',
    correctOption: 'A'
  },
  {
    questionOrder: 16,
    questionText: 'I have a face and two hands, but no arms or legs; what am I?',
    optionA: 'Clock',
    optionB: 'Doll',
    optionC: 'Coin',
    optionD: 'Statue',
    correctOption: 'A'
  },
  {
    questionOrder: 17,
    questionText: 'I can travel around the world while staying in one corner; what am I?',
    optionA: 'Stamp',
    optionB: 'Globe',
    optionC: 'Airplane',
    optionD: 'Compass',
    correctOption: 'A'
  },
  {
    questionOrder: 18,
    questionText: 'The more you take away from me, the bigger I become; what am I?',
    optionA: 'Hole',
    optionB: 'Shadow',
    optionC: 'Pit',
    optionD: 'Secret',
    correctOption: 'A'
  },
  {
    questionOrder: 19,
    questionText: 'I am always ahead of you, but you can never catch me.',
    optionA: 'Future',
    optionB: 'Shadow',
    optionC: 'Past',
    optionD: 'Memory',
    correctOption: 'A'
  },
  {
    questionOrder: 20,
    questionText: 'The more you know me, the larger I become.',
    optionA: 'Knowledge',
    optionB: 'Darkness',
    optionC: 'Hole',
    optionD: 'Fear',
    correctOption: 'A'
  },
  {
    questionOrder: 21,
    questionText: 'I can be given, kept, broken, and fulfilled.',
    optionA: 'Promise',
    optionB: 'Rule',
    optionC: 'Gift',
    optionD: 'Heart',
    correctOption: 'A'
  },
  {
    questionOrder: 22,
    questionText: 'I exist only when shared by at least two people.',
    optionA: 'Secret / Friendship',
    optionB: 'Mirror',
    optionC: 'Shadow',
    optionD: 'Thought',
    correctOption: 'A'
  },
  {
    questionOrder: 23,
    questionText: 'I am born in a second and can live forever.',
    optionA: 'Memory',
    optionB: 'Spark',
    optionC: 'Bubble',
    optionD: 'Flash',
    correctOption: 'A'
  },
  {
    questionOrder: 24,
    questionText: 'The richer you are in me, the poorer you appear.',
    optionA: 'Debt',
    optionB: 'Gold',
    optionC: 'Wisdom',
    optionD: 'Time',
    correctOption: 'A'
  },
  {
    questionOrder: 25,
    questionText: 'I have no value alone, but I can change another digit’s value. What am I?',
    optionA: 'Zero (0)',
    optionB: 'One (1)',
    optionC: 'Nine (9)',
    optionD: 'Infinity',
    correctOption: 'A'
  },
  {
    questionOrder: 26,
    questionText: '“I am between 1 and 3, but I am not 2. What am I?”',
    optionA: 'The word "and"',
    optionB: 'Number 4',
    optionC: 'Number 0',
    optionD: 'Number 5',
    correctOption: 'A'
  },
  {
    questionOrder: 27,
    questionText: 'I am an odd number. Remove one letter and I become even. What am I?',
    optionA: 'Seven',
    optionB: 'Three',
    optionC: 'Nine',
    optionD: 'Eleven',
    correctOption: 'A'
  },
  {
    questionOrder: 28,
    questionText: 'Which number looks almost unchanged when reflected in a mirror?',
    optionA: '8',
    optionB: '7',
    optionC: '3',
    optionD: '4',
    correctOption: 'A'
  },
  {
    questionOrder: 29,
    questionText: 'You are running a race. You overtake the person in second place. What position are you in?',
    optionA: '2nd place',
    optionB: '1st place',
    optionC: '3rd place',
    optionD: 'Last place',
    correctOption: 'A'
  },
  {
    questionOrder: 30,
    questionText: 'You overtake the person in last place. What position are you in?',
    optionA: 'Impossible',
    optionB: 'Last place',
    optionC: '1st place',
    optionD: '2nd place',
    correctOption: 'A'
  }
];

async function importCreativeRiddlesDiplomaSet5() {
  const transaction = await sequelize.transaction();
  try {
    const round = await QuizRound.findByPk(TARGET_ROUND_ID, { transaction });
    if (!round) {
      throw new Error(`Target round not found: ${TARGET_ROUND_ID}`);
    }

    console.log(`Target Round Found: "${round.title}" (ID: ${round.id})`);
    console.log(`Current Status: ${round.status}`);

    const existingCount = await Question.count({ where: { roundId: round.id }, transaction });
    console.log(`Existing Question Count in SET 5: ${existingCount}`);

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
    console.log(`Final Question Count for Creative Riddles 1st Year Diploma SET 5: ${finalCount}`);

  } catch (err) {
    await transaction.rollback();
    console.error('❌ Import failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

importCreativeRiddlesDiplomaSet5();
