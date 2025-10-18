const mongoose = require('mongoose');

const QuestionAnswerFeedbackSchema = mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  userAnswer: {
    type: String,
    required: true,
  },
  aiFeedback: {
    type: Object, 
    required: true,
    properties: {
      strengths: { type: String },
      weaknesses: { type: String },
      improvements: { type: String },
      aiSuggestedAnswer: { type: String }, 
      score: { type: Number },
    }
  },
}, {
  timestamps: true, 
});


const InterviewSessionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
      ref: 'User', 
    },
    jobRole: {
      type: String,
      required: true,
    },
    techStack: {
      type: String,
      default: 'General', 
    },
    questionsAndAnswers: [QuestionAnswerFeedbackSchema], 
    totalScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed'], 
      default: 'in-progress',
    },
  },
  {
    timestamps: true, 
  }
);

const InterviewSession = mongoose.model('InterviewSession', InterviewSessionSchema);

module.exports = InterviewSession; 
