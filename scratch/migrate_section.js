require('./server/node_modules/dotenv').config({ path: './server/.env' });
const { sequelize } = require('./server/src/config/database');

async function checkAndMigrateTable() {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL DB.');

    const [columns] = await sequelize.query("DESCRIBE participants;");
    console.log('Current columns in participants table:');
    const colNames = columns.map(c => c.Field);
    console.log(colNames);

    if (!colNames.includes('section')) {
      console.log("Adding 'section' column to participants table...");
      await sequelize.query("ALTER TABLE participants ADD COLUMN section VARCHAR(255) NULL AFTER department;");
      console.log("Successfully added 'section' column.");
    } else {
      console.log("'section' column already exists.");
    }

    // Ensure passwordHash is NULLABLE for passwordless student entry
    const passwordCol = columns.find(c => c.Field === 'passwordHash');
    if (passwordCol && passwordCol.Null === 'NO') {
      console.log("Modifying 'passwordHash' to allow NULL...");
      await sequelize.query("ALTER TABLE participants MODIFY COLUMN passwordHash VARCHAR(255) NULL;");
      console.log("Successfully modified 'passwordHash' to NULLABLE.");
    }
  } catch (err) {
    console.error('Migration Error:', err);
  } finally {
    await sequelize.close();
  }
}

checkAndMigrateTable();
