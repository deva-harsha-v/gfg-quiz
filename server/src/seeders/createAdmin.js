const Participant = require('../models/Participant');
const { hashPassword } = require('../utils/auth');

const seedAdmin = async () => {
  try {
    const adminName = process.env.ADMIN_NAME || 'Event Administrator';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass123!';
    const adminRoll = 'ADMIN-001';

    // Check if any ADMIN exists
    const existingAdmin = await Participant.findOne({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      console.log(`[Admin Seeder] Admin user already exists: ${existingAdmin.email || existingAdmin.name}`);
      return existingAdmin;
    }

    const passwordHash = await hashPassword(adminPassword);

    const newAdmin = await Participant.create({
      name: adminName,
      rollNumber: adminRoll,
      department: 'ADMINISTRATION',
      email: adminEmail,
      phone: '0000000000',
      passwordHash,
      role: 'ADMIN',
      isActive: true
    });

    console.log(`[Admin Seeder] Admin user created successfully (${newAdmin.email})`);
    return newAdmin;
  } catch (error) {
    console.error('[Admin Seeder Error]:', error.message);
  }
};

module.exports = seedAdmin;
