import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://ai-interview-coach-5nij.onrender.com/api/auth/register', {
        name,
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', response.data.email);
      localStorage.setItem('userName', response.data.name);

      navigate('/dashboard');
    } catch (err) {
      console.log('Signup error:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-indigo-300 mb-6">Sign Up</h2>
        {error && (
          <div className="bg-red-600 text-white p-3 rounded-md mb-4 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-indigo-400 hover:text-indigo-300 font-medium focus:outline-none"
            disabled={isLoading}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
