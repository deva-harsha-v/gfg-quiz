const path = require('path');
const { Sequelize } = require(path.join(__dirname, '../server/node_modules/sequelize'));
require(path.join(__dirname, '../server/node_modules/dotenv')).config({ path: path.join(__dirname, '../server/.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME || 'engineers_day_quiz',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false
  }
);

async function updateTitles() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    for (let num = 1; num <= 5; num++) {
      await sequelize.query(
        `UPDATE quiz_rounds SET title = :title WHERE roundNumber = :num`,
        { replacements: { title: `Set ${num}`, num } }
      );
      console.log(`Updated Round #${num} title to "Set ${num}".`);
    }

    console.log('All 5 round titles updated successfully.');
  } catch (err) {
    console.error('Update failed:', err);
  } finally {
    await sequelize.close();
  }
}

updateTitles();
