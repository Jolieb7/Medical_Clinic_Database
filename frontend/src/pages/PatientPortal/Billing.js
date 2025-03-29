// Billing.js
import React from 'react';

const billing = {
  billing_id: 12345,
  patient_id: 12345,
  appointment_id: 67890,
  total_amount: 100,
  payment_status: 'HP', // HP = Half Paid, NP = Not Paid
};

const Billing = () => {
  return (
    <div>
      <h1>Billing Information for Patient {billing.patient_id}</h1>
      <p>Billing ID: {billing.billing_id}</p>
      <p>Patient ID: {billing.patient_id}</p>
      <p>Appointment ID: {billing.appointment_id}</p>
      <p>Total Amount: ${billing.total_amount}</p>
      <p>Payment Status: {billing.payment_status}</p>
    </div>
  );
};

export default Billing;