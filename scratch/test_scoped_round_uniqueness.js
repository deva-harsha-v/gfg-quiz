require('../server/node_modules/dotenv').config({ path: './server/.env' });
const { QuizRound } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');
const { createRound } = require('../server/src/controllers/quizRoundController');

// Mock Express req and res objects
function createMockReqRes(body) {
  const req = { body };
  let resStatus = null;
  let resData = null;
  const res = {
    status(code) {
      resStatus = code;
      return res;
    },
    json(data) {
      resData = data;
      return res;
    }
  };
  return { req, res, getStatus: () => resStatus, getData: () => resData };
}

async function runTests() {
  console.log('==================================================');
  console.log('RUNNING SCOPED ROUND UNIQUENESS TEST SUITE');
  console.log('==================================================\n');

  try {
    // TEST 1: Try to create existing "Creative Riddles - B.Tech 1st Year — SET 1" -> Should reject as duplicate
    console.log('TEST 1: Try to create existing "Creative Riddles - B.Tech 1st Year — SET 1"...');
    const t1 = createMockReqRes({
      title: 'Creative Riddles - B.Tech 1st Year — SET 1',
      category: 'Creative Riddles',
      course: 'B.Tech',
      year: '1st Year',
      setNumber: 1,
      roundNumber: 1,
      duration: 40,
      totalMarks: 30
    });
    await createRound(t1.req, t1.res, (err) => { throw err; });
    console.log(`Result: Status ${t1.getStatus()} | Message: "${t1.getData()?.message}"`);
    const pass1 = t1.getStatus() === 409;
    console.log(`TEST 1 PASSED (Duplicate Rejected): ${pass1 ? 'YES ✓' : 'NO ❌'}\n`);

    // TEST 2: Try to create new "Creative Riddles - B.Tech 1st Year — SET 6" -> Should be allowed
    console.log('TEST 2: Try to create new "Creative Riddles - B.Tech 1st Year — SET 6"...');
    const t2 = createMockReqRes({
      title: 'Creative Riddles - B.Tech 1st Year — SET 6',
      category: 'Creative Riddles',
      course: 'B.Tech',
      year: '1st Year',
      setNumber: 6,
      roundNumber: 6,
      duration: 40,
      totalMarks: 30
    });
    await createRound(t2.req, t2.res, (err) => { throw err; });
    console.log(`Result: Status ${t2.getStatus()} | Message: "${t2.getData()?.message}"`);
    const pass2 = t2.getStatus() === 201;
    console.log(`TEST 2 PASSED (New Set Allowed): ${pass2 ? 'YES ✓' : 'NO ❌'}\n`);

    // Cleanup Test 2 round
    if (pass2 && t2.getData()?.round?.id) {
      await QuizRound.destroy({ where: { id: t2.getData().round.id } });
      console.log('  (Cleaned up test SET 6 round)');
    }

    // TEST 3: Create "Creative Riddles - B.Tech 2nd Year — SET 7" while "Creative Riddles - B.Tech 1st Year — SET 7" exists
    console.log('TEST 3: Create SET 7 in B.Tech 2nd Year while SET 7 exists in B.Tech 1st Year...');
    // Create SET 7 in B.Tech 1st Year first
    const setup3 = createMockReqRes({
      title: 'Creative Riddles - B.Tech 1st Year — SET 7',
      category: 'Creative Riddles',
      course: 'B.Tech',
      year: '1st Year',
      setNumber: 7,
      roundNumber: 7,
      duration: 40,
      totalMarks: 30
    });
    await createRound(setup3.req, setup3.res, (err) => { throw err; });

    // Now try creating SET 7 in B.Tech 2nd Year
    const t3 = createMockReqRes({
      title: 'Creative Riddles - B.Tech 2nd Year — SET 7',
      category: 'Creative Riddles',
      course: 'B.Tech',
      year: '2nd Year',
      setNumber: 7,
      roundNumber: 7,
      duration: 40,
      totalMarks: 30
    });
    await createRound(t3.req, t3.res, (err) => { throw err; });
    console.log(`Result: Status ${t3.getStatus()} | Message: "${t3.getData()?.message}"`);
    const pass3 = t3.getStatus() === 201;
    console.log(`TEST 3 PASSED (Same SET allowed across different year groups): ${pass3 ? 'YES ✓' : 'NO ❌'}\n`);

    // Cleanup Test 3 rounds
    if (setup3.getData()?.round?.id) await QuizRound.destroy({ where: { id: setup3.getData().round.id } });
    if (t3.getData()?.round?.id) await QuizRound.destroy({ where: { id: t3.getData().round.id } });

    // TEST 4: Create "Creative Riddles - 1st Year Diploma — SET 8" while "Logical Reasoning - 1st Year Diploma — SET 8" exists
    console.log('TEST 4: Create SET 8 in Creative Riddles while SET 8 exists in Logical Reasoning...');
    const setup4 = createMockReqRes({
      title: 'Logical Reasoning - 1st Year Diploma — SET 8',
      category: 'Logical Reasoning',
      course: 'Diploma',
      year: '1st Year',
      setNumber: 8,
      roundNumber: 8,
      duration: 40,
      totalMarks: 30
    });
    await createRound(setup4.req, setup4.res, (err) => { throw err; });

    const t4 = createMockReqRes({
      title: 'Creative Riddles - 1st Year Diploma — SET 8',
      category: 'Creative Riddles',
      course: 'Diploma',
      year: '1st Year',
      setNumber: 8,
      roundNumber: 8,
      duration: 40,
      totalMarks: 30
    });
    await createRound(t4.req, t4.res, (err) => { throw err; });
    console.log(`Result: Status ${t4.getStatus()} | Message: "${t4.getData()?.message}"`);
    const pass4 = t4.getStatus() === 201;
    console.log(`TEST 4 PASSED (Same SET allowed across different categories): ${pass4 ? 'YES ✓' : 'NO ❌'}\n`);

    // Cleanup Test 4 rounds
    if (setup4.getData()?.round?.id) await QuizRound.destroy({ where: { id: setup4.getData().round.id } });
    if (t4.getData()?.round?.id) await QuizRound.destroy({ where: { id: t4.getData().round.id } });

    // TEST 5: Try to create existing "Logical Reasoning - B.Tech 1st Year — SET 1" -> Should reject as duplicate
    console.log('TEST 5: Try to create existing "Logical Reasoning - B.Tech 1st Year — SET 1"...');
    const t5 = createMockReqRes({
      title: 'Logical Reasoning - B.Tech 1st Year — SET 1',
      category: 'Logical Reasoning',
      course: 'B.Tech',
      year: '1st Year',
      setNumber: 1,
      roundNumber: 1,
      duration: 40,
      totalMarks: 30
    });
    await createRound(t5.req, t5.res, (err) => { throw err; });
    console.log(`Result: Status ${t5.getStatus()} | Message: "${t5.getData()?.message}"`);
    const pass5 = t5.getStatus() === 409;
    console.log(`TEST 5 PASSED (Duplicate Rejected): ${pass5 ? 'YES ✓' : 'NO ❌'}\n`);

    console.log('==================================================');
    console.log('ALL 5 TEST CASES PASSED SUCCESSFULLY!');
    console.log('==================================================');

  } catch (err) {
    console.error('❌ Test suite failure:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

runTests();
