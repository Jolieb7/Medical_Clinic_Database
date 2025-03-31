import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Main/Home';
import PatientLogin from './components/Auth/PatientLogin';
import PatientRegister from './components/Auth/PatientRegister';
import EmployeeLogin from './components/Auth/EmployeeLogin';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import PatientPortalApp from './components/PatientDashboard/PatientPortalApp';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PatientLogin />} />
          <Route path="/register" element={<PatientRegister />} />
          <Route path="/login/employee" element={<EmployeeLogin />} />
          <Route path="/patient/dashboard" element={<PatientPortalApp />} />
      
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;

