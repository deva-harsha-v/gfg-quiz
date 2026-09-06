const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Participant = require('./Participant');
const QuizRound = require('./QuizRound');

const QuizAttempt = sequelize.define(
  'QuizAttempt',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    participantId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Participant,
        key: 'id'
      },
      onDelete: 'CASCADE'
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
    startedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('IN_PROGRESS', 'SUBMITTED', 'EXPIRED', 'TERMINATED'),
      defaultValue: 'IN_PROGRESS',
      allowNull: false
    },
    score: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0
    },
    totalMarks: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0
    },
    answeredCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    correctCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    incorrectCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    unansweredCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.0
    },
    timeTaken: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Duration in seconds taken to submit or complete exam'
    },
    terminationReason: {
      type: DataTypes.STRING,
      allowNull: true
    },
    examEventKey: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Event identification key (CATEGORY::COURSE::YEAR) for event-scoped one-attempt constraint'
    }
  },
  {
    tableName: 'quiz_attempts',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['participantId', 'roundId'],
        name: 'unique_participant_round_attempt'
      },
      {
        unique: true,
        fields: ['participantId', 'examEventKey'],
        name: 'unique_participant_event_attempt'
      },
      {
        fields: ['roundId', 'status', 'score', 'timeTaken'],
        name: 'idx_round_status_score_time'
      }
    ]
  }
);

// Define associations
Participant.hasMany(QuizAttempt, {
  foreignKey: 'participantId',
  as: 'attempts',
  onDelete: 'CASCADE'
});

QuizAttempt.belongsTo(Participant, {
  foreignKey: 'participantId',
  as: 'participant'
});

QuizRound.hasMany(QuizAttempt, {
  foreignKey: 'roundId',
  as: 'attempts',
  onDelete: 'CASCADE'
});

QuizAttempt.belongsTo(QuizRound, {
  foreignKey: 'roundId',
  as: 'round'
});

module.exports = QuizAttempt;
