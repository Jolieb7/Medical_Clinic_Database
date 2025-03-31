import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/PatientPortal.css';

const PatientProfile = ({ patientId }) => {
  const [profileData, setProfileData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/patient/profile/${patientId}`);
      setProfileData(res.data);
      setFormData({
        ...res.data,
        emergency_first_name: res.data.contact_first_name || '',
        emergency_last_name: res.data.contact_last_name || '',
        emergency_relationship: res.data.relationship || '',
        emergency_phone: res.data.phone || ''
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    try {
      await axios.put(`http://localhost:5000/api/patient/profile/${patientId}`, formData);
      alert('Profile updated successfully');
      setEditMode(false);
      fetchProfile(); // refresh
    } catch (err) {
      console.error('Error updating profile:', err);
      alert(`Update failed: ${err.response?.data?.error || err.message}`);
    }
  };

  if (!profileData) return <p>No profile found</p>;

  return (
    <div className="profile-form">
      <h2>My Profile</h2>

      {/* Basic Info */}
      <div className="form-group">
        <label>First Name</label>
        <input type="text" name="first_name" value={formData.first_name || ''} disabled />
      </div>

      <div className="form-group">
        <label>Last Name</label>
        <input type="text" name="last_name" value={formData.last_name || ''} disabled />
      </div>

      <div className="form-group">
        <label>Date of Birth</label>
        <input type="date" name="dob" value={formData.dob?.split('T')[0] || ''} disabled />
      </div>

      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="text"
          name="phone_num"
          value={formData.phone_num || ''}
          onChange={handleChange}
          disabled={!editMode}
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          disabled={!editMode}
        />
      </div>

      <div className="form-group">
        <label>Sex</label>
        <input type="text" name="sex" value={formData.sex || ''} disabled />
      </div>

      {/* Address */}
      <h4>Address</h4>
      {['street_num', 'street_name', 'city', 'state', 'postal_code'].map((field) => (
        <div className="form-group" key={field}>
          <label>{field.replace('_', ' ').toUpperCase()}</label>
          <input
            type="text"
            name={field}
            value={formData[field] || ''}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>
      ))}

      {/* Emergency Contact */}
      <h4>Emergency Contact</h4>

      <div className="form-group">
        <label>First Name</label>
        <input
          type="text"
          name="emergency_first_name"
          value={formData.emergency_first_name || ''}
          onChange={handleChange}
          disabled={!editMode}
        />
      </div>

      <div className="form-group">
        <label>Last Name</label>
        <input
          type="text"
          name="emergency_last_name"
          value={formData.emergency_last_name || ''}
          onChange={handleChange}
          disabled={!editMode}
        />
      </div>

      <div className="form-group">
        <label>Relationship</label>
        <input
          type="text"
          name="emergency_relationship"
          value={formData.emergency_relationship || ''}
          onChange={handleChange}
          disabled={!editMode}
        />
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input
          type="text"
          name="emergency_phone"
          value={formData.emergency_phone || ''}
          onChange={handleChange}
          disabled={!editMode}
        />
      </div>

      {/* Action Buttons */}
      {editMode ? (
        <>
          <button className="save-btn" onClick={saveProfile}>Save</button>
          <button className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
        </>
      ) : (
        <button className="edit-btn" onClick={() => setEditMode(true)}>Edit</button>
      )}
    </div>
  );
};

export default PatientProfile;
