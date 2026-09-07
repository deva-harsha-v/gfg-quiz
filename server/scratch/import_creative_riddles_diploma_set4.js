require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

const TARGET_ROUND_ID = '99b09a59-0f1c-429d-a932-c71c8ad77167';

const questionsData = [
  {
    questionOrder: 1,
    questionText: '📝 + 📅 →Answer:',
    optionA: 'Exam Date / Time Table',
    optionB: 'Class Notes',
    optionC: 'Calendar App',
    optionD: 'Hall Ticket',
    correctOption: 'A'
  },
  {
    questionOrder: 2,
    questionText: '🖨️ + 📄 →Answer:',
    optionA: 'Hard Copy / Printout',
    optionB: 'Scanner',
    optionC: 'Photocopy Machine',
    optionD: 'Blank Paper',
    correctOption: 'A'
  },
  {
    questionOrder: 3,
    questionText: '⏰ + 🌅 →Answer:',
    optionA: 'Early Morning Alarm / Sunrise',
    optionB: 'Night Shift',
    optionC: 'Late Afternoon',
    optionD: 'Breakfast Time',
    correctOption: 'A'
  },
  {
    questionOrder: 4,
    questionText: '📱 + 🔌 →Answer:',
    optionA: 'Phone Charging / Charger',
    optionB: 'Headphones Connection',
    optionC: 'Mobile Hotspot',
    optionD: 'Screen Replacement',
    correctOption: 'A'
  },
  {
    questionOrder: 5,
    questionText: '👨‍👩‍👧‍👦 + 🍽️ →Answer:',
    optionA: 'Family Dinner / Dining',
    optionB: 'Restaurant Kitchen',
    optionC: 'Cooking Class',
    optionD: 'Picnic Basket',
    correctOption: 'A'
  },
  {
    questionOrder: 6,
    questionText: '🍳 + 🍽️ →Answer:',
    optionA: 'Cooking / Breakfast',
    optionB: 'Washing Dishes',
    optionC: 'Grocery Shopping',
    optionD: 'Food Delivery',
    correctOption: 'A'
  },
  {
    questionOrder: 7,
    questionText: 'I have no physical shape, but every digital system depends on me.',
    optionA: 'Software / Code',
    optionB: 'Keyboard',
    optionC: 'Monitor',
    optionD: 'Power Cable',
    correctOption: 'A'
  },
  {
    questionOrder: 8,
    questionText: 'I am not the answer but finding me can tell you that your answer is wrong.',
    optionA: 'Calculator',
    optionB: 'Software Bug / Error',
    optionC: 'Solution Key',
    optionD: 'Question Paper',
    correctOption: 'B'
  },
  {
    questionOrder: 9,
    questionText: 'I am an event where students show their skills. Coding, quizzes and other competitions may happen here.',
    optionA: 'Tech Fest / Hackathon',
    optionB: 'Sports Day',
    optionC: 'Annual General Meeting',
    optionD: 'Class Lecture',
    correctOption: 'A'
  },
  {
    questionOrder: 10,
    questionText: 'I am given to students to complete within a deadline. It may involve writing, coding or research.',
    optionA: 'Assignment / Project',
    optionB: 'Hall Ticket',
    optionC: 'Attendance Register',
    optionD: 'Degree Certificate',
    correctOption: 'A'
  },
  {
    questionOrder: 11,
    questionText: 'I am a place on campus where students can buy food. You may visit me between classes.',
    optionA: 'College Canteen / Cafeteria',
    optionB: 'Library',
    optionC: 'Principal Office',
    optionD: 'Physics Lab',
    correctOption: 'A'
  },
  {
    questionOrder: 12,
    questionText: 'I contain books and study materials. Students visit me when they need knowledge.',
    optionA: 'Gymnasium',
    optionB: 'Library',
    optionC: 'Auditorium',
    optionD: 'Parking Lot',
    correctOption: 'B'
  },
  {
    questionOrder: 13,
    questionText: 'I have a neck but no head, two arms but no hands, and I may be worn at college events; what am I?',
    optionA: 'Shirt / Blazer',
    optionB: 'Bottle',
    optionC: 'Guitar',
    optionD: 'Backpack',
    correctOption: 'A'
  },
  {
    questionOrder: 14,
    questionText: 'I am not alive, but I grow; I do not have lungs, but I need air; I do not have a mouth, but water kills me; what am I?',
    optionA: 'Fire',
    optionB: 'Plant',
    optionC: 'Cloud',
    optionD: 'Shadow',
    correctOption: 'A'
  },
  {
    questionOrder: 15,
    questionText: 'I am born in a moment, live in memory, and can be destroyed by one careless sentence; what am I?',
    optionA: 'Mirror',
    optionB: 'Trust / Secret',
    optionC: 'Bubble',
    optionD: 'Paper',
    correctOption: 'B'
  },
  {
    questionOrder: 16,
    questionText: 'You can hold me without using your hands, lose me without dropping me, and keep me only by giving me away; what am I?',
    optionA: 'Promise / Word',
    optionB: 'Coin',
    optionC: 'Book',
    optionD: 'Key',
    correctOption: 'A'
  },
  {
    questionOrder: 17,
    questionText: 'I have no beginning, no end, and no middle, yet I can surround a number; what am I?',
    optionA: 'Square',
    optionB: 'Circle / Zero',
    optionC: 'Triangle',
    optionD: 'Line',
    correctOption: 'B'
  },
  {
    questionOrder: 18,
    questionText: 'A room has four corners, and a cat sits in each corner. Each cat sees three cats. How many cats are in the room?',
    optionA: '12',
    optionB: '4',
    optionC: '3',
    optionD: '16',
    correctOption: 'B'
  },
  {
    questionOrder: 19,
    questionText: 'I am the only thing that increases when wasted.',
    optionA: 'Time',
    optionB: 'Waste / Trash',
    optionC: 'Money',
    optionD: 'Energy',
    correctOption: 'B'
  },
  {
    questionOrder: 20,
    questionText: 'I arrive only after I leave.',
    optionA: 'Yesterday',
    optionB: 'Letter / Parcel',
    optionC: 'Echo',
    optionD: 'Shadow',
    correctOption: 'B'
  },
  {
    questionOrder: 21,
    questionText: 'I am a school subject hidden in: CHEMISTRY Remove one letter to get a profession.',
    optionA: 'Chemistry',
    optionB: 'Physics',
    optionC: 'Biology',
    optionD: 'History',
    correctOption: 'A'
  },
  {
    questionOrder: 22,
    questionText: 'I am a subject whose first 3 letters mean possession.',
    optionA: 'Geography',
    optionB: 'History',
    optionC: 'English',
    optionD: 'Civics',
    correctOption: 'B'
  },
  {
    questionOrder: 23,
    questionText: 'I am a subject hidden in: BIOGRAPHY',
    optionA: 'Biology / Bio',
    optionB: 'Maths',
    optionC: 'Physics',
    optionD: 'Chemistry',
    correctOption: 'A'
  },
  {
    questionOrder: 24,
    questionText: 'I am a subject that becomes a country when one letter changes.',
    optionA: 'Drama',
    optionB: 'Maths',
    optionC: 'Hindi',
    optionD: 'Art',
    correctOption: 'B'
  },
  {
    questionOrder: 25,
    questionText: 'I have no value alone, but I can change another digit\'s value. What am I?',
    optionA: 'Zero (0)',
    optionB: 'One (1)',
    optionC: 'Nine (9)',
    optionD: 'Infinity',
    correctOption: 'A'
  },
  {
    questionOrder: 26,
    questionText: 'I am between 1 and 3, but I am not 2. What am I?',
    optionA: 'The word "and"',
    optionB: 'Number 4',
    optionC: 'Number 0',
    optionD: 'Number 5',
    correctOption: 'A'
  },
  {
    questionOrder: 27,
    questionText: 'I am an odd number. Remove one letter and I become even. What am I?',
    optionA: 'Three',
    optionB: 'Seven',
    optionC: 'Nine',
    optionD: 'Eleven',
    correctOption: 'B'
  },
  {
    questionOrder: 28,
    questionText: 'Which number looks almost unchanged when reflected in a mirror?',
    optionA: '7',
    optionB: '8',
    optionC: '3',
    optionD: '4',
    correctOption: 'B'
  },
  {
    questionOrder: 29,
    questionText: 'You are running a race. You overtake the person in second place. What position are you in?',
    optionA: '1st place',
    optionB: '2nd place',
    optionC: '3rd place',
    optionD: 'Last place',
    correctOption: 'B'
  },
  {
    questionOrder: 30,
    questionText: 'You overtake the person in last place. What position are you in?',
    optionA: 'Last place',
    optionB: 'Impossible',
    optionC: '1st place',
    optionD: '2nd place',
    correctOption: 'B'
  }
];

async function importCreativeRiddlesDiplomaSet4() {
  const transaction = await sequelize.transaction();
  try {
    const round = await QuizRound.findByPk(TARGET_ROUND_ID, { transaction });
    if (!round) {
      throw new Error(`Target round not found: ${TARGET_ROUND_ID}`);
    }

    console.log(`Target Round Found: "${round.title}" (ID: ${round.id})`);
    console.log(`Current Status: ${round.status}`);

    const existingCount = await Question.count({ where: { roundId: round.id }, transaction });
    console.log(`Existing Question Count in SET 4: ${existingCount}`);

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
    console.log(`Final Question Count for Creative Riddles 1st Year Diploma SET 4: ${finalCount}`);

  } catch (err) {
    await transaction.rollback();
    console.error('❌ Import failed:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

importCreativeRiddlesDiplomaSet4();
