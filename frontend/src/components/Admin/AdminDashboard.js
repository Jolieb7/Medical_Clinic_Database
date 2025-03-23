import React, { useState } from 'react';
import '../../styles/AdminDashboard.css';
import logo from '../../assets/clinic-logo.png';
import bgImage from '../../assets/Home.png';
import { FaSignOutAlt } from 'react-icons/fa';
import CreateEmployeeForm from './CreateEmployeeForm';
import AdminProfile from './AdminProfile';
import EmployeeTable from './EmployeeTable';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div
      className="admin-dashboard-page"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh'
      }}
    >
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Clinic Logo" />
          <h1>Care Connect Clinic</h1>
        </div>
        <ul className="nav-links">
        
          <li><button onClick={handleLogout} className="logout-btn" title="Logout"><FaSignOutAlt /></button></li>
        </ul>
      </nav>

      <div className="admin-dashboard-content">
        <div className="tab-buttons">
          <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'active' : ''}>My Profile</button>
          <button onClick={() => setActiveTab('create')} className={activeTab === 'create' ? 'active' : ''}>Create Employee</button>
          <button onClick={() => setActiveTab('view')} className={activeTab === 'view' ? 'active' : ''}>View Employees</button>
        </div>

        <div className="admin-tab-content">
          {activeTab === 'profile' && <AdminProfile />}
          {activeTab === 'create' && <CreateEmployeeForm />}
          {activeTab === 'view' && <EmployeeTable />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;