require('dotenv').config({ path: 'server/.env' });
const { Participant } = require('./server/src/models');
const { generateToken } = require('./server/src/utils/auth');
const http = require('http');

async function testAdmin() {
  const admin = await Participant.findOne({ where: { role: 'ADMIN' } });
  console.log('Found admin:', admin ? admin.email : 'None');
  if (admin) {
    const token = generateToken({ id: admin.id, role: 'ADMIN' });
    
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/rounds',
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        const parsed = JSON.parse(body);
        console.log(`Fetched ${parsed.rounds?.length} rounds from API!`);
        console.log('First 3 rounds accessCodes:');
        parsed.rounds.slice(0, 3).forEach(r => {
          console.log(`- SET ${r.setNumber || r.roundNumber} (${r.category} ${r.course} ${r.year}) -> AccessCode: ${r.accessCode}`);
        });
        process.exit(0);
      });
    });
    req.end();
  }
}

testAdmin();
