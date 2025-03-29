import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import Immunizations from './Immunizations';
import MedicalRecords from './MedicalRecords';
import Appointments from './Appointments';
import Referrals from './Referrals';
import InsurancePlan from './InsurancePlan';
import Billing from './Billing';

function PatientPortalApp() {
  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>Menu</h2>
        <ul>
          <li><Link to="/patient_portal">Profile Page</Link></li>
          <li><Link to="/patient_portal/immunizations">Immunizations</Link></li>
          <li><Link to="/patient_portal/medical-records">Medical Records</Link></li>
          <li><Link to="/patient_portal/appointments">Appointments</Link></li>
          <li><Link to="/patient_portal/referrals">Referrals</Link></li>
          <li><Link to="/patient_portal/insurance-plan">Insurance Plan</Link></li>
          <li><Link to="/patient_portal/billing">Billing</Link></li>
        </ul>
      </div>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<ProfilePage />} />
          <Route path="/immunizations" element={<Immunizations />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/insurance-plan" element={<InsurancePlan />} />
          <Route path="/billing" element={<Billing />} />
        </Routes>
      </div>
    </div>
  );
}

export default PatientPortalApp;