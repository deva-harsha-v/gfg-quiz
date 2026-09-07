const QuizRound = require('../models/QuizRound');

const allRoundsDefinition = [
  // 1. Logical Reasoning - 1st Year Diploma (Rounds 1 - 5)
  { roundNumber: 1, setNumber: 1, title: 'Logical Reasoning - 1st Year Diploma — SET 1', category: 'Logical Reasoning', course: 'Diploma', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Logical Reasoning set 1 for 1st Year Diploma students.' },
  { roundNumber: 2, setNumber: 2, title: 'Logical Reasoning - 1st Year Diploma — SET 2', category: 'Logical Reasoning', course: 'Diploma', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Logical Reasoning set 2 for 1st Year Diploma students.' },
  { roundNumber: 3, setNumber: 3, title: 'Logical Reasoning - 1st Year Diploma — SET 3', category: 'Logical Reasoning', course: 'Diploma', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Logical Reasoning set 3 for 1st Year Diploma students.' },
  { roundNumber: 4, setNumber: 4, title: 'Logical Reasoning - 1st Year Diploma — SET 4', category: 'Logical Reasoning', course: 'Diploma', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Logical Reasoning set 4 for 1st Year Diploma students.' },
  { roundNumber: 5, setNumber: 5, title: 'Logical Reasoning - 1st Year Diploma — SET 5', category: 'Logical Reasoning', course: 'Diploma', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Logical Reasoning set 5 for 1st Year Diploma students.' },

  // 2. Logical Reasoning - B.Tech 1st Year (Rounds 6 - 10)
  { roundNumber: 6, setNumber: 1, title: 'Logical Reasoning - B.Tech 1st Year — SET 1', category: 'Logical Reasoning', course: 'B.Tech', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Logical Reasoning set 1 for B.Tech 1st Year students.' },
  { roundNumber: 7, setNumber: 2, title: 'Logical Reasoning - B.Tech 1st Year — SET 2', category: 'Logical Reasoning', course: 'B.Tech', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Logical Reasoning set 2 for B.Tech 1st Year students.' },
  { roundNumber: 8, setNumber: 3, title: 'Logical Reasoning - B.Tech 1st Year — SET 3', category: 'Logical Reasoning', course: 'B.Tech', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Logical Reasoning set 3 for B.Tech 1st Year students.' },
  { roundNumber: 9, setNumber: 4, title: 'Logical Reasoning - B.Tech 1st Year — SET 4', category: 'Logical Reasoning', course: 'B.Tech', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Logical Reasoning set 4 for B.Tech 1st Year students.' },
  { roundNumber: 10, setNumber: 5, title: 'Logical Reasoning - B.Tech 1st Year — SET 5', category: 'Logical Reasoning', course: 'B.Tech', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Logical Reasoning set 5 for B.Tech 1st Year students.' },

  // 3. Logical Reasoning - B.Tech 2nd Year (Rounds 11 - 15)
  { roundNumber: 11, setNumber: 1, title: 'Logical Reasoning - B.Tech 2nd Year — SET 1', category: 'Logical Reasoning', course: 'B.Tech', year: '2nd Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Logical Reasoning set 1 for B.Tech 2nd Year students.' },
  { roundNumber: 12, setNumber: 2, title: 'Logical Reasoning - B.Tech 2nd Year — SET 2', category: 'Logical Reasoning', course: 'B.Tech', year: '2nd Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Logical Reasoning set 2 for B.Tech 2nd Year students.' },
  { roundNumber: 13, setNumber: 3, title: 'Logical Reasoning - B.Tech 2nd Year — SET 3', category: 'Logical Reasoning', course: 'B.Tech', year: '2nd Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Logical Reasoning set 3 for B.Tech 2nd Year students.' },
  { roundNumber: 14, setNumber: 4, title: 'Logical Reasoning - B.Tech 2nd Year — SET 4', category: 'Logical Reasoning', course: 'B.Tech', year: '2nd Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Logical Reasoning set 4 for B.Tech 2nd Year students.' },
  { roundNumber: 15, setNumber: 5, title: 'Logical Reasoning - B.Tech 2nd Year — SET 5', category: 'Logical Reasoning', course: 'B.Tech', year: '2nd Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Logical Reasoning set 5 for B.Tech 2nd Year students.' },

  // 4. Logical Reasoning - B.Tech 3rd Year (Rounds 16 - 20)
  { roundNumber: 16, setNumber: 1, title: 'Logical Reasoning - B.Tech 3rd Year — SET 1', category: 'Logical Reasoning', course: 'B.Tech', year: '3rd Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Logical Reasoning set 1 for B.Tech 3rd Year students.' },
  { roundNumber: 17, setNumber: 2, title: 'Logical Reasoning - B.Tech 3rd Year — SET 2', category: 'Logical Reasoning', course: 'B.Tech', year: '3rd Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Logical Reasoning set 2 for B.Tech 3rd Year students.' },
  { roundNumber: 18, setNumber: 3, title: 'Logical Reasoning - B.Tech 3rd Year — SET 3', category: 'Logical Reasoning', course: 'B.Tech', year: '3rd Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Logical Reasoning set 3 for B.Tech 3rd Year students.' },
  { roundNumber: 19, setNumber: 4, title: 'Logical Reasoning - B.Tech 3rd Year — SET 4', category: 'Logical Reasoning', course: 'B.Tech', year: '3rd Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Logical Reasoning set 4 for B.Tech 3rd Year students.' },
  { roundNumber: 20, setNumber: 5, title: 'Logical Reasoning - B.Tech 3rd Year — SET 5', category: 'Logical Reasoning', course: 'B.Tech', year: '3rd Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Logical Reasoning set 5 for B.Tech 3rd Year students.' },

  // 5. Creative Riddles - 1st Year Diploma (Rounds 21 - 25)
  { roundNumber: 21, setNumber: 1, title: 'Creative Riddles - 1st Year Diploma — SET 1', category: 'Creative Riddles', course: 'Diploma', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Creative Riddles set 1 for 1st Year Diploma students.' },
  { roundNumber: 22, setNumber: 2, title: 'Creative Riddles - 1st Year Diploma — SET 2', category: 'Creative Riddles', course: 'Diploma', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Creative Riddles set 2 for 1st Year Diploma students.' },
  { roundNumber: 23, setNumber: 3, title: 'Creative Riddles - 1st Year Diploma — SET 3', category: 'Creative Riddles', course: 'Diploma', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Creative Riddles set 3 for 1st Year Diploma students.' },
  { roundNumber: 24, setNumber: 4, title: 'Creative Riddles - 1st Year Diploma — SET 4', category: 'Creative Riddles', course: 'Diploma', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Creative Riddles set 4 for 1st Year Diploma students.' },
  { roundNumber: 25, setNumber: 5, title: 'Creative Riddles - 1st Year Diploma — SET 5', category: 'Creative Riddles', course: 'Diploma', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Creative Riddles set 5 for 1st Year Diploma students.' },

  // 6. Creative Riddles - B.Tech 1st Year (Rounds 26 - 30)
  { roundNumber: 26, setNumber: 1, title: 'Creative Riddles - B.Tech 1st Year — SET 1', category: 'Creative Riddles', course: 'B.Tech', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Creative Riddles set 1 for B.Tech 1st Year students.' },
  { roundNumber: 27, setNumber: 2, title: 'Creative Riddles - B.Tech 1st Year — SET 2', category: 'Creative Riddles', course: 'B.Tech', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Creative Riddles set 2 for B.Tech 1st Year students.' },
  { roundNumber: 28, setNumber: 3, title: 'Creative Riddles - B.Tech 1st Year — SET 3', category: 'Creative Riddles', course: 'B.Tech', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Creative Riddles set 3 for B.Tech 1st Year students.' },
  { roundNumber: 29, setNumber: 4, title: 'Creative Riddles - B.Tech 1st Year — SET 4', category: 'Creative Riddles', course: 'B.Tech', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Creative Riddles set 4 for B.Tech 1st Year students.' },
  { roundNumber: 30, setNumber: 5, title: 'Creative Riddles - B.Tech 1st Year — SET 5', category: 'Creative Riddles', course: 'B.Tech', year: '1st Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Creative Riddles set 5 for B.Tech 1st Year students.' },

  // 7. Creative Riddles - B.Tech 2nd Year (Rounds 31 - 35)
  { roundNumber: 31, setNumber: 1, title: 'Creative Riddles - B.Tech 2nd Year — SET 1', category: 'Creative Riddles', course: 'B.Tech', year: '2nd Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Creative Riddles set 1 for B.Tech 2nd Year students.' },
  { roundNumber: 32, setNumber: 2, title: 'Creative Riddles - B.Tech 2nd Year — SET 2', category: 'Creative Riddles', course: 'B.Tech', year: '2nd Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Creative Riddles set 2 for B.Tech 2nd Year students.' },
  { roundNumber: 33, setNumber: 3, title: 'Creative Riddles - B.Tech 2nd Year — SET 3', category: 'Creative Riddles', course: 'B.Tech', year: '2nd Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Creative Riddles set 3 for B.Tech 2nd Year students.' },
  { roundNumber: 34, setNumber: 4, title: 'Creative Riddles - B.Tech 2nd Year — SET 4', category: 'Creative Riddles', course: 'B.Tech', year: '2nd Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Creative Riddles set 4 for B.Tech 2nd Year students.' },
  { roundNumber: 35, setNumber: 5, title: 'Creative Riddles - B.Tech 2nd Year — SET 5', category: 'Creative Riddles', course: 'B.Tech', year: '2nd Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Creative Riddles set 5 for B.Tech 2nd Year students.' },

  // 8. Creative Riddles - B.Tech 3rd Year (Rounds 36 - 40)
  { roundNumber: 36, setNumber: 1, title: 'Creative Riddles - B.Tech 3rd Year — SET 1', category: 'Creative Riddles', course: 'B.Tech', year: '3rd Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Creative Riddles set 1 for B.Tech 3rd Year students.' },
  { roundNumber: 37, setNumber: 2, title: 'Creative Riddles - B.Tech 3rd Year — SET 2', category: 'Creative Riddles', course: 'B.Tech', year: '3rd Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Creative Riddles set 3 for B.Tech 3rd Year students.' },
  { roundNumber: 38, setNumber: 3, title: 'Creative Riddles - B.Tech 3rd Year — SET 3', category: 'Creative Riddles', course: 'B.Tech', year: '3rd Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Creative Riddles set 3 for B.Tech 3rd Year students.' },
  { roundNumber: 39, setNumber: 4, title: 'Creative Riddles - B.Tech 3rd Year — SET 4', category: 'Creative Riddles', course: 'B.Tech', year: '3rd Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Creative Riddles set 4 for B.Tech 3rd Year students.' },
  { roundNumber: 40, setNumber: 5, title: 'Creative Riddles - B.Tech 3rd Year — SET 5', category: 'Creative Riddles', course: 'B.Tech', year: '3rd Year', duration: 40, totalMarks: 30.00, status: 'ACTIVE', description: 'Creative Riddles set 5 for B.Tech 3rd Year students.' }
];

const createAllRounds = async () => {
  try {
    for (const def of allRoundsDefinition) {
      let r = await QuizRound.findOne({ where: { roundNumber: def.roundNumber } });
      if (!r) {
        r = await QuizRound.findOne({ where: { category: def.category, course: def.course, year: def.year, setNumber: def.setNumber } });
      }
      if (!r) {
        await QuizRound.create(def);
      } else {
        r.category = def.category;
        r.course = def.course;
        r.year = def.year;
        r.setNumber = def.setNumber;
        r.status = 'ACTIVE';
        await r.save();
      }
    }
    console.log('[All Rounds Seeder] Verified all 40 QuizRound records exist in database.');
  } catch (err) {
    console.error('[All Rounds Seeder Error]:', err.message);
  }
};

module.exports = createAllRounds;
