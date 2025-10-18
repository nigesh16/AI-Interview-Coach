import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 to-purple-900 text-white font-inter">
      {/* Navbar */}
      <nav className="p-4 bg-gray-900 bg-opacity-70 shadow-lg fixed w-full z-10 top-0 rounded-b-xl">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-300">AI Interview Coach</h1>
          <div>
            <button
              onClick={() => navigate('/login')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 mr-2"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen pt-20 text-center px-4">
        <h2 className="text-5xl md:text-6xl font-extrabold text-indigo-200 mb-6 leading-tight">
          Ace Your Next Interview with AI Power
        </h2>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-10">
          Our platform helps you prepare for any job role by generating tailored questions and providing instant, intelligent feedback on your answers.
        </p>
        <button
          onClick={handleGetStartedClick} 
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-110 shadow-lg hover:shadow-xl"
        >
          Get Started - It's Free!
        </button>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-900 bg-opacity-50 px-4">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-bold text-indigo-300 mb-12">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-indigo-500 transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl text-purple-400 mb-4">💡</div>
              <h4 className="text-2xl font-semibold text-white mb-3">Custom Interview Generation</h4>
              <p className="text-gray-300">
                Specify your job role and tech stack to get highly relevant, AI-generated questions.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-indigo-500 transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl text-green-400 mb-4">💬</div>
              <h4 className="text-2xl font-semibold text-white mb-3">Intelligent AI Feedback</h4>
              <p className="text-gray-300">
                Receive instant, detailed analysis on your answers, highlighting strengths, weaknesses, and areas for improvement.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-indigo-500 transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl text-yellow-400 mb-4">📈</div>
              <h4 className="text-2xl font-semibold text-white mb-3">Track Your Progress</h4>
              <p className="text-gray-300">
                Review past interview sessions and feedback to see your development over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 text-center px-4">
        <h3 className="text-4xl font-bold text-indigo-200 mb-6">Ready to Conquer Your Interviews?</h3>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
          Join thousands of aspiring professionals who are transforming their interview skills with our AI-powered coach.
        </p>
        <button
          onClick={handleGetStartedClick} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-110 shadow-lg hover:shadow-xl"
        >
          Sign Up Now and Start Practicing!
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 bg-opacity-70 p-6 text-center text-gray-400 text-sm rounded-t-xl">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} AI Interview Coach. All rights reserved.
          <p className="mt-2">
            Built with dedication for your success.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
