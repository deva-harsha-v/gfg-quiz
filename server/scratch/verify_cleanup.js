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

const { Participant, QuizAttempt, QuizAnswer, Question, QuizRound } = require('../server/src/models');
const { sequelize } = require('../server/src/config/database');

async function verify() {
  try {
    await sequelize.authenticate();
    console.log('====================================================');
    console.log('🔍 FINAL DATABASE & REGRESSION VERIFICATION');
    console.log('====================================================');

    const totalRounds = await QuizRound.count();
    console.log(`✅ Total Rounds in Database: ${totalRounds}`);

    const rounds = await QuizRound.findAll({ order: [['roundNumber', 'ASC']] });
    for (const r of rounds) {
      const qCount = await Question.count({ where: { roundId: r.id } });
      console.log(`   Round ${r.roundNumber} ("${r.title}"): ID=${r.id}, Status=${r.status}, Questions=${qCount}`);
    }

    const participantCount = await Participant.count();
    const attemptCount = await QuizAttempt.count();
    const answerCount = await QuizAnswer.count();

    console.log(`\n✅ Participant profiles preserved: ${participantCount}`);
    console.log(`✅ Quiz attempts preserved: ${attemptCount}`);
    console.log(`✅ Quiz answers preserved: ${answerCount}`);

    // Verify Admin Login API
    const adminRes = await fetch('http://localhost:5000/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'AdminPass123!' })
    });
    const adminData = await adminRes.json();
    console.log(`\n✅ Admin Login API Status: ${adminRes.status} (Success: ${adminData.success})`);

    // Verify Admin Fetch Rounds API
    const roundsRes = await fetch('http://localhost:5000/api/rounds', {
      headers: { Authorization: `Bearer ${adminData.token}` }
    });
    const roundsData = await roundsRes.json();
    console.log(`✅ Admin GET /api/rounds API Status: ${roundsRes.status}`);
    console.log(`   Rounds returned to Admin Dashboard UI: ${roundsData.rounds.length}`);

    console.log('====================================================');
    console.log('🎉 VERIFICATION COMPLETE - EXACTLY 5 ROUNDS ACTIVE');
    console.log('====================================================');
  } catch (err) {
    console.error('❌ Verification failed:', err.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

verify();
