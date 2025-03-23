import logo from './logo.svg';
import './App.css';
import React from 'react';
import{ Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/dashboard';
import Admin_dashboard from './pages/Admin_dashboard';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />   {/* Redirect to login */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin_dashboard" element={<Admin_dashboard />} />
        {/* Add more routes as needed */}
      </Routes>
  );
}
 
export default App;
