const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Participant = sequelize.define(
  'Participant',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Name is required' }
      }
    },
    rollNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'unique_roll_number',
        msg: 'A participant with this roll number is already registered.'
      },
      validate: {
        notEmpty: { msg: 'Roll number is required' }
      }
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Department is required' }
      }
    },
    section: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: { msg: 'Invalid email address format' }
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('PARTICIPANT', 'ADMIN'),
      defaultValue: 'PARTICIPANT',
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  },
  {
    tableName: 'participants',
    timestamps: true
  }
);

module.exports = Participant;
