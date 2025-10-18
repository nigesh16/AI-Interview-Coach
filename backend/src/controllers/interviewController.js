const InterviewSession = require('../models/InterviewSession');
const asyncHandler = require('express-async-handler');


const callGeminiAPI = async (prompt, schema = null) => {
  let chatHistory = [];
  chatHistory.push({ role: "user", parts: [{ text: prompt }] });

  let payload = { contents: chatHistory };
  if (schema) {
    payload.generationConfig = {
      responseMimeType: "application/json",
      responseSchema: schema
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
  }
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || `API error: ${response.status}`);
    }

    const result = await response.json();
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      const text = result.candidates[0].content.parts[0].text;
      return schema ? JSON.parse(text) : text;
    } else {
      throw new Error("Unexpected API response structure or no content from Gemini.");
    }
  } catch (err) {
    console.error("Error calling Gemini API:", err);
    throw new Error(`Failed to fetch AI response: ${err.message}`);
  }
};


const generateQuestions = asyncHandler(async (req, res) => {
  const { jobRole, techStack, numQuestions } = req.body;
  const user = req.user._id;

  if (!jobRole) {
    res.status(400);
    throw new Error('Please provide a job role.');
  }

  const questionsToGenerate = parseInt(numQuestions) || 5;
  if (questionsToGenerate < 1 || questionsToGenerate > 15) {
    res.status(400);
    throw new Error('Number of questions must be between 1 and 15.');
  }

  const prompt = `Generate ${questionsToGenerate} common interview questions for a "${jobRole}" position.
                  ${techStack ? `Focus on the "${techStack}" tech stack.` : ''}
                  Format them as a JSON array of strings.`;

  const questionSchema = {
    type: "ARRAY",
    items: { type: "STRING" }
  };

  try {
    const questions = await callGeminiAPI(prompt, questionSchema);

    if (!questions || questions.length === 0) {
      res.status(500);
      throw new Error('AI could not generate questions. Please try again.');
    }

    const session = await InterviewSession.create({
      user,
      jobRole,
      techStack: techStack || 'General',
    });

    res.status(200).json({ sessionId: session._id, questions });
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ message: error.message || 'Server error generating questions.' });
  }
});


const submitAnswerAndGetFeedback = asyncHandler(async (req, res) => {
  const { sessionId, question, userAnswer, jobRole } = req.body;
  const user = req.user._id;

  if (!sessionId || !question || !userAnswer || !jobRole) {
    res.status(400);
    throw new Error('Session ID, question, user answer, and job role are required.');
  }

  const session = await InterviewSession.findById(sessionId);

  if (!session || session.user.toString() !== user.toString()) {
    res.status(404);
    throw new Error('Interview session not found or unauthorized.');
  }

  const feedbackPrompt = `You are an interview coach providing constructive feedback.
        Job Role: ${jobRole}
        Question: "${question}"
        User's Answer: "${userAnswer}"

        Evaluate the user's answer. Provide:
        1. Strengths: What was good about the answer.
        2. Weaknesses: Areas for improvement.
        3. Improvements: Specific suggestions for how to improve the answer.
        4. AI Suggested Answer: A concise example of how an AI would ideally answer this question.
        5. Score: A numerical score out of 10 for the user's answer.

        Format the feedback as a JSON object with keys: 'strengths', 'weaknesses', 'improvements', 'aiSuggestedAnswer', 'score'.`;

  const feedbackSchema = {
    type: "OBJECT",
    properties: {
      strengths: { type: "STRING" },
      weaknesses: { type: "STRING" },
      improvements: { type: "STRING" },
      aiSuggestedAnswer: { type: "STRING" },
      score: { type: "NUMBER" }
    },
    required: ["strengths", "weaknesses", "improvements", "aiSuggestedAnswer", "score"]
  };

  try {
    const aiFeedback = await callGeminiAPI(feedbackPrompt, feedbackSchema);

    if (!aiFeedback) {
      res.status(500);
      throw new Error('AI could not generate feedback.');
    }

    session.questionsAndAnswers.push({
      question,
      userAnswer,
      aiFeedback,
    });

    session.totalScore += aiFeedback.score || 0;

    await session.save();

    res.status(200).json({ aiFeedback });
  } catch (error) {
    console.error('Error submitting answer and getting feedback:', error);
    res.status(500).json({ message: error.message || 'Server error processing answer and feedback.' });
  }
});


const getInterviewSessions = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const sessions = await InterviewSession.find({ user }).sort({ createdAt: -1 });
  res.status(200).json(sessions);
});


const completeSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const user = req.user._id;

  const session = await InterviewSession.findById(sessionId);

  if (!session || session.user.toString() !== user.toString()) {
    res.status(404);
    throw new Error('Interview session not found or unauthorized.');
  }

  session.status = 'completed';
  await session.save();

  res.status(200).json({ message: 'Interview session marked as completed.' });
});

// @desc    Delete an interview session
// @route   DELETE /api/interview/sessions/:sessionId
// @access  Private
const deleteSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const user = req.user._id; 

  const session = await InterviewSession.findById(sessionId);

  if (!session) {
    res.status(404);
    throw new Error('Interview session not found.');
  }

  if (session.user.toString() !== user.toString()) {
    res.status(403); 
    throw new Error('Not authorized to delete this session.');
  }

  await InterviewSession.deleteOne({ _id: sessionId }); 

  res.status(200).json({ message: 'Interview session deleted successfully.' });
});


module.exports = {
  generateQuestions,
  submitAnswerAndGetFeedback,
  getInterviewSessions,
  completeSession,
  deleteSession 
};
