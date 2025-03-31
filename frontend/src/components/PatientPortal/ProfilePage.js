// ProfilePage.js
import React from 'react';

const patient = {
  patient_id: '12345',
  first_name: 'John',
  last_name: 'Doe',
  dob: '1990-01-01',
  address_id: '123 Main St',
  phone_num: '555-555-5555',
  email: 'john.doe@example.com',
  sex: 'Male',
  date_registered: '2022-01-01T16:03:00',
  is_active: true,
};

const ProfilePage = () => {
  return (
    <div>
      <h1>Profile Page for {patient.first_name} {patient.last_name}</h1>
      <p>Patient ID: {patient.patient_id}</p>
      <p>First Name: {patient.first_name}</p>
      <p>Last Name: {patient.last_name}</p>
      <p>Date of Birth: {patient.dob}</p>
      <p>Address: {patient.address_id}</p>
      <p>Phone Number: {patient.phone_num}</p>
      <p>Email: {patient.email}</p>
      <p>Sex: {patient.sex}</p>
      <p>Date Registered: {patient.date_registered}</p>
      <p>Is Active: {patient.is_active.toString()}</p>
    </div>
  );
};

export default ProfilePage;