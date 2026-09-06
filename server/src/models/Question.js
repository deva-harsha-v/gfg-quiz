const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const QuizRound = require('./QuizRound');

const Question = sequelize.define(
  'Question',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    roundId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: QuizRound,
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    questionText: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Question text is required' }
      }
    },
    optionA: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Option A is required' }
      }
    },
    optionB: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Option B is required' }
      }
    },
    optionC: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Option C is required' }
      }
    },
    optionD: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Option D is required' }
      }
    },
    correctOption: {
      type: DataTypes.ENUM('A', 'B', 'C', 'D'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['A', 'B', 'C', 'D']],
          msg: 'Correct option must be one of A, B, C, or D'
        }
      }
    },
    marks: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 1.0,
      validate: {
        min: { args: [0.01], msg: 'Marks must be greater than zero' }
      }
    },
    negativeMarks: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      validate: {
        min: { args: [0.0], msg: 'Negative marks cannot be negative' }
      }
    },
    explanation: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    questionOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'Question order must be an integer' },
        min: { args: [1], msg: 'Question order must be at least 1' }
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  },
  {
    tableName: 'questions',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['roundId', 'questionOrder'],
        name: 'unique_round_question_order'
      }
    ]
  }
);

// Define associations
QuizRound.hasMany(Question, {
  foreignKey: 'roundId',
  as: 'questions',
  onDelete: 'CASCADE'
});

Question.belongsTo(QuizRound, {
  foreignKey: 'roundId',
  as: 'round'
});

module.exports = Question;
