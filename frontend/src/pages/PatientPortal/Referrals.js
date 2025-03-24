// Referrals.js
import React from 'react';

const referral = {
  referral_id: '12345',
  patient_id: '12345',
  specialist_id: '67890',
  department_id: 'ABC123',
  employee_id: 'DEF456',
  appointment_id: 'GHI789',
};

const Referrals = () => {
  return (
    <div>
      <h1>Referral Details</h1>
      <p>Referral ID: {referral.referral_id}</p>
      <p>Patient ID: {referral.patient_id}</p>
      <p>Specialist ID: {referral.specialist_id}</p>
      <p>Department ID: {referral.department_id}</p>
      <p>Employee ID: {referral.employee_id}</p>
      <p>Appointment ID: {referral.appointment_id}</p>
    </div>
  );
};

export default Referrals;