// import React, { useState, useEffect } from 'react';
// import '../../styles/PatientPortal.css';
// import logo from '../../assets/clinic-logo.png';
// import PatientProfile from '../PatientDashboard/PatientProfile';
// import axios from 'axios';
// const user = JSON.parse(localStorage.getItem("user"));
// const PatientPortalApp = () => {
//   const [selectedTab, setSelectedTab] = useState('home');
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({});

//   const patient = JSON.parse(localStorage.getItem('user'));

//   useEffect(() => {
//     if (selectedTab === 'profile') {
//       fetchProfile();
//     }
//   }, [selectedTab]);

//   const fetchProfile = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/patients/${patient.id}`);
//       setProfile(res.data);
//       setFormData(res.data);
//       setLoading(false);
//     } catch (err) {
//       console.error('Error fetching profile:', err);
//     }
//   };

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const saveProfile = async () => {
//     try {
//       await axios.put(`http://localhost:5000/api/patients/${patient.id}`, formData);
//       setProfile(formData);
//       setEditMode(false);
//       alert('Profile updated successfully!');
//     } catch (err) {
//       console.error('Error updating profile:', err);
//       alert('Failed to update profile');
//     }
//   };

//   const renderProfile = () => {
//     if (loading) return <p>Loading...</p>;
//     if (!profile) return <p>No profile data found.</p>;

//     return (
//       <div className="profile-form">
//         <h2>My Profile</h2>
//         {['first_name', 'last_name', 'dob', 'phone_num', 'email', 'sex'].map((field) => (
//           <div className="form-group" key={field}>
//             <label>{field.replace('_', ' ').toUpperCase()}</label>
//             <input
//               type={field === 'dob' ? 'date' : 'text'}
//               name={field}
//               value={formData[field] || ''}
//               onChange={handleInputChange}
//               disabled={!editMode}
//             />
//           </div>
//         ))}
//         {editMode ? (
//           <>
//             <button className="save-btn" onClick={saveProfile}>Save</button>
//             <button className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
//           </>
//         ) : (
//           <button className="edit-btn" onClick={() => setEditMode(true)}>Edit</button>
//         )}
//       </div>
//     );
//   };

//   const renderContent = () => {
//     switch (selectedTab) {
//       case 'profile':
//         return <PatientProfile patientId={patient.id} />;
//       default:
//         return <h2>Welcome to your Patient Portal</h2>;
//     }
//   };

//   return (
//     <div className="patient-portal">
//       <aside className="sidebar">
//      < div className="logo">
//     <img src={require('../../assets/clinic-logo.png')} alt="MedBridge Clinic Logo" />
//     <h1>Care Connect Clinic</h1>
//   </div>
//         <h3 className="sidebar-header">Patient Portal</h3>
//         <ul className="nav-menu">
//           <li className={selectedTab === 'home' ? 'active' : ''} onClick={() => setSelectedTab('home')}>Home</li>
//           <li className={selectedTab === 'profile' ? 'active' : ''} onClick={() => setSelectedTab('profile')}>Profile</li>
//           <li className={selectedTab === 'immunizations' ? 'active' : ''} onClick={() => setSelectedTab('immunizations')}>Required Forms/Immunizations</li>
//           <li className={selectedTab === 'appointments' ? 'active' : ''} onClick={() => setSelectedTab('appointments')}>Appointments</li>
//           <li className={selectedTab === 'referrals' ? 'active' : ''} onClick={() => setSelectedTab('referrals')}>Referrals</li>
//           <li className={selectedTab === 'insurance' ? 'active' : ''} onClick={() => setSelectedTab('insurance')}>Insurance Details</li>
//         </ul>
//       </aside>

//       <main className="dashboard-content">
//         <div className="top-bar">
//           <span>You last logged in: 29/03/2025 19:07</span>
//           <button className="logout-btn" onClick={() => {
//             localStorage.clear();
//             window.location.href = '/login';
//           }}>Log Out</button>
//         </div>
//         <div className="content-area">
//           {renderContent()}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default PatientPortalApp;
// PatientPortalApp.js
import React, { useState } from 'react';
import '../../styles/PatientPortal.css';
import logo from '../../assets/clinic-logo.png';
import PatientProfile from '../PatientDashboard/PatientProfile';
import InsuranceDetails from '../PatientDashboard/InsuranceDetails';

const PatientPortalApp = () => {
  const [selectedTab, setSelectedTab] = useState('home');
  const patient = JSON.parse(localStorage.getItem('user'));

  const renderContent = () => {
    switch (selectedTab) {
      case 'profile':
        return <PatientProfile patientId={patient.patient_id || patient.id} />;
        case 'insurance':
          return <InsuranceDetails patientId={patient.patient_id || patient.id} />;
      default:
        return <h2>Welcome to your Patient Portal</h2>;
    }
  };

  return (
    <div className="patient-portal">
      <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="Care Connect Clinic Logo" />
          <h1>Care Connect Clinic</h1>
        </div>
        <h3 className="sidebar-header">Patient Portal</h3>
        <ul className="nav-menu">
          <li className={selectedTab === 'home' ? 'active' : ''} onClick={() => setSelectedTab('home')}>Home</li>
          <li className={selectedTab === 'profile' ? 'active' : ''} onClick={() => setSelectedTab('profile')}>Profile</li>
          <li className={selectedTab === 'immunizations' ? 'active' : ''} onClick={() => setSelectedTab('immunizations')}>Required Forms/Immunizations</li>
          <li className={selectedTab === 'appointments' ? 'active' : ''} onClick={() => setSelectedTab('appointments')}>Appointments</li>
          <li className={selectedTab === 'referrals' ? 'active' : ''} onClick={() => setSelectedTab('referrals')}>Referrals</li>
          <li className={selectedTab === 'insurance' ? 'active' : ''} onClick={() => setSelectedTab('insurance')}>Insurance Details</li>
        </ul>
      </aside>

      <main className="dashboard-content">
        <div className="top-bar">
          <span>You last logged in: 29/03/2025 19:07</span>
          <button className="logout-btn" onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}>Log Out</button>
        </div>
        <div className="content-area">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default PatientPortalApp;