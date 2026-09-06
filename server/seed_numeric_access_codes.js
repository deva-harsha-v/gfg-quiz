const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { sequelize } = require('./src/config/database');
const QuizRound = require('./src/models/QuizRound');
const { generateUnique4DigitAccessCode } = require('./src/utils/codeGenerator');

const migrateAccessCodes = async () => {
  try {
    console.log('[AccessCode Migration] Authenticating database connection...');
    await sequelize.authenticate();

    const rounds = await QuizRound.findAll({
      order: [['category', 'ASC'], ['course', 'ASC'], ['setNumber', 'ASC']]
    });

    console.log(`[AccessCode Migration] Found ${rounds.length} quiz rounds.`);

    const usedCodes = new Set();
    let count = 0;

    for (const round of rounds) {
      // Regenerate any non-4-digit code or duplicate
      if (!round.accessCode || !/^\d{4}$/.test(round.accessCode) || usedCodes.has(round.accessCode)) {
        const newCode = await generateUnique4DigitAccessCode();
        round.accessCode = newCode;
        await round.save();
        usedCodes.add(newCode);
        count++;
        console.log(`Assigned 4-Digit Code [${newCode}] -> Round #${round.roundNumber} (Set ${round.setNumber}): ${round.title}`);
      } else {
        usedCodes.add(round.accessCode);
        console.log(`Existing 4-Digit Code [${round.accessCode}] -> Round #${round.roundNumber}: ${round.title}`);
      }
    }

    console.log(`\n✅ Migration Complete: Updated ${count} quiz round access codes to 4-digit numeric format.`);
    process.exit(0);
  } catch (err) {
    console.error('[AccessCode Migration Error]:', err);
    process.exit(1);
  }
};

migrateAccessCodes();
