import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>                
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>            
      </div>                   
    </Router>                  
  );
}

export default App;
