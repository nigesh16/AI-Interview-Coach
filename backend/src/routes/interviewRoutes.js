// routes/interviewRoutes.js

const express = require('express');
const { protect } = require('../middleware/authMiddleware'); // Import the JWT protection middleware
const {
  generateQuestions,
  submitAnswerAndGetFeedback,
  getInterviewSessions,
  completeSession,
  deleteSession
} = require('../controllers/interviewController'); // Import controller functions

const router = express.Router(); // Create an Express router

// All routes defined here will be protected by the 'protect' middleware
// Ensure this line specifically is present and correct for the generate-questions route
router.route('/generate-questions').post(protect, generateQuestions);
router.route('/submit-answer').post(protect, submitAnswerAndGetFeedback);
router.route('/sessions').get(protect, getInterviewSessions);
router.route('/complete-session/:sessionId').put(protect, completeSession);
router.route('/sessions/:sessionId').delete(protect, deleteSession);

module.exports = router; // Export the router