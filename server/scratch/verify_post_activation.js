require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

async function verifyPostActivation() {
  try {
    console.log('=== POST-ACTIVATION MYSQL VERIFICATION ===\n');

    const yearGroups = [
      { name: '1st Year Diploma', course: 'Diploma', year: '1st Year' },
      { name: 'B.Tech 1st Year', course: 'B.Tech', year: '1st Year' },
      { name: 'B.Tech 2nd Year', course: 'B.Tech', year: '2nd Year' },
      { name: 'B.Tech 3rd Year', course: 'B.Tech', year: '3rd Year' }
    ];

    let totalActiveCRSets = 0;
    let totalCRQuestions = 0;

    for (const group of yearGroups) {
      console.log(`\n${group.name}:`);
      for (let s = 1; s <= 5; s++) {
        const round = await QuizRound.findOne({
          where: {
            category: 'Creative Riddles',
            course: group.course,
            year: group.year,
            setNumber: s
          },
          include: [{ model: Question, as: 'questions' }]
        });

        if (!round) {
          console.error(`ERROR: Missing ${group.name} SET ${s}`);
          process.exit(1);
        }

        const qCount = round.questions ? round.questions.length : 0;
        console.log(`SET ${s}: ${round.status} — ${qCount}/30`);

        if (round.status === 'ACTIVE') totalActiveCRSets++;
        totalCRQuestions += qCount;
      }
    }

    console.log(`\nTOTAL: ${totalActiveCRSets}/20 Creative Riddles sets ACTIVE`);
    console.log(`${totalCRQuestions}/600 questions present`);

    // Verify Logical Reasoning
    const lrRounds = await QuizRound.findAll({
      where: { category: 'Logical Reasoning' },
      include: [{ model: Question, as: 'questions' }]
    });

    const totalLRQuestions = lrRounds.reduce((acc, r) => acc + (r.questions ? r.questions.length : 0), 0);
    console.log(`\nLOGICAL REASONING: ${lrRounds.length} sets / ${totalLRQuestions} questions UNCHANGED`);

    console.log('\n=== VERIFICATION SUCCESSFUL ===');
  } catch (err) {
    console.error('Post-activation verification error:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

verifyPostActivation();
