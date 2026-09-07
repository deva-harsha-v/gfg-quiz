require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const questionsData = [
  {
    questionOrder: 1,
    questionText: '👨‍🎓 + 🏫 + 📋Answer:',
    optionA: 'Graduation / Result Check',
    optionB: 'Homework Assignment',
    optionC: 'Class Attendance',
    optionD: 'School Assembly',
    correctOption: 'A'
  },
  {
    questionOrder: 2,
    questionText: '🧩 + 🧠 + 💡Answer:',
    optionA: 'Problem Solving / Idea',
    optionB: 'Memory Loss',
    optionC: 'Video Game',
    optionD: 'Brainstorming Session',
    correctOption: 'A'
  },
  {
    questionOrder: 3,
    questionText: '🎓 + 🪪Answer:',
    optionA: 'Student ID Card / Convocation',
    optionB: 'Library Pass',
    optionC: 'Driving License',
    optionD: 'Passport',
    correctOption: 'A'
  },
  {
    questionOrder: 4,
    questionText: '🏫 + 📶Answer:',
    optionA: 'Campus Wi-Fi',
    optionB: 'Radio Station',
    optionC: 'Mobile Tower',
    optionD: 'Internet Router',
    correctOption: 'A'
  },
  {
    questionOrder: 5,
    questionText: '🚌 + 🏫Answer:',
    optionA: 'College Bus',
    optionB: 'Railway Station',
    optionC: 'Traffic Signal',
    optionD: 'Public Transport',
    correctOption: 'A'
  },
  {
    questionOrder: 6,
    questionText: '💻 + 📝Answer:',
    optionA: 'Online Exam / Coding Test',
    optionB: 'Social Media Post',
    optionC: 'Email Drafting',
    optionD: 'Desktop Setup',
    correctOption: 'A'
  },
  {
    questionOrder: 7,
    questionText: 'I am made of zeros and ones, but I can represent almost anything in a computer.',
    optionA: 'Binary Code',
    optionB: 'Decimal System',
    optionC: 'Hexadecimal Code',
    optionD: 'Text File',
    correctOption: 'A'
  },
  {
    questionOrder: 8,
    questionText: 'I can be opened, closed, saved and shared, but I am not a door.',
    optionA: 'Folder',
    optionB: 'Digital File',
    optionC: 'Application',
    optionD: 'Website',
    correctOption: 'B'
  },
  {
    questionOrder: 9,
    questionText: 'I have cities but no houses, rivers but no water, and roads but no cars.',
    optionA: 'Map',
    optionB: 'Globe',
    optionC: 'Atlas',
    optionD: 'Satellite Image',
    correctOption: 'A'
  },
  {
    questionOrder: 10,
    questionText: 'I become smaller every time I take a bath.',
    optionA: 'Candle',
    optionB: 'Soap',
    optionC: 'Ice Cube',
    optionD: 'Sponge',
    correctOption: 'B'
  },
  {
    questionOrder: 11,
    questionText: 'I follow you everywhere,but disappear in darkness. You can never catch me, no matter how fast you run.',
    optionA: 'Shadow',
    optionB: 'Reflection',
    optionC: 'Wind',
    optionD: 'Echo',
    correctOption: 'A'
  },
  {
    questionOrder: 12,
    questionText: 'I have no weight, but I can bring down a building. I cannot be held, but everyone can feel my effect.',
    optionA: 'Earthquake',
    optionB: 'Gravity',
    optionC: 'Wind',
    optionD: 'Noise',
    correctOption: 'A'
  },
  {
    questionOrder: 13,
    questionText: 'I have one eye but cannot see; what am I?',
    optionA: 'Storm',
    optionB: 'Needle',
    optionC: 'Potato',
    optionD: 'Target',
    correctOption: 'B'
  },
  {
    questionOrder: 14,
    questionText: 'I am full of holes, but I can still hold water; what am I?',
    optionA: 'Sponge',
    optionB: 'Bucket',
    optionC: 'Net',
    optionD: 'Filter',
    correctOption: 'A'
  },
  {
    questionOrder: 15,
    questionText: 'I speak without a mouth and answer when you call, but I am not a person; what am I?',
    optionA: 'Radio',
    optionB: 'Echo',
    optionC: 'Speaker',
    optionD: 'Telephone',
    correctOption: 'B'
  },
  {
    questionOrder: 16,
    questionText: 'I rise when rain falls and disappear when the sun shines; what am I?',
    optionA: 'Umbrella',
    optionB: 'Cloud',
    optionC: 'Puddle',
    optionD: 'Rainbow',
    correctOption: 'A'
  },
  {
    questionOrder: 17,
    questionText: 'I have cities without buildings, forests without trees, and rivers without water; what am I?',
    optionA: 'Dream',
    optionB: 'Map',
    optionC: 'Painting',
    optionD: 'Storybook',
    correctOption: 'B'
  },
  {
    questionOrder: 18,
    questionText: 'I belong to you, but other people use me more often than you do; what am I?',
    optionA: 'Phone Number',
    optionB: 'Your Name',
    optionC: 'House Address',
    optionD: 'Signature',
    correctOption: 'B'
  },
  {
    questionOrder: 19,
    questionText: 'I increase when divided.',
    optionA: 'Knowledge / Secret',
    optionB: 'Money',
    optionC: 'Pizza',
    optionD: 'Distance',
    correctOption: 'A'
  },
  {
    questionOrder: 20,
    questionText: 'I am lighter than air but heavier than truth.',
    optionA: 'Shadow',
    optionB: 'Lie / Rumor',
    optionC: 'Smoke',
    optionD: 'Secret',
    correctOption: 'B'
  },
  {
    questionOrder: 21,
    questionText: 'I can travel centuries without moving.',
    optionA: 'Book / History',
    optionB: 'Clock',
    optionC: 'Tree',
    optionD: 'Stone',
    correctOption: 'A'
  },
  {
    questionOrder: 22,
    questionText: 'The more you remove from me, the more I reveal.',
    optionA: 'Puzzle / Scrape',
    optionB: 'Onion',
    optionC: 'Secret',
    optionD: 'Mirror',
    correctOption: 'A'
  },
  {
    questionOrder: 23,
    questionText: 'I am bought by wisdom but sold by pride.',
    optionA: 'Wealth',
    optionB: 'Humility',
    optionC: 'Respect',
    optionD: 'Knowledge',
    correctOption: 'B'
  },
  {
    questionOrder: 24,
    questionText: 'I disappear the moment you name me.',
    optionA: 'Silence',
    optionB: 'Secret',
    optionC: 'Dark',
    optionD: 'Whisper',
    correctOption: 'A'
  },
  {
    questionOrder: 25,
    questionText: 'There are four people in a room. Every person has two parents. How many parents are definitely in the room?',
    optionA: '8',
    optionB: '0',
    optionC: '4',
    optionD: '2',
    correctOption: 'B'
  },
  {
    questionOrder: 26,
    questionText: 'I am a number. Take away half of me, and I become zero. What am I?',
    optionA: '10',
    optionB: '8',
    optionC: '6',
    optionD: '4',
    correctOption: 'B'
  },
  {
    questionOrder: 27,
    questionText: 'A number is written using only straight lines. Add one line and it becomes a different number. What could it be?',
    optionA: 'Roman Numeral',
    optionB: 'Binary Digits',
    optionC: 'Decimal Number',
    optionD: 'Prime Number',
    correctOption: 'A'
  },
  {
    questionOrder: 28,
    questionText: 'A square has four corners. You cut off one corner. How many corners does the new shape have?',
    optionA: '3',
    optionB: '5',
    optionC: '4',
    optionD: '6',
    correctOption: 'B'
  },
  {
    questionOrder: 29,
    questionText: 'Five people stand in a row; everyone sees someone taller though the tallest is at the front. How is that possible?',
    optionA: 'They are facing backwards',
    optionB: 'They are standing on stairs',
    optionC: 'They are wearing hats',
    optionD: 'The ground is sloping',
    correctOption: 'A'
  },
  {
    questionOrder: 30,
    questionText: 'A man dies of old age on his 25th birthday. How is this possible?',
    optionA: 'He lived on Mars',
    optionB: 'Born on Feb 29 / Leap year',
    optionC: 'He measured time differently',
    optionD: 'He was born BC',
    correctOption: 'B'
  }
];

async function importCreativeRiddlesDiplomaSet2() {
  const transaction = await sequelize.transaction();
  try {
    const round = await QuizRound.findOne({
      where: {
        category: 'Creative Riddles',
        course: 'Diploma',
        year: '1st Year',
        setNumber: 2
      },
      transaction
    });

    if (!round) {
      throw new Error('Target round not found: Creative Riddles - 1st Year Diploma — SET 2');
    }

    console.log(`Target Round Found: "${round.title}" (ID: ${round.id})`);

    const existingCount = await Question.count({ where: { roundId: round.id }, transaction });
    console.log(`Existing Question Count in SET 2: ${existingCount}`);

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
    console.log(`Final Question Count for Creative Riddles 1st Year Diploma SET 2: ${finalCount}`);

  } catch (err) {
    await transaction.rollback();
    console.error('❌ Import failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

importCreativeRiddlesDiplomaSet2();
