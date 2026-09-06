require('dotenv').config();
const Participant = require('./src/models/Participant');
const QuizAttempt = require('./src/models/QuizAttempt');
const { Op } = require('sequelize');

async function inspectData() {
  await Participant.sequelize.authenticate();
  console.log('DB connected.');

  const totalParticipants = await Participant.count();
  const adminCount = await Participant.count({ where: { role: 'ADMIN' } });
  const studentCount = await Participant.count({ where: { role: 'PARTICIPANT' } });

  console.log(`Total Participants: ${totalParticipants}`);
  console.log(`Admins: ${adminCount}`);
  console.log(`Students: ${studentCount}`);

  // Fetch sample participants
  const participants = await Participant.findAll({
    limit: 50,
    order: [['createdAt', 'ASC']]
  });

  console.log('\n--- Sample Participants (First 50) ---');
  participants.forEach((p, i) => {
    console.log(`${i + 1}. [${p.role}] Name: "${p.name}", Roll: "${p.rollNumber}", Dept: "${p.department}", Sec: "${p.section}"`);
  });

  const totalAttempts = await QuizAttempt.count();
  console.log(`\nTotal Attempts in DB: ${totalAttempts}`);

  process.exit(0);
}

inspectData();
