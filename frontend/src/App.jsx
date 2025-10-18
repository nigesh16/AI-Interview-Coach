import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx'; 
import Signup from './pages/Signup.jsx'; 
import Dashboard from './pages/Dashboard.jsx'; 
import ProtectedRoute from './components/ProtectedRoute.jsx'; 
import Home from './pages/Home.jsx'; 
import PastSessionsPage from './pages/PastSessionsPage.jsx'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} /> 

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/past-sessions" element={<PastSessionsPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
