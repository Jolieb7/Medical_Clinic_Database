import logo from './logo.svg';
import './App.css';
import React from 'react';
import{ Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Logins';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />   {/* Redirect to login */}
        <Route path="/login" element={<Login />} />
        {/* Add more routes as needed */}
      </Routes>
  );
}

/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
*/
export default App;
