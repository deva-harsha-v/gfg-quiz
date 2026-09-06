require('dotenv').config();
const { sequelize } = require('./src/config/database');

async function migrate() {
  try {
    await sequelize.authenticate();
    console.log('[Migration] Database connected.');

    // 1. Add column examEventKey if not exists
    const [cols] = await sequelize.query("SHOW COLUMNS FROM quiz_attempts LIKE 'examEventKey'");
    if (cols.length === 0) {
      console.log('[Migration] Adding examEventKey column to quiz_attempts...');
      await sequelize.query("ALTER TABLE quiz_attempts ADD COLUMN examEventKey VARCHAR(255) NULL COMMENT 'Event identification key (CATEGORY::COURSE::YEAR)';");
    } else {
      console.log('[Migration] Column examEventKey already exists.');
    }

    // 2. Backfill existing attempts with examEventKey from quiz_rounds
    console.log('[Migration] Backfilling examEventKey for existing attempts...');
    await sequelize.query(`
      UPDATE quiz_attempts qa
      JOIN quiz_rounds qr ON qa.roundId = qr.id
      SET qa.examEventKey = UPPER(CONCAT(TRIM(qr.category), '::', TRIM(qr.course), '::', TRIM(qr.year)))
      WHERE qa.examEventKey IS NULL OR qa.examEventKey = '';
    `);

    // 3. Create unique index unique_participant_event_attempt if not exists
    const [indexes] = await sequelize.query("SHOW INDEX FROM quiz_attempts WHERE Key_name = 'unique_participant_event_attempt'");
    if (indexes.length === 0) {
      console.log('[Migration] Creating UNIQUE index unique_participant_event_attempt...');
      await sequelize.query("CREATE UNIQUE INDEX unique_participant_event_attempt ON quiz_attempts (participantId, examEventKey);");
    } else {
      console.log('[Migration] UNIQUE index unique_participant_event_attempt already exists.');
    }

    console.log('[Migration] Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[Migration Error]:', err);
    process.exit(1);
  }
}

migrate();
