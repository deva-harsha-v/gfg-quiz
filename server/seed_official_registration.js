require('dotenv').config();
const { sequelize } = require('./src/config/database');
const Participant = require('./src/models/Participant');
const QuizAttempt = require('./src/models/QuizAttempt');
const QuizAnswer = require('./src/models/QuizAnswer');
const { Op } = require('sequelize');

async function seedOfficialRegistration() {
  try {
    await sequelize.authenticate();
    console.log('[Official Seeder] Database connected.');

    // 1. Ensure isOfficial column exists in participants
    const [cols] = await sequelize.query("SHOW COLUMNS FROM participants LIKE 'isOfficial'");
    if (cols.length === 0) {
      console.log('[Official Seeder] Adding isOfficial column to participants...');
      await sequelize.query("ALTER TABLE participants ADD COLUMN isOfficial TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Flag for official registered members';");
    }

    // 2. Clean up test/diagnostic records created during testing
    console.log('[Official Seeder] Purging test and diagnostic participants/attempts...');
    const testPatterns = [
      'PERF_%', 'P5_%', 'P6_%', 'AUDIT_%', 'AUD-%', 'CON-%', 'STU-%',
      'R-SYS-%', 'R-TIE-%', 'VERIFY_%', 'CC-%', 'PART-%', 'EXAM_%',
      'R2TEST%', 'R3TEST%', 'R4TEST%', 'TEST-%', 'FLOW%', 'UNREG%', 'P3715%'
    ];

    const testWhere = {
      role: 'PARTICIPANT',
      [Op.or]: [
        ...testPatterns.map((pat) => ({ rollNumber: { [Op.like]: pat } })),
        { name: { [Op.like]: 'Alice%' } },
        { name: { [Op.like]: 'Concurrent%' } },
        { name: { [Op.like]: 'Perf Student%' } },
        { name: { [Op.like]: 'Audit Student%' } },
        { name: { [Op.like]: 'Test Participant%' } },
        { name: { [Op.like]: 'Security Test%' } }
      ]
    };

    const testParticipants = await Participant.findAll({ where: testWhere });
    const testParticipantIds = testParticipants.map((p) => p.id);

    if (testParticipantIds.length > 0) {
      console.log(`[Official Seeder] Found ${testParticipantIds.length} test participant records to clean up.`);
      const testAttempts = await QuizAttempt.findAll({ where: { participantId: { [Op.in]: testParticipantIds } } });
      const testAttemptIds = testAttempts.map((a) => a.id);

      if (testAttemptIds.length > 0) {
        await QuizAnswer.destroy({ where: { attemptId: { [Op.in]: testAttemptIds } } });
        await QuizAttempt.destroy({ where: { id: { [Op.in]: testAttemptIds } } });
        console.log(`[Official Seeder] Purged ${testAttemptIds.length} test attempts.`);
      }
      await Participant.destroy({ where: { id: { [Op.in]: testParticipantIds } } });
      console.log(`[Official Seeder] Purged ${testParticipantIds.length} test participants.`);
    }

    // 3. Seed Official 150 Registered Students for Engineers' Day Quiz Arena
    console.log('[Official Seeder] Seeding 150 official registered students...');
    const departments = ['CST', 'CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'Diploma'];
    const sections = ['A', 'B', 'C', 'D'];
    const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

    const officialStudents = [
      { name: 'Venkata Ramana', rollNumber: '23CST043', department: 'CST', section: 'A', year: '3rd Year' },
      { name: 'Ravi Kumar', rollNumber: '23CST044', department: 'CST', section: 'A', year: '3rd Year' },
      { name: 'Sita Lakshmi', rollNumber: '23CST045', department: 'CST', section: 'A', year: '3rd Year' },
      { name: 'Ramesh Kumar', rollNumber: '24DIP001', department: 'ECE', section: 'A', year: '1st Year' },
      { name: 'Jane Doe', rollNumber: '21DIP0499', department: 'Diploma', section: 'A', year: '1st Year' },
      { name: 'Venkata Ramana', rollNumber: '23A81A0001', department: 'CSE', section: 'A', year: '2nd Year' }
    ];

    // Generate 150 official registered roll numbers (23CST001 to 23CST150)
    for (let i = 1; i <= 150; i++) {
      const roll = `23CST${String(i).padStart(3, '0')}`;
      if (!officialStudents.some((s) => s.rollNumber === roll)) {
        const dept = departments[i % departments.length];
        const sec = sections[i % sections.length];
        const yr = years[i % years.length];
        officialStudents.push({
          name: `Official Student ${i}`,
          rollNumber: roll,
          department: dept,
          section: sec,
          year: yr
        });
      }
    }

    for (const student of officialStudents) {
      const normalizedRoll = student.rollNumber.trim().toUpperCase();
      let existing = await Participant.findOne({
        where: sequelize.where(
          sequelize.fn('UPPER', sequelize.fn('TRIM', sequelize.col('rollNumber'))),
          normalizedRoll
        )
      });

      if (existing) {
        existing.name = student.name;
        existing.department = student.department;
        existing.section = student.section;
        existing.role = 'PARTICIPANT';
        existing.isOfficial = true;
        existing.isActive = true;
        await existing.save();
      } else {
        await Participant.create({
          name: student.name,
          rollNumber: normalizedRoll,
          department: student.department,
          section: student.section,
          role: 'PARTICIPANT',
          isOfficial: true,
          isActive: true
        });
      }
    }

    const finalOfficialCount = await Participant.count({ where: { role: 'PARTICIPANT', isOfficial: true } });
    console.log(`[Official Seeder] Successfully configured ${finalOfficialCount} official registered students in DB.`);
    process.exit(0);
  } catch (err) {
    console.error('[Official Seeder Error]:', err);
    process.exit(1);
  }
}

seedOfficialRegistration();
