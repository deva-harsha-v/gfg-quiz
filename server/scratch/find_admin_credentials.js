require('dotenv').config({ path: './server/.env' });
const Participant = require('./server/src/models/Participant');

async function checkAdmin() {
  const admins = await Participant.findAll({ where: { role: 'ADMIN' } });
  console.log('Admins found in DB:', admins.map((a) => ({ name: a.name, email: a.email, rollNumber: a.rollNumber })));
  process.exit(0);
}

checkAdmin();
