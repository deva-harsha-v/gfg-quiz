async function runAllTests() {
  console.log('=== RUNNING ALL 5 REQUIRED TEST CASES ===\n');

  // TEST 1: Valid code LR-DIP-04-UUHH
  console.log('--- TEST 1: Valid Code LR-DIP-04-UUHH ---');
  try {
    const res1 = await fetch('http://localhost:5000/api/quiz/verify-access-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessCode: 'LR-DIP-04-UUHH' })
    });
    const data1 = await res1.json();
    console.log('Verify Status:', res1.status, '| Matched Set:', data1.round?.title, '| Set ID:', data1.round?.id);

    const start1 = await fetch('http://localhost:5000/api/quiz/public-start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Student 1',
        rollNumber: 'ROLL-SET4-01',
        department: 'Diploma',
        section: 'A',
        year: '1st Year',
        accessCode: 'LR-DIP-04-UUHH'
      })
    });
    const startData1 = await start1.json();
    console.log('Start Status:', start1.status, '| Attempt ID:', startData1.attempt?.id, '| Round ID:', startData1.attempt?.roundId, '| Questions Count:', startData1.questions?.length);
    const set4QuestionsMatch = startData1.questions.every(q => q.roundId === '1c876864-78f5-4930-8d9b-3c33d576bffd');
    console.log('SET ISOLATION VERIFIED (All questions belong ONLY to Set 4):', set4QuestionsMatch);
  } catch (e) {
    console.error('Test 1 failed:', e.message);
  }

  // TEST 2: Invalid code INVALID-999
  console.log('\n--- TEST 2: Invalid Code INVALID-999 ---');
  try {
    const res2 = await fetch('http://localhost:5000/api/quiz/verify-access-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessCode: 'INVALID-999' })
    });
    const data2 = await res2.json();
    console.log('Verify Status:', res2.status, '| Message:', data2.message);
  } catch (e) {
    console.error('Test 2 failed:', e.message);
  }

  // TEST 3: Valid code with spaces " LR-DIP-04-UUHH "
  console.log('\n--- TEST 3: Valid Code with spaces " LR-DIP-04-UUHH " ---');
  try {
    const res3 = await fetch('http://localhost:5000/api/quiz/verify-access-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessCode: ' LR-DIP-04-UUHH ' })
    });
    const data3 = await res3.json();
    console.log('Verify Status:', res3.status, '| Matched Set:', data3.round?.title);
  } catch (e) {
    console.error('Test 3 failed:', e.message);
  }

  // TEST 4: Lowercase "lr-dip-04-uuhh"
  console.log('\n--- TEST 4: Lowercase "lr-dip-04-uuhh" ---');
  try {
    const res4 = await fetch('http://localhost:5000/api/quiz/verify-access-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessCode: 'lr-dip-04-uuhh' })
    });
    const data4 = await res4.json();
    console.log('Verify Status:', res4.status, '| Matched Set:', data4.round?.title);
  } catch (e) {
    console.error('Test 4 failed:', e.message);
  }

  // TEST 5: Another valid set code LR-DIP-05-GFMB
  console.log('\n--- TEST 5: Another valid set code LR-DIP-05-GFMB (Set 5) ---');
  try {
    const start5 = await fetch('http://localhost:5000/api/quiz/public-start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Student 5',
        rollNumber: 'ROLL-SET5-01',
        department: 'Diploma',
        section: 'B',
        year: '1st Year',
        accessCode: 'LR-DIP-05-GFMB'
      })
    });
    const startData5 = await start5.json();
    console.log('Start Status:', start5.status, '| Matched Set Title:', startData5.quiz?.title, '| Questions Count:', startData5.questions?.length);
    const set5QuestionsMatch = startData5.questions.every(q => q.roundId === 'e2ca08b7-e189-4bce-b320-477a2a355f57');
    console.log('SET ISOLATION VERIFIED (All questions belong ONLY to Set 5):', set5QuestionsMatch);
  } catch (e) {
    console.error('Test 5 failed:', e.message);
  }
}

runAllTests();
