const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const QuizAttempt = require('./QuizAttempt');
const Question = require('./Question');

const QuizAnswer = sequelize.define(
  'QuizAnswer',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    attemptId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: QuizAttempt,
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    questionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Question,
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    selectedOption: {
      type: DataTypes.ENUM('A', 'B', 'C', 'D'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['A', 'B', 'C', 'D']],
          msg: 'Selected option must be one of A, B, C, or D'
        }
      }
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    marksAwarded: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0
    },
    answeredAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'quiz_answers',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['attemptId', 'questionId'],
        name: 'unique_attempt_question_answer'
      }
    ]
  }
);

// Define associations
QuizAttempt.hasMany(QuizAnswer, {
  foreignKey: 'attemptId',
  as: 'answers',
  onDelete: 'CASCADE'
});

QuizAnswer.belongsTo(QuizAttempt, {
  foreignKey: 'attemptId',
  as: 'attempt'
});

Question.hasMany(QuizAnswer, {
  foreignKey: 'questionId',
  as: 'answers',
  onDelete: 'CASCADE'
});

QuizAnswer.belongsTo(Question, {
  foreignKey: 'questionId',
  as: 'question'
});

module.exports = QuizAnswer;
