const crypto = require('crypto');
const QuizRound = require('../models/QuizRound');

/**
 * Generates a random 4-digit numeric string ('0000' - '9999') that is unique among active QuizRound access codes.
 */
const generateUnique4DigitAccessCode = async () => {
  let code;
  let attempts = 0;
  const maxAttempts = 10000;

  do {
    // Generate random integer between 0 and 9999
    const randomInt = crypto.randomInt(0, 10000);
    code = String(randomInt).padStart(4, '0');
    attempts++;

    // Check if code is already assigned to a QuizRound
    const existing = await QuizRound.findOne({ where: { accessCode: code } });
    if (!existing) {
      return code;
    }
  } while (attempts < maxAttempts);

  throw new Error('Unable to generate a unique 4-digit access code. Code pool exhausted.');
};

module.exports = {
  generateUnique4DigitAccessCode
};
