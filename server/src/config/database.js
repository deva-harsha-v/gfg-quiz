const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Support Railway connection URLs (MYSQL_URL, DATABASE_URL, MYSQL_PUBLIC_URL) or native variable names (MYSQLHOST, DB_HOST, etc.)
const databaseUrl = process.env.MYSQL_URL || process.env.DATABASE_URL || process.env.MYSQL_PUBLIC_URL;

const dbHost = process.env.DB_HOST || process.env.MYSQLHOST || process.env.MYSQL_HOST || 'localhost';
const dbPort = process.env.DB_PORT || process.env.MYSQLPORT || process.env.MYSQL_PORT || 3306;
const dbUser = process.env.DB_USER || process.env.MYSQLUSER || process.env.MYSQL_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || '';
const dbName = process.env.DB_NAME || process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'engineers_day_quiz';

// Function to ensure database exists before Sequelize connects (for local dev)
const ensureDatabaseExists = async () => {
  if (databaseUrl) return; // Hosted connection string provided, database already exists
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
    // Managed cloud DBs pre-create the DB and restrict CREATE DATABASE privileges
    console.warn('[Database] Notice: Skipping CREATE DATABASE query (normal for cloud databases):', error.message);
  }
};

let sequelize;

if (databaseUrl) {
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
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
}

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
