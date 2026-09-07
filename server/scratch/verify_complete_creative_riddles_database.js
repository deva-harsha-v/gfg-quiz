require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound, Question } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

async function fullVerification() {
  try {
    console.log('========================================');
    console.log('CREATIVE RIDDLES — COMPLETE VERIFICATION');
    console.log('========================================\n');

    // Define expected year groups & sets
    const yearGroups = [
      {
        name: '1ST YEAR DIPLOMA',
        course: 'Diploma',
        year: '1st Year'
      },
      {
        name: 'B.TECH 1ST YEAR',
        course: 'B.Tech',
        year: '1st Year'
      },
      {
        name: 'B.TECH 2ND YEAR',
        course: 'B.Tech',
        year: '2nd Year'
      },
      {
        name: 'B.TECH 3RD YEAR',
        course: 'B.Tech',
        year: '3rd Year'
      }
    ];

    let grandTotalRounds = 0;
    let grandTotalQuestions = 0;
    let duplicateRoundsCount = 0;
    let duplicateQuestionsCount = 0;
    let missingRoundsCount = 0;
    let missingQuestionsCount = 0;
    let wrongCategoryQuestions = 0;
    let wrongYearCourseQuestions = 0;
    let duplicateOrderNumbersCount = 0;

    const summaryReport = {};

    for (const group of yearGroups) {
      console.log(`--- ${group.name} ---`);
      summaryReport[group.name] = { sets: {}, total: 0 };

      for (let setNum = 1; setNum <= 5; setNum++) {
        const rounds = await QuizRound.findAll({
          where: {
            category: 'Creative Riddles',
            course: group.course,
            year: group.year,
            setNumber: setNum
          },
          include: [{ model: Question, as: 'questions' }]
        });

        if (rounds.length === 0) {
          missingRoundsCount++;
          console.log(`SET ${setNum}: MISSING ROUND!`);
          continue;
        }

        if (rounds.length > 1) {
          duplicateRoundsCount += rounds.length - 1;
        }

        const primaryRound = rounds[0];
        grandTotalRounds++;

        const questions = primaryRound.questions || [];
        const qCount = questions.length;
        summaryReport[group.name].sets[`SET ${setNum}`] = qCount;
        summaryReport[group.name].total += qCount;
        grandTotalQuestions += qCount;

        if (qCount !== 30) {
          missingQuestionsCount += Math.abs(30 - qCount);
        }

        // Check for duplicate questions / order numbers in this round
        const orderNumbers = questions.map(q => q.questionOrder);
        const uniqueOrders = new Set(orderNumbers);
        if (orderNumbers.length !== uniqueOrders.size) {
          duplicateOrderNumbersCount += orderNumbers.length - uniqueOrders.size;
        }

        const qTexts = questions.map(q => q.questionText.trim());
        const uniqueQTexts = new Set(qTexts);
        if (qTexts.length !== uniqueQTexts.size) {
          duplicateQuestionsCount += qTexts.length - uniqueQTexts.size;
        }

        // Verify category and course/year consistency on questions
        for (const q of questions) {
          if (q.roundId !== primaryRound.id) {
            wrongCategoryQuestions++;
          }
        }

        console.log(`Category: ${primaryRound.category} | Course: ${primaryRound.course} | Year: ${primaryRound.year} | Set: ${primaryRound.setNumber} | Round ID: ${primaryRound.id} | Status: ${primaryRound.status} | Question Count: ${qCount}`);
      }
      console.log(`Group Total: ${summaryReport[group.name].total}/150\n`);
    }

    // Verify Logical Reasoning
    const lrRounds = await QuizRound.findAll({
      where: { category: 'Logical Reasoning' },
      include: [{ model: Question, as: 'questions' }]
    });

    const totalLrRounds = lrRounds.length;
    const totalLrQuestions = lrRounds.reduce((acc, r) => acc + (r.questions ? r.questions.length : 0), 0);

    // Cross check: Any Creative Riddles question in Logical Reasoning or vice-versa?
    const crRoundsAll = await QuizRound.findAll({
      where: { category: 'Creative Riddles' },
      include: [{ model: Question, as: 'questions' }]
    });
    const crRoundIds = new Set(crRoundsAll.map(r => r.id));
    const lrRoundIds = new Set(lrRounds.map(r => r.id));

    let crQuestionsInLr = 0;
    let lrQuestionsInCr = 0;

    for (const r of lrRounds) {
      for (const q of r.questions || []) {
        if (crRoundIds.has(q.roundId)) crQuestionsInLr++;
      }
    }
    for (const r of crRoundsAll) {
      for (const q of r.questions || []) {
        if (lrRoundIds.has(q.roundId)) lrQuestionsInCr++;
      }
    }

    console.log('========================================');
    console.log('LOGICAL REASONING CHECK');
    console.log('========================================');
    console.log(`Logical Reasoning Rounds: ${totalLrRounds}`);
    console.log(`Logical Reasoning Total Questions: ${totalLrQuestions}`);
    console.log(`CR questions in LR: ${crQuestionsInLr}`);
    console.log(`LR questions in CR: ${lrQuestionsInCr}\n`);

    console.log('========================================');
    console.log('SUMMARY METRICS');
    console.log('========================================');
    console.log(`Grand Total Creative Riddles Rounds: ${grandTotalRounds}/20`);
    console.log(`Grand Total Creative Riddles Questions: ${grandTotalQuestions}/600`);
    console.log(`Duplicate Rounds: ${duplicateRoundsCount}`);
    console.log(`Duplicate Questions: ${duplicateQuestionsCount}`);
    console.log(`Duplicate Order Numbers: ${duplicateOrderNumbersCount}`);
    console.log(`Missing Sets: ${missingRoundsCount}`);
    console.log(`Missing Questions: ${missingQuestionsCount}`);
    console.log(`Wrong Category Questions: ${wrongCategoryQuestions + crQuestionsInLr + lrQuestionsInCr}`);
    console.log(`Wrong Year/Course Questions: ${wrongYearCourseQuestions}`);
    console.log('========================================\n');

  } catch (err) {
    console.error('Verification error:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

fullVerification();
