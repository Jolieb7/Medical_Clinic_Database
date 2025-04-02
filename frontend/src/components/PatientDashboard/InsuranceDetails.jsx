import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InsuranceDetails = ({ patientId }) => {
  const [formData, setFormData] = useState({
    provider_name: '',
    policy_number: '',
    covrage_details: '',
    effective_from: '',
    effective_to: ''
  });

  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchInsurance();
  }, []);

  const fetchInsurance = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/patient/insurance/${patientId}`);
      if (res.data) {
        setFormData(res.data);
      } else {
        setFormData({});
      }
    } catch (err) {
      console.error('Error fetching insurance:', err);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Only validate if fields are not empty (since it's optional)
    if (formData.provider_name && !formData.policy_number) {
      newErrors.policy_number = 'Policy number is required';
    }
    if (formData.effective_from && !formData.effective_to) {
      newErrors.effective_to = 'End date is required';
    }
    if (formData.effective_from && formData.effective_to && formData.effective_from > formData.effective_to) {
      newErrors.effective_to = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveInsurance = async () => {
    if (!validateForm()) return;

    try {
      await axios.put(`http://localhost:5000/api/patient/insurance/${patientId}`, formData);
      alert('Insurance updated successfully');
      setEditMode(false);
      fetchInsurance();
    } catch (err) {
      console.error('Error updating insurance:', err);
      alert('Failed to update insurance');
    }
  };

  const handleDeleteInsurance = async () => {
    const confirmDelete = window.confirm("Are you sure you want to remove your insurance?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/patient/insurance/${patientId}`);
      alert("Insurance information removed successfully.");
      setFormData({});
      setEditMode(false);
      setErrors({});
    } catch (err) {
      console.error("Error deleting insurance:", err);
      alert("Failed to remove insurance.");
    }
  };

  const isInsuranceEmpty = Object.values(formData).every(val => !val);

  return (
    <div className="profile-form">
      <h2>Insurance Details</h2>

      {['provider_name', 'policy_number', 'covrage_details'].map((field) => (
        <div className="form-group" key={field}>
          <label>{field.replace('_', ' ').toUpperCase()}</label>
          <input
            type="text"
            name={field}
            value={formData[field] || ''}
            onChange={handleChange}
            disabled={!editMode}
          />
          {errors[field] && <small style={{ color: 'red' }}>{errors[field]}</small>}
        </div>
      ))}

      <div className="form-group">
        <label>Effective From</label>
        <input
          type="date"
          name="effective_from"
          value={formData.effective_from?.split('T')[0] || ''}
          onChange={handleChange}
          disabled={!editMode}
        />
        {errors.effective_from && <small style={{ color: 'red' }}>{errors.effective_from}</small>}
      </div>

      <div className="form-group">
        <label>Effective To</label>
        <input
          type="date"
          name="effective_to"
          value={formData.effective_to?.split('T')[0] || ''}
          onChange={handleChange}
          disabled={!editMode}
        />
        {errors.effective_to && <small style={{ color: 'red' }}>{errors.effective_to}</small>}
      </div>

      {editMode ? (
        <>
          <button className="save-btn" onClick={saveInsurance} disabled={isInsuranceEmpty}>Save</button>
          <button className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
          {!isInsuranceEmpty && (
            <button className="delete-btn" onClick={handleDeleteInsurance}>Remove Insurance</button>
          )}
        </>
      ) : (
        <button className="edit-btn" onClick={() => setEditMode(true)}>Edit</button>
      )}
    </div>
  );
};

export default InsuranceDetails;
