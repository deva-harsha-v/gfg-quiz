require('dotenv').config();
const Participant = require('./src/models/Participant');

async function inspectStudents() {
  await Participant.sequelize.authenticate();

  // Find participants whose rollNumber does NOT start with test prefixes
  const { Op } = require('sequelize');
  const genuineStudents = await Participant.findAll({
    where: {
      role: 'PARTICIPANT',
      [Op.and]: [
        { rollNumber: { [Op.notLike]: 'TEST%' } },
        { rollNumber: { [Op.notLike]: 'P5_%' } },
        { rollNumber: { [Op.notLike]: 'P6_%' } },
        { rollNumber: { [Op.notLike]: 'PERF_%' } },
        { rollNumber: { [Op.notLike]: 'AUDIT_%' } },
        { rollNumber: { [Op.notLike]: 'AUD-%' } },
        { rollNumber: { [Op.notLike]: 'CON-%' } },
        { rollNumber: { [Op.notLike]: 'STU-%' } },
        { rollNumber: { [Op.notLike]: 'R-SYS-%' } },
        { rollNumber: { [Op.notLike]: 'R-TIE-%' } },
        { rollNumber: { [Op.notLike]: 'VERIFY_%' } },
        { rollNumber: { [Op.notLike]: 'CC-%' } },
        { rollNumber: { [Op.notLike]: 'PART-%' } },
        { rollNumber: { [Op.notLike]: 'EXAM_%' } },
        { rollNumber: { [Op.notLike]: 'R2TEST%' } },
        { rollNumber: { [Op.notLike]: 'R3TEST%' } },
        { rollNumber: { [Op.notLike]: 'R4TEST%' } },
        { name: { [Op.notLike]: 'Alice%' } },
        { name: { [Op.notLike]: 'Concurrent%' } }
      ]
    }
  });

  console.log(`Genuine registered students count: ${genuineStudents.length}`);
  genuineStudents.forEach((s) => {
    console.log(`- ${s.name} (${s.rollNumber}) | Dept: ${s.department} | Sec: ${s.section}`);
  });

  process.exit(0);
}

inspectStudents();
