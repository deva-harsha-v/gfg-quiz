require('dotenv').config();
const Participant = require('./src/models/Participant');
const { hashPassword } = require('./src/utils/auth');

async function resetAdmin() {
  const hash = await hashPassword('AdminPass123!');
  let admin = await Participant.findOne({ where: { role: 'ADMIN' } });
  if (admin) {
    admin.email = 'admin@example.com';
    admin.passwordHash = hash;
    admin.isActive = true;
    await admin.save();
    console.log('✅ Admin credentials updated: admin@example.com / AdminPass123!');
  } else {
    admin = await Participant.create({
      name: 'Event Administrator',
      rollNumber: 'ADMIN-001',
      department: 'ADMINISTRATION',
      email: 'admin@example.com',
      passwordHash: hash,
      role: 'ADMIN',
      isActive: true
    });
    console.log('✅ Admin user created: admin@example.com / AdminPass123!');
  }
  process.exit(0);
}

resetAdmin();
