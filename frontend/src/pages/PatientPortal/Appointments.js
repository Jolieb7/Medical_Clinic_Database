// Appointment.js
import React from 'react';

const appointment = {
  appointment_id: '12345',
  patient_id: '12345',
  doctor_id: '67890',
  clinic_id: 'ABC123',
  test_id: 'XYZ456',
  start_time: '2024-03-22T14:30:00',
  end_time: '2024-03-22T15:30:00',
  appointment_status: 'Scheduled',
  patient_check_in_time: '2024-03-22T14:20:00',
  patient_check_out_time: '2024-03-22T15:40:00',
};

const Appointment = () => {
  return (
    <div>
      <h1>Appointment Details</h1>
      <p>Appointment ID: {appointment.appointment_id}</p>
      <p>Patient ID: {appointment.patient_id}</p>
      <p>Doctor ID: {appointment.doctor_id}</p>
      <p>Clinic ID: {appointment.clinic_id}</p>
      <p>Test ID: {appointment.test_id}</p>
      <p>Start Time: {appointment.start_time}</p>
      <p>End Time: {appointment.end_time}</p>
      <p>Appointment Status: {appointment.appointment_status}</p>
      <p>Patient Check-in Time: {appointment.patient_check_in_time}</p>
      <p>Patient Check-out Time: {appointment.patient_check_out_time}</p>
    </div>
  );
};

export default Appointment;