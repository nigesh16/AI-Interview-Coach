import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react'; 

const API_BASE_URL = 'https://ai-interview-app-pwdb.onrender.com/api/interview';

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

const PastSessionsPage = () => {
  const [pastSessions, setPastSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchPastSessions();
  }, []);

  const fetchPastSessions = async () => {
    setIsLoading(true);
    setError(null);
    setMessage(null); 
    try {
      const response = await axios.get(`${API_BASE_URL}/sessions`, getAuthHeaders());
      setPastSessions(response.data);
    } catch (err) {
      console.error('Error fetching past sessions:', err.response?.data?.message || err.message);
      setError('Failed to load past sessions.');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAction = (msg) => {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
      modal.innerHTML = `
        <div class="bg-gray-700 p-6 rounded-lg shadow-xl border border-gray-600 text-white text-center max-w-sm">
          <p class="text-lg mb-4">${msg}</p>
          <div class="flex justify-center space-x-4">
            <button id="confirmYes" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">Yes</button>
            <button id="confirmNo" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">No</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      document.getElementById('confirmYes').onclick = () => {
        document.body.removeChild(modal);
        resolve(true);
      };
      document.getElementById('confirmNo').onclick = () => {
        document.body.removeChild(modal);
        resolve(false);
      };
    });
  };

  const showAlert = (msg, isError = false) => {
    setMessage({ text: msg, type: isError ? 'error' : 'success' });
    setTimeout(() => setMessage(null), 3000); 
  };


  const handleDeleteSession = async (sessionIdToDelete) => {
    const isConfirmed = await confirmAction('Are you sure you want to delete this session?');
    if (!isConfirmed) {
      return; 
    }

    try {
      setIsLoading(true);
      setError(null);
      setMessage(null); 
      await axios.delete(`${API_BASE_URL}/sessions/${sessionIdToDelete}`, getAuthHeaders());
      
      setPastSessions(prevSessions =>
        prevSessions.filter(session => session._id !== sessionIdToDelete)
      );
      showAlert('Session deleted successfully!', false); 
    } catch (err) {
      console.error('Error deleting session:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to delete session. Please try again.');
      showAlert(err.response?.data?.message || 'Failed to delete session.', true); 
    } finally {
      setIsLoading(false);
    }
  };


  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 to-purple-900 text-white font-inter p-4 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 border border-gray-700 mt-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-300">
            Your Past Interview Sessions
          </h1>
          <div className="flex space-x-2"> {/* Container for buttons */}
            {/* Removed the Delete All button */}
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Message Display Area */}
        {message && (
          <div className={`p-3 rounded-md mb-4 text-center ${message.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
            {message.text}
          </div>
        )}
        {error && !message && ( 
          <div className="bg-red-600 text-white p-3 rounded-md mb-4 text-center">
            {error}
          </div>
        )}

        {isLoading ? (
          <LoadingSpinner />
        ) : pastSessions.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No past sessions found. Start an interview to see your history!</p>
        ) : (
          <ul className="space-y-4">
            {pastSessions.map((session) => (
              <li key={session._id} className="bg-gray-700 p-4 rounded-lg shadow-md border border-gray-600 flex justify-between items-start relative">
                <div>
                  <p className="text-lg font-semibold text-purple-300">
                    Job Role: {session.jobRole} {session.techStack && `(${session.techStack})`}
                  </p>
                  <p className="text-gray-300 text-sm">
                    Date: {new Date(session.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-300 text-sm">
                    Status: {session.status === 'completed' ? 'Completed' : 'In Progress'}
                  </p>
                  <p className="text-gray-300 text-sm">
                    Questions Answered: {session.questionsAndAnswers.length}
                  </p>
                  {session.status === 'completed' && (
                    <p className="text-gray-300 text-sm">
                      Total Score: {session.totalScore.toFixed(2)}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteSession(session._id)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full absolute top-2 right-2 transition duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  title="Delete Session"
                >
                  <Trash2 className="h-5 w-5" /> 
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PastSessionsPage;
