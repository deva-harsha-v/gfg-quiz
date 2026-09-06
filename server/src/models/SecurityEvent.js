const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Participant = require('./Participant');
const QuizAttempt = require('./QuizAttempt');

const SecurityEvent = sequelize.define(
  'SecurityEvent',
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
    participantId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Participant,
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    eventType: {
      type: DataTypes.ENUM(
        'TAB_SWITCH',
        'WINDOW_BLUR',
        'FULLSCREEN_EXIT',
        'MULTIPLE_FOCUS_LOSS',
        'MANUAL_TERMINATION',
        'TIME_EXPIRED'
      ),
      defaultValue: 'TAB_SWITCH',
      allowNull: false
    },
    eventTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true
    }
  },
  {
    tableName: 'security_events',
    timestamps: true,
    indexes: [
      { fields: ['attemptId'], name: 'idx_security_events_attempt_id' },
      { fields: ['participantId'], name: 'idx_security_events_participant_id' },
      { fields: ['eventType'], name: 'idx_security_events_event_type' },
      { fields: ['eventTime'], name: 'idx_security_events_event_time' }
    ]
  }
);

// Define associations
Participant.hasMany(SecurityEvent, {
  foreignKey: 'participantId',
  as: 'securityEvents',
  onDelete: 'CASCADE'
});

SecurityEvent.belongsTo(Participant, {
  foreignKey: 'participantId',
  as: 'participant'
});

QuizAttempt.hasMany(SecurityEvent, {
  foreignKey: 'attemptId',
  as: 'securityEvents',
  onDelete: 'CASCADE'
});

SecurityEvent.belongsTo(QuizAttempt, {
  foreignKey: 'attemptId',
  as: 'attempt'
});

module.exports = SecurityEvent;
