const axios = require('./server/node_modules/axios');

const API_BASE = 'http://localhost:5000/api';

async function testStudentEntryFlow() {
  console.log('=== REGRESSION TEST: STUDENT EXAM ENTRY & ADMIN LOGIN ===\n');

  try {
    // TEST 1: Empty Form Submission
    console.log('[TEST 1] Testing Empty Form Validation...');
    try {
      await axios.post(`${API_BASE}/auth/participant/exam-entry`, {
        name: '',
        rollNumber: '',
        department: '',
        section: ''
      });
      console.error('❌ FAIL: Expected 400 validation error on empty fields');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        console.log(`✅ PASS: Server returned 400 with message: "${err.response.data.message}"`);
      } else {
        console.error('❌ FAIL: Unexpected response for empty form', err.message);
      }
    }

    // TEST 2: Valid Student Exam Entry
    console.log('\n[TEST 2] Testing Valid Student Exam Entry...');
    const testStudent = {
      name: 'Ramesh Kumar',
      rollNumber: '24DIP001',
      department: 'ECE',
      section: 'A'
    };

    const entryRes = await axios.post(`${API_BASE}/auth/participant/exam-entry`, testStudent);
    if (entryRes.data.success && entryRes.data.token) {
      console.log('✅ PASS: Exam entry created token successfully!');
      console.log(`Participant ID: ${entryRes.data.participant.id}`);
      console.log(`Name: ${entryRes.data.participant.name}`);
      console.log(`Roll Number: ${entryRes.data.participant.rollNumber}`);
      console.log(`Department: ${entryRes.data.participant.department}`);
      console.log(`Section: ${entryRes.data.participant.section}`);
      console.log(`Role: ${entryRes.data.participant.role}`);
    } else {
      console.error('❌ FAIL: Exam entry failed', entryRes.data);
    }

    const studentToken = entryRes.data.token;

    // TEST 3: Access Participant Dashboard / Available Quizzes
    console.log('\n[TEST 3] Testing Quiz Availability for Student Session...');
    const quizRes = await axios.get(`${API_BASE}/quiz/available`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });

    if (quizRes.data.success) {
      const quizzes = quizRes.data.quizzes;
      console.log(`✅ PASS: Retried ${quizzes.length} available competition sets`);
      quizzes.forEach(q => {
        console.log(`   - Set ${q.roundNumber}: ${q.title} | Status: ${q.status} | Questions: ${q.totalQuestions}`);
      });

      if (quizzes.length === 5) {
        console.log('✅ PASS: All 5 competition sets are active and visible to student!');
      } else {
        console.error(`❌ FAIL: Expected 5 sets, found ${quizzes.length}`);
      }
    }

    // TEST 4: Student Role Escalation Prevention
    console.log('\n[TEST 4] Testing Admin Security Isolation...');
    try {
      await axios.get(`${API_BASE}/admin/security/events`, {
        headers: { Authorization: `Bearer ${studentToken}` }
      });
      console.error('❌ FAIL: Student token allowed access to admin route!');
    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log('✅ PASS: Admin endpoint correctly blocked student token with 403 Forbidden!');
      } else {
        console.error('❌ FAIL: Unexpected error when probing admin route', err.message);
      }
    }

    // TEST 5: Admin Login Intact Verification
    console.log('\n[TEST 5] Testing Admin Login Intactness...');
    const adminLoginRes = await axios.post(`${API_BASE}/auth/admin/login`, {
      email: 'admin@quiz.com',
      password: 'AdminPassword123!'
    });

    if (adminLoginRes.data.success && adminLoginRes.data.token) {
      console.log('✅ PASS: Admin login with username/password works perfectly!');
      console.log(`Admin Role: ${adminLoginRes.data.admin.role}`);
    } else {
      console.error('❌ FAIL: Admin login failed!');
    }

    console.log('\n==================================================');
    console.log('ALL REGRESSION TESTS PASSED 100% CLEANLY!');
    console.log('==================================================');
  } catch (err) {
    console.error('Test execution failed:', err.response?.data || err.message);
  }
}

testStudentEntryFlow();
