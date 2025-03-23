//admin profile page
import React, { useState, useEffect } from 'react';
import '../../styles/AdminDashboard.css';

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@example.com',
    phone: '1234567890'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert('Profile updated successfully! (simulated)');
  };

  return (
    <form onSubmit={handleSave} className="admin-box">
      <h3>My Profile</h3>
      <input name="first_name" placeholder="First Name" value={profile.first_name} onChange={handleChange} required />
      <input name="last_name" placeholder="Last Name" value={profile.last_name} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={profile.email} onChange={handleChange} required />
      <input name="phone" placeholder="Phone Number" value={profile.phone} onChange={handleChange} required />
      <button type="submit">Save Changes</button>
    </form>
  );
};

export default AdminProfile;
