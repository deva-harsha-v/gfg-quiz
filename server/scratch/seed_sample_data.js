process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '3306';
process.env.DB_NAME = 'engineers_day_quiz';
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = 'Ramana@05';

const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

async function seedSampleData() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Check existing rounds
    const existingRounds = await QuizRound.findAll();
    console.log(`Found ${existingRounds.length} existing rounds.`);

    // Create Round 1 if not exists
    let r1 = await QuizRound.findOne({ where: { roundNumber: 1 } });
    if (!r1) {
      r1 = await QuizRound.create({
        roundNumber: 1,
        title: 'Round 1 - General Technical Quiz',
        description: 'Test your fundamental engineering & computer science knowledge.',
        duration: 10,
        totalMarks: 30,
        status: 'ACTIVE'
      });
      console.log('Created Round 1.');

      // Add Questions for Round 1
      await Question.bulkCreate([
        {
          roundId: r1.id,
          questionOrder: 1,
          questionText: 'Which data structure follows the Last-In, First-Out (LIFO) principle?',
          optionA: 'Queue',
          optionB: 'Stack',
          optionC: 'Array',
          optionD: 'Linked List',
          correctOption: 'B',
          marks: 10,
          negativeMarks: 2,
          explanation: 'A Stack is a LIFO data structure where elements are added and removed from the top.',
          isActive: true
        },
        {
          roundId: r1.id,
          questionOrder: 2,
          questionText: 'What is the time complexity of searching an element in a balanced Binary Search Tree (BST)?',
          optionA: 'O(1)',
          optionB: 'O(N)',
          optionC: 'O(log N)',
          optionD: 'O(N log N)',
          correctOption: 'C',
          marks: 10,
          negativeMarks: 2,
          explanation: 'Searching in a balanced BST splits search space in half at each step, giving O(log N) time.',
          isActive: true
        },
        {
          roundId: r1.id,
          questionOrder: 3,
          questionText: 'Which HTTP status code indicates a Successful operation?',
          optionA: '200 OK',
          optionB: '404 Not Found',
          optionC: '500 Server Error',
          optionD: '301 Moved Permanently',
          correctOption: 'A',
          marks: 10,
          negativeMarks: 2,
          explanation: '200 OK is the standard HTTP success status code.',
          isActive: true
        }
      ]);
      console.log('Created 3 questions for Round 1.');
    } else {
      r1.status = 'ACTIVE';
      await r1.save();
      console.log('Round 1 exists and is set to ACTIVE.');
    }

    // Create Round 2 if not exists
    let r2 = await QuizRound.findOne({ where: { roundNumber: 2 } });
    if (!r2) {
      r2 = await QuizRound.create({
        roundNumber: 2,
        title: 'Round 2 - Advanced Programming & Logic',
        description: 'Challenge your problem solving, algorithm efficiency, and code debugging skills.',
        duration: 15,
        totalMarks: 20,
        status: 'DRAFT'
      });
      console.log('Created Round 2.');

      await Question.bulkCreate([
        {
          roundId: r2.id,
          questionOrder: 1,
          questionText: 'Which design pattern restricts the instantiation of a class to a single object instance?',
          optionA: 'Factory Pattern',
          optionB: 'Singleton Pattern',
          optionC: 'Observer Pattern',
          optionD: 'Adapter Pattern',
          correctOption: 'B',
          marks: 10,
          negativeMarks: 2,
          explanation: 'Singleton pattern ensures only one instance of a class is created.',
          isActive: true
        },
        {
          roundId: r2.id,
          questionOrder: 2,
          questionText: 'Which keyword in JavaScript declares a block-scoped variable that cannot be re-declared?',
          optionA: 'var',
          optionB: 'let',
          optionC: 'global',
          optionD: 'define',
          correctOption: 'B',
          marks: 10,
          negativeMarks: 2,
          explanation: '`let` is block-scoped and prevents re-declaration in the same scope.',
          isActive: true
        }
      ]);
      console.log('Created 2 questions for Round 2.');
    }

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedSampleData();
