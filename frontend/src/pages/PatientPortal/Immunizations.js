// Immunizations.js
import React from 'react';

const immunizations = [
  {
    patient_id: 12345,
    immunization_id: 1,
    immunization_type: 'MMR',
  },
  {
    patient_id: 12345,
    immunization_id: 2,
    immunization_type: 'DTaP',
  },
  {
    patient_id: 12345,
    immunization_id: 3,
    immunization_type: 'Polio',
  },
];

const Immunizations = () => {
  return (
    <div>
      <h1>Immunizations for Patient {immunizations[0].patient_id}</h1>
      {immunizations.map(immunization => (
        <div key={immunization.immunization_id}>
          <p>Immunization ID: {immunization.immunization_id}</p>
          <p>Immunization Type: {immunization.immunization_type}</p>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Immunizations;