// InsurancePlan.js
import React from 'react';

const insurancePlan = {
  insurance_id: 12345,
  patient_id: 12345,
  provider_name: 'Example Insurance Provider',
  policy_number: 'XYZ12345',
  coverage_details: 'This policy covers hospital stays, doctor visits, and prescriptions.',
};

const InsurancePlan = () => {
  return (
    <div>
      <h1>Insurance Plan for Patient {insurancePlan.patient_id}</h1>
      <p>Insurance ID: {insurancePlan.insurance_id}</p>
      <p>Patient ID: {insurancePlan.patient_id}</p>
      <p>Provider Name: {insurancePlan.provider_name}</p>
      <p>Policy Number: {insurancePlan.policy_number}</p>
      <p>Coverage Details: {insurancePlan.coverage_details}</p>
    </div>
  );
};

export default InsurancePlan;