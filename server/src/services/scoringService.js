/**
 * Scoring Service for Engineers' Day Quiz Arena
 * Performs server-side scoring, answer evaluation, and total score calculation.
 */

/**
 * Calculates score for an individual question response.
 * @param {Object} question - Question model instance or plain object
 * @param {string} selectedOption - 'A', 'B', 'C', or 'D'
 * @returns {Object} { isCorrect, marksAwarded }
 */
const calculateQuestionScore = (question, selectedOption) => {
  const marks = parseFloat(question.marks || 0);
  const negativeMarks = parseFloat(question.negativeMarks || 0);

  if (!selectedOption || !['A', 'B', 'C', 'D'].includes(selectedOption)) {
    return {
      isCorrect: false,
      marksAwarded: 0
    };
  }

  if (selectedOption === question.correctOption) {
    return {
      isCorrect: true,
      marksAwarded: marks
    };
  } else {
    return {
      isCorrect: false,
      marksAwarded: -negativeMarks
    };
  }
};

/**
 * Calculates complete attempt score across all active questions in the round.
 * @param {Array} activeQuestions - Array of active questions for the round
 * @param {Array|Map} savedAnswers - Array or map of saved QuizAnswer records
 * @returns {Object} { score, totalMarks, answeredCount, correctCount, incorrectCount, unansweredCount }
 */
const calculateAttemptScore = (activeQuestions, savedAnswers) => {
  let totalScore = 0;
  let totalMarks = 0;
  let answeredCount = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  // Build answer lookup map by questionId
  const answerMap = new Map();
  if (Array.isArray(savedAnswers)) {
    savedAnswers.forEach((ans) => {
      if (ans && ans.questionId) {
        answerMap.set(ans.questionId, ans.selectedOption);
      }
    });
  } else if (savedAnswers instanceof Map) {
    savedAnswers.forEach((val, key) => answerMap.set(key, val));
  }

  for (const question of activeQuestions) {
    const qMarks = parseFloat(question.marks || 0);
    totalMarks += qMarks;

    const selectedOption = answerMap.get(question.id);

    if (selectedOption && ['A', 'B', 'C', 'D'].includes(selectedOption)) {
      answeredCount++;
      const { isCorrect, marksAwarded } = calculateQuestionScore(question, selectedOption);
      totalScore += marksAwarded;

      if (isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    } else {
      unansweredCount++;
    }
  }

  // Round score to 2 decimal places
  totalScore = Math.round(totalScore * 100) / 100;
  totalMarks = Math.round(totalMarks * 100) / 100;

  return {
    score: totalScore,
    totalMarks,
    answeredCount,
    correctCount,
    incorrectCount,
    unansweredCount,
    totalQuestions: activeQuestions.length
  };
};

module.exports = {
  calculateQuestionScore,
  calculateAttemptScore
};
