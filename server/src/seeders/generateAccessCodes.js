const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { sequelize } = require('../config/database');
const QuizRound = require('../models/QuizRound');
const crypto = require('crypto');

const generateRandomSuffix = (length = 4) => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Exclude ambiguous 0, O, 1, I
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, chars.length);
    result += chars[randomIndex];
  }
  return result;
};

const getCategoryPrefix = (category) => {
  if (category === 'Creative Riddles') return 'CR';
  return 'LR';
};

const getYearGroupPrefix = (course, year) => {
  if (course === 'Diploma') return 'DIP';
  if (year === '1st Year') return 'B1';
  if (year === '2nd Year') return 'B2';
  if (year === '3rd Year') return 'B3';
  return 'GEN';
};

const run = async () => {
  try {
    console.log('[AccessCode Seeder] Initializing database connection...');
    await sequelize.authenticate();

    // Ensure accessCode column exists in MySQL table
    const queryInterface = sequelize.getQueryInterface();
    const tableDescription = await queryInterface.describeTable('quiz_rounds');

    if (!tableDescription.accessCode) {
      console.log('[AccessCode Seeder] Adding accessCode column to quiz_rounds table...');
      await queryInterface.addColumn('quiz_rounds', 'accessCode', {
        type: sequelize.Sequelize.STRING,
        allowNull: true,
        unique: true
      });
      console.log('[AccessCode Seeder] Column accessCode added successfully.');
    }

    // Fetch all quiz rounds
    const rounds = await QuizRound.findAll({
      order: [['category', 'ASC'], ['course', 'ASC'], ['setNumber', 'ASC'], ['roundNumber', 'ASC']]
    });

    console.log(`[AccessCode Seeder] Found ${rounds.length} quiz rounds.`);

    const usedCodes = new Set();
    // First collect existing accessCodes if any
    rounds.forEach((r) => {
      if (r.accessCode) {
        usedCodes.add(r.accessCode);
      }
    });

    let updatedCount = 0;

    for (const round of rounds) {
      if (!round.accessCode) {
        const catPrefix = getCategoryPrefix(round.category);
        const ygPrefix = getYearGroupPrefix(round.course, round.year);
        const setStr = String(round.setNumber || round.roundNumber).padStart(2, '0');

        let code;
        let attempts = 0;
        do {
          const suffix = generateRandomSuffix(4);
          code = `${catPrefix}-${ygPrefix}-${setStr}-${suffix}`;
          attempts++;
        } while (usedCodes.has(code) && attempts < 1000);

        round.accessCode = code;
        await round.save();
        usedCodes.add(code);
        updatedCount++;
        console.log(`Assigned Access Code [${code}] -> Round #${round.roundNumber}: ${round.title}`);
      } else {
        console.log(`Existing Access Code [${round.accessCode}] -> Round #${round.roundNumber}: ${round.title}`);
      }
    }

    // Final verification
    const allRounds = await QuizRound.findAll();
    const allCodes = allRounds.map((r) => r.accessCode).filter(Boolean);
    const uniqueCodesSet = new Set(allCodes);

    console.log('\n================ VERIFICATION SUMMARY ================');
    console.log(`Total Rounds in DB: ${allRounds.length}`);
    console.log(`Total Rounds with Access Codes: ${allCodes.length}`);
    console.log(`Unique Access Codes Count: ${uniqueCodesSet.size}`);

    if (allRounds.length === allCodes.length && allCodes.length === uniqueCodesSet.size) {
      console.log('SUCCESS: All rounds have unique, non-null access codes!');
    } else {
      console.error('ERROR: Mismatch or duplicates detected in access codes!');
    }
    console.log('======================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('[AccessCode Seeder Error]:', err);
    process.exit(1);
  }
};

run();
