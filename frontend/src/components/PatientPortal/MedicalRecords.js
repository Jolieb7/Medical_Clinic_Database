// MedicalRecords.js
import React from 'react';

const medicalRecord = {
  record_id: '12345',
  patient_id: '12345',
  doctor_id: '67890',
  date_posted: '2022-01-01T16:03:00',
  diagnosis: 'Example Diagnosis',
};

const MedicalRecords = () => {
  return (
    <div>
      <h1>Medical Records for Patient {medicalRecord.patient_id}</h1>
      <p>Record ID: {medicalRecord.record_id}</p>
      <p>Patient ID: {medicalRecord.patient_id}</p>
      <p>Doctor ID: {medicalRecord.doctor_id}</p>
      <p>Date Posted: {medicalRecord.date_posted}</p>
      <p>Diagnosis: {medicalRecord.diagnosis}</p>
    </div>
  );
};

export default MedicalRecords;