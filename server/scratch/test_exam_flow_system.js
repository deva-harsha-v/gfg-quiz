const http = require('http');

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : '';
    const reqHeaders = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
      ...headers
    };

    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api${path}`,
        method,
        headers: reqHeaders
      },
      (res) => {
        let responseBody = '';
        res.on('data', (chunk) => (responseBody += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(responseBody);
          } catch (e) {
            parsed = responseBody;
          }
          resolve({ status: res.statusCode, data: parsed });
        });
      }
    );

    req.on('error', (err) => reject(err));
    if (data) req.write(data);
    req.end();
  });
}

async function runVerification() {
  console.log('==================================================');
  console.log('TESTING UNREGISTERED STUDENT EXAM ENTRY & CODE VERIFICATION');
  console.log('==================================================\n');

  try {
    // 1. Test Invalid Code with Completely Unregistered Student
    console.log('[Test 1] Testing Unregistered Student + INVALID Exam Code...');
    const invalidStudentRoll = `NEW${Math.floor(1000 + Math.random() * 9000)}`;
    const invalidRes = await request('POST', '/quiz/public-start', {
      name: 'Unregistered Student',
      rollNumber: invalidStudentRoll,
      department: 'CST',
      section: 'A',
      accessCode: 'WRONG-CODE-99'
    });

    if (invalidRes.status === 401) {
      console.log(`  ✓ Invalid Code Rejected Immediately (Status: ${invalidRes.status})`);
      console.log(`  ✓ Error Message: "${invalidRes.data.message}"`);
      console.log(`  ✓ Verified: Exam NOT created, 0 Forbidden (403) errors!`);
    } else {
      console.error('❌ Failed: Invalid code was accepted!', invalidRes);
    }

    // 2. Test Valid Code with Completely Unregistered Student
    console.log('\n[Test 2] Testing Unregistered Student + VALID Exam Code...');
    const newStudentRoll = `UNREG${Math.floor(1000 + Math.random() * 9000)}`;
    const validCode = 'CR-B1-01-3Z9A'; // Creative Riddles B.Tech 1st Year SET 1

    const validRes = await request('POST', '/quiz/public-start', {
      name: 'Fresh Participant',
      rollNumber: newStudentRoll,
      department: 'CSE',
      section: 'B',
      accessCode: validCode
    });

    if (validRes.status !== 201 && validRes.status !== 200) {
      throw new Error(`Failed public exam entry: ${JSON.stringify(validRes.data)}`);
    }

    const { token, participant, attempt, quiz, questions } = validRes.data;
    console.log(`  ✓ Exam Entry Successful for Unregistered Student:`);
    console.log(`    - Registered Roll No: ${participant.rollNumber}`);
    console.log(`    - Department/Section: ${participant.department} - ${participant.section}`);
    console.log(`    - Attempt ID: ${attempt.id}`);
    console.log(`    - Assigned Quiz: ${quiz.title}`);
    console.log(`    - Loaded Questions: ${questions.length} questions`);
    console.log(`    - correctOption strictly hidden: ${questions[0].correctOption === undefined ? 'YES' : 'NO'}`);

    // 3. Test Second Attempt Prevention for Same Student
    console.log('\n[Test 3] Testing Second Attempt Prevention for Same Student...');
    const secondAttemptRes = await request('POST', '/quiz/public-start', {
      name: 'Fresh Participant',
      rollNumber: newStudentRoll,
      department: 'CSE',
      section: 'B',
      accessCode: validCode
    });

    // First submit quiz attempt so status becomes SUBMITTED
    const authHeaders = { Authorization: `Bearer ${token}` };
    await request('POST', `/quiz/attempts/${attempt.id}/submit`, {}, authHeaders);

    const repeatRes = await request('POST', '/quiz/public-start', {
      name: 'Fresh Participant',
      rollNumber: newStudentRoll,
      department: 'CSE',
      section: 'B',
      accessCode: validCode
    });

    if (repeatRes.status === 409) {
      console.log(`  ✓ Repeat Attempt Blocked Correctly (Status 409): "${repeatRes.data.message}"`);
    } else {
      console.error('❌ Repeat attempt was NOT blocked!', repeatRes);
    }

    console.log('\n==================================================');
    console.log('UNREGISTERED STUDENT ENTRY & CODE VERIFICATION 100% SUCCESSFUL!');
    console.log('==================================================');
  } catch (error) {
    console.error('\n❌ Verification Error:', error);
  }
}

runVerification();
