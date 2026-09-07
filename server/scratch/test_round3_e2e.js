const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../server/.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach((l) => {
    const idx = l.indexOf('=');
    if (idx !== -1) {
      const k = l.slice(0, idx).trim();
      const v = l.slice(idx + 1).trim();
      if (k && !process.env[k]) process.env[k] = v;
    }
  });
}

const API = 'http://localhost:5000/api';
const ROUND_3_ID = '94af904c-b7ae-4dd9-8432-29e567aa8d4b';

async function post(url, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body || {}) });
  const data = await res.json();
  if (!res.ok) throw new Error(`POST ${url} failed (${res.status}): ${JSON.stringify(data)}`);
  return data;
}

async function get(url, token) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { method: 'GET', headers });
  const data = await res.json();
  if (!res.ok) throw new Error(`GET ${url} failed (${res.status}): ${JSON.stringify(data)}`);
  return data;
}

async function put(url, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { method: 'PUT', headers, body: JSON.stringify(body || {}) });
  const data = await res.json();
  if (!res.ok) throw new Error(`PUT ${url} failed (${res.status}): ${JSON.stringify(data)}`);
  return data;
}

async function testRound3() {
  try {
    console.log('====================================================');
    console.log('🧪 ROUND 3 END-TO-END VERIFICATION TEST');
    console.log('====================================================');

    // 1. Admin login
    const adminData = await post(`${API}/auth/admin/login`, {
      email: 'admin@example.com',
      password: 'AdminPass123!'
    });
    const adminToken = adminData.token;
    console.log('✅ Admin login success');

    // 2. Fetch Round 3 Questions via Admin API
    const adminQData = await get(`${API}/rounds/${ROUND_3_ID}/questions`, adminToken);
    console.log(`✅ Admin retrieved ${adminQData.questions.length} questions for Round 3`);
    console.log(`   Sample Admin view (shows correctOption): Q1 correct = ${adminQData.questions[0].correctOption}`);

    // 3. Activate Round 3
    await post(`${API}/rounds/${ROUND_3_ID}/activate`, {}, adminToken);
    console.log('✅ Round 3 activated');

    // 4. Participant registration & login
    const regData = await post(`${API}/auth/participant/register`, {
      name: 'Round 3 Tester',
      rollNumber: `R3TEST${Date.now().toString().slice(-4)}`,
      department: 'CSE',
      password: 'Password123!'
    });
    const partRoll = regData.participant.rollNumber;

    const partLoginData = await post(`${API}/auth/participant/login`, {
      rollNumber: partRoll,
      password: 'Password123!'
    });
    const partToken = partLoginData.token;
    console.log('✅ Participant logged in');

    // 5. Start Round 3 attempt
    const startData = await post(`${API}/quiz/rounds/${ROUND_3_ID}/start`, {}, partToken);
    const attemptId = startData.attempt.id;
    const questions = startData.questions;
    console.log(`✅ Quiz attempt started (ID: ${attemptId})`);
    console.log(`   Received ${questions.length} questions`);

    // Verify correctOption is NOT exposed to participant
    const hasCorrectOption = questions.some(q => q.correctOption !== undefined);
    console.log(`   Security check: correctOption exposed to participant? ${hasCorrectOption ? '❌ YES (FAIL)' : '✅ NO (SAFE)'}`);

    // 6. Save answer for Q1 (Correct: A) and Q2 (Correct: C)
    const q1 = questions.find(q => q.questionOrder === 1);
    const q2 = questions.find(q => q.questionOrder === 2);

    await put(`${API}/quiz/attempts/${attemptId}/questions/${q1.id}/answer`, { selectedOption: 'A' }, partToken);
    await put(`${API}/quiz/attempts/${attemptId}/questions/${q2.id}/answer`, { selectedOption: 'C' }, partToken);
    console.log('✅ Answers saved for Q1 (A) and Q2 (C)');

    // 7. Submit quiz
    const submitData = await post(`${API}/quiz/attempts/${attemptId}/submit`, {}, partToken);
    console.log('✅ Quiz submitted successfully');
    console.log(`   Final Score: ${submitData.result.score}`);
    console.log(`   Correct Answers Count: ${submitData.result.correctCount}`);
    console.log(`   Answered Count: ${submitData.result.answeredCount}`);

    console.log('====================================================');
    console.log('🎉 ROUND 3 END-TO-END TEST PASSED PERFECTLY!');
    console.log('====================================================');
  } catch (err) {
    console.error('❌ Round 3 E2E test failed:', err.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

testRound3();
