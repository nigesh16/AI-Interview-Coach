
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Play, Check, RefreshCcw, History } from 'lucide-react'; 

const API_BASE_URL = 'https://ai-interview-app-pwdb.onrender.com/api/interview';


const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

const Dashboard = () => {
  const [jobRole, setJobRole] = useState('');
  const [techStack, setTechStack] = useState('');
  const [numQuestions, setNumQuestions] = useState(5); 
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [aiFeedback, setAiFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null); 
  const navigate = useNavigate();

  
  const startInterview = async () => {
    if (!jobRole.trim()) {
      setError("Please enter a job role.");
      return;
    }
   
    if (isNaN(numQuestions) || numQuestions < 1 || numQuestions > 10) {
      setError("Please enter a number of questions between 1 and 10.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setInterviewQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setAiFeedback(null);
    setSessionId(null); 

   

    try {
      const response = await axios.post(
        `${API_BASE_URL}/generate-questions`,
        { jobRole, techStack, numQuestions },
        getAuthHeaders()
      );
      setInterviewQuestions(response.data.questions);
      setSessionId(response.data.sessionId); 
    } catch (err) {
      console.error('Error generating questions (frontend):', err);
      console.error('Error response data:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to generate questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  
  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      setError("Please type your answer before submitting.");
      return;
    }
    if (!sessionId) {
      setError("No active interview session. Please start a new interview.");
      return;
    }

    setIsLoading(true);
    setError(null);
    const currentQuestion = interviewQuestions[currentQuestionIndex];


    try {
      const response = await axios.post(
        `${API_BASE_URL}/submit-answer`,
        { sessionId, question: currentQuestion, userAnswer, jobRole, techStack },
        getAuthHeaders()
      );
      setAiFeedback(response.data.aiFeedback);
    } catch (err) {
      console.error('Error submitting answer (frontend):', err);
      console.error('Error response data:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to get feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const nextQuestion = async () => {
    if (!aiFeedback) {
      setError("Please submit your answer and get feedback before moving to the next question.");
      return;
    }
    if (currentQuestionIndex === interviewQuestions.length - 1) {
      try {
        await axios.put(`${API_BASE_URL}/complete-session/${sessionId}`, {}, getAuthHeaders());
      } catch (err) {
        console.error('Error completing session (frontend):', err.response?.data?.message || err.message);
        setError('Failed to mark session as completed.');
      }
      resetInterview();
    } else {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setUserAnswer('');
      setAiFeedback(null);
      setError(null);
    }
  };

  const resetInterview = () => {
    setJobRole('');
    setTechStack('');
    setNumQuestions(5); 
    setInterviewQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setAiFeedback(null);
    setIsLoading(false);
    setError(null);
    setSessionId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 to-purple-900 text-white font-inter p-4 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 border border-gray-700 mt-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-300">
            AI Interview Coach
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded-md mb-4 text-center">
            {error}
          </div>
        )}

        {/* New Interview / Input Section */}
        {!sessionId && (
          <div className="mb-8 p-4 bg-gray-700 rounded-lg">
            <h2 className="text-2xl font-bold text-purple-300 mb-4">Start a New Interview</h2>
            <input
              type="text"
              className="w-full p-3 rounded-md bg-gray-600 border border-gray-500 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
              placeholder="Enter Job Role (e.g., Software Engineer)"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              disabled={isLoading}
            />
            <input
              type="text"
              className="w-full p-3 rounded-md bg-gray-600 border border-gray-500 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
              placeholder="Enter Tech Stack (e.g., React, Node.js, Python) - Optional"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              disabled={isLoading}
            />
            <input
              type="number"
              className="w-full p-3 rounded-md bg-gray-600 border border-gray-500 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
              placeholder="Number of Questions (1-10)"
              value={numQuestions}
              onChange={(e) => {
                const value = e.target.value;
                setNumQuestions(value === '' ? '' : parseInt(value));
              }}
              min="1"
              max="10"
              disabled={isLoading}
            />
            <button
              onClick={startInterview}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center justify-center"
              disabled={isLoading || !jobRole.trim()}
            >
              {isLoading ? <LoadingSpinner /> : (
                <>
                  <Play className="mr-2 h-5 w-5" /> Generate Questions & Start
                </>
              )}
            </button>
            <button
              onClick={() => navigate('/past-sessions')}
              className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center justify-center"
            >
              <History className="mr-2 h-5 w-5" /> View Past Sessions
            </button>
          </div>
        )}

        {/* Display Current Interview Session */}
        {sessionId && interviewQuestions.length > 0 && (
          <div className="interview-session p-4 bg-gray-700 rounded-lg">
            <p className="text-lg text-gray-300 mb-2">
              Job Role: <span className="font-semibold text-indigo-400">{jobRole}</span>
              {techStack && <span className="font-semibold text-purple-400 ml-2">({techStack})</span>}
            </p>
            <p className="text-xl font-semibold mb-4 text-purple-300">
              Question {currentQuestionIndex + 1} of {interviewQuestions.length}:
            </p>
            <div className="bg-gray-600 p-4 rounded-lg mb-6 text-gray-200">
              <p className="text-lg">{interviewQuestions[currentQuestionIndex]}</p>
            </div>


            <textarea
              className="w-full h-40 p-3 rounded-md bg-gray-600 border border-gray-500 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y mb-4"
              placeholder="Type your answer here..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isLoading}
            ></textarea>

            <div className="flex justify-between items-center mb-6">
              <button
                onClick={submitAnswer}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 mr-2 flex items-center justify-center"
                disabled={isLoading || !userAnswer.trim() || aiFeedback !== null}
              >
                {isLoading ? <LoadingSpinner /> : (
                  <>
                    <Check className="mr-2 h-5 w-5" /> Get Feedback
                  </>
                )}
              </button>
              <button
                onClick={nextQuestion}
                className={`flex-1 ${aiFeedback ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-500 cursor-not-allowed'} text-white font-semibold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 ml-2 flex items-center justify-center`}
                disabled={!aiFeedback || isLoading}
              >
                {currentQuestionIndex === interviewQuestions.length - 1 ? (
                  <>
                    <RefreshCcw className="mr-2 h-5 w-5" /> Finish Interview
                  </>
                ) : (
                  <>
                    Next Question
                  </>
                )}
              </button>
            </div>

            {aiFeedback && (
              <div className="bg-gray-600 p-4 rounded-lg border border-purple-500">
                <h3 className="text-xl font-semibold mb-3 text-purple-300">AI Feedback:</h3>
                <p className="mb-2">
                  <span className="font-medium">Score:</span> <span className="text-yellow-400">{aiFeedback.score}/10</span>
                </p>
                <p className="mb-2">
                  <span className="font-medium">Strengths:</span> {aiFeedback.strengths}
                </p>
                <p className="mb-2">
                  <span className="font-medium">Weaknesses:</span> {aiFeedback.weaknesses}
                </p>
                <p className="mb-2">
                  <span className="font-medium">Improvements:</span> {aiFeedback.improvements}
                </p>
                <p className="mb-2">
                  <span className="font-medium">AI Suggested Answer:</span> {aiFeedback.aiSuggestedAnswer}
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
