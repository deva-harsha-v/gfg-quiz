const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 3306;
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'engineers_day_quiz';

// Function to ensure database exists before Sequelize connects
const ensureDatabaseExists = async () => {
  try {
    const connection = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.end();
  } catch (error) {
    // Hosted MySQL providers (Railway, Aiven, AWS RDS) pre-create the DB and restrict CREATE DATABASE privileges.
    console.warn('[Database] Notice: Skipping CREATE DATABASE query (normal for managed cloud databases):', error.message);
  }
};

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const testDatabaseConnection = async () => {
  try {
    await ensureDatabaseExists();
    await sequelize.authenticate();
    console.log(`[Database] MySQL connection established successfully to database "${dbName}"`);
    return { success: true, message: 'Database connection successful' };
  } catch (error) {
    console.error('[Database] Connection failed:', error.message);
    throw error;
  }
};

module.exports = {
  sequelize,
  testDatabaseConnection,
  ensureDatabaseExists
};
