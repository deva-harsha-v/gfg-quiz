const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const QuizRound = sequelize.define(
  'QuizRound',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Round title is required' }
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Logical Reasoning'
    },
    course: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Diploma'
    },
    year: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '1st Year'
    },
    setNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    roundNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'Round number must be an integer' },
        min: { args: [1], msg: 'Round number must be greater than zero' }
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'Duration must be an integer (in minutes)' },
        min: { args: [1], msg: 'Duration must be at least 1 minute' }
      }
    },
    totalMarks: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 100.0,
      validate: {
        min: { args: [0], msg: 'Total marks cannot be negative' }
      }
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED'),
      defaultValue: 'DRAFT',
      allowNull: false
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    accessCode: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    }
  },
  {
    tableName: 'quiz_rounds',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['category', 'course', 'year', 'setNumber'],
        name: 'unique_category_course_year_set'
      }
    ]
  }
);

module.exports = QuizRound;
