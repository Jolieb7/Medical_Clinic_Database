import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/PatientLogin.css';
import logo from '../../assets/clinic-logo.png';
import bgImage from '../../assets/Home.png';
import axios from 'axios';

const EmployeeLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username || !password) {
      setErrorMsg("Please enter both username and password.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/login', { username, password });

      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      //Redirect based on role
      if (user.role === 'Admin') navigate('/admin/dashboard');
      else if (user.role === 'Doctor') navigate('/doctor/dashboard');
      else if (user.role === 'Nurse') navigate('/nurse/dashboard');
      else if (user.role === 'Staff') navigate('/staff/dashboard');
      else navigate('/'); // fallback

    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="auth-page" style={{
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh'
    }}>
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Care Connect Clinic Logo" />
          <h1>Care Connect Clinic</h1>
        </div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#services">Services</a></li>
        </ul>
      </nav>

      <div className="login-container">
        <div className="login-box">
          <img src={logo} alt="Clinic Logo" className="login-logo" />
          <h2>Employee Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorMsg && <p className="error-msg">{errorMsg}</p>}
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;
