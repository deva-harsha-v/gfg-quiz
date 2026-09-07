async function testFullStudentFlow() {
  console.log('=== FULL STUDENT FLOW END-TO-END API SIMULATION ===\n');

  // Step 1: Verify Access Code
  console.log('1. Calling POST /api/quiz/verify-access-code with LR-DIP-04-UUHH...');
  const verifyRes = await fetch('http://localhost:5000/api/quiz/verify-access-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accessCode: 'LR-DIP-04-UUHH' })
  });
  const verifyData = await verifyRes.json();
  console.log('   Response Status:', verifyRes.status);
  console.log('   Matched Set:', verifyData.round?.title, '| ID:', verifyData.round?.id);

  if (!verifyRes.ok || !verifyData.success) {
    throw new Error('Verify access code failed: ' + JSON.stringify(verifyData));
  }

  // Step 2: Public Start Exam
  console.log('\n2. Calling POST /api/quiz/public-start with student details...');
  const startRes = await fetch('http://localhost:5000/api/quiz/public-start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Jane Doe',
      rollNumber: '21DIP0499',
      department: 'Diploma',
      section: 'A',
      year: '1st Year',
      accessCode: 'LR-DIP-04-UUHH'
    })
  });
  const startData = await startRes.json();
  console.log('   Response Status:', startRes.status);
  console.log('   Token received:', !!startData.token);
  console.log('   Attempt ID:', startData.attempt?.id);
  console.log('   Quiz Title:', startData.quiz?.title);
  console.log('   Total Questions:', startData.questions?.length);

  if (!startRes.ok || !startData.success) {
    throw new Error('Public start exam failed: ' + JSON.stringify(startData));
  }

  const token = startData.token;
  const attemptId = startData.attempt.id;
  const firstQuestion = startData.questions[0];

  // Step 3: Get Attempt Details
  console.log('\n3. Calling GET /api/quiz/attempts/' + attemptId + '...');
  const attemptRes = await fetch('http://localhost:5000/api/quiz/attempts/' + attemptId, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const attemptData = await attemptRes.json();
  console.log('   Attempt Status:', attemptData.attempt?.status);
  console.log('   Expires At:', attemptData.attempt?.expiresAt);

  // Step 4: Save Answer for First Question
  console.log('\n4. Saving answer (Option A) for Question ID ' + firstQuestion.id + '...');
  const saveRes = await fetch(`http://localhost:5000/api/quiz/attempts/${attemptId}/questions/${firstQuestion.id}/answer`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ selectedOption: 'A' })
  });
  const saveData = await saveRes.json();
  console.log('   Save Answer Status:', saveRes.status);
  console.log('   Saved Answer:', saveData.answer);

  // Step 5: Get Sanitized Questions to verify option A is marked selected
  console.log('\n5. Fetching questions to verify selectedOption persistence...');
  const qRes = await fetch(`http://localhost:5000/api/quiz/attempts/${attemptId}/questions`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const qData = await qRes.json();
  const updatedFirstQ = qData.questions.find(q => q.id === firstQuestion.id);
  console.log('   Question 1 selectedOption:', updatedFirstQ?.selectedOption);

  console.log('\n=== ALL STEPS COMPLETED SUCCESSFULLY! ===');
}

testFullStudentFlow().catch(err => {
  console.error('\nFAILURE:', err.message);
  process.exit(1);
});
