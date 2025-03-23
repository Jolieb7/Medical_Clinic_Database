import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Main/Home';
import PatientLogin from './components/Auth/PatientLogin';
import PatientRegister from './components/Auth/PatientRegister';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PatientLogin />} />
          <Route path="/register" element={<PatientRegister />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;