import React, { useState } from 'react';
import '../../styles/Register.css';
import bgImage from '../../assets/Home.png';
import logo from '../../assets/clinic-logo.png';
import { useNavigate } from 'react-router-dom';

const PatientRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    dob: '',
    phone_num: '',
    email: '',
    sex: '',
    street_num: '',
    street_name: '',
    postal_code: '',
    city: '',
    state: '',
    emergency_first_name: '',
    emergency_last_name: '',
    emergency_relationship: '',
    emergency_phone: '',
    provider_name: '',
    policy_number: '',
    coverage_details: '',
    effective_from: '',
    effective_to: ''
  });

  const [errors, setErrors] = useState({});

  const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ];

  const validate = () => {
    const newErrors = {};
    if (!form.username) newErrors.username = 'Username is required';
    if (!form.password || form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!form.first_name) newErrors.first_name = 'First name is required';
    if (!form.last_name) newErrors.last_name = 'Last name is required';
    if (!form.dob) newErrors.dob = 'Date of birth is required';
    if (!form.phone_num.match(/^\d{10}$/)) newErrors.phone_num = 'Phone number must be 10 digits';
    if (!form.email.includes('@')) newErrors.email = 'Email is invalid';
    if (!form.sex) newErrors.sex = 'Gender is required';
    if (!form.street_num) newErrors.street_num = 'Street number is required';
    if (!form.street_name) newErrors.street_name = 'Street name is required';
    if (!form.postal_code.match(/^\d{5}$/)) newErrors.postal_code = 'Zip code must be 5 digits';
    if (!form.city) newErrors.city = 'City is required';
    if (!form.state) newErrors.state = 'State is required';
    if (!form.emergency_first_name) newErrors.emergency_first_name = 'Emergency contact first name is required';
    if (!form.emergency_last_name) newErrors.emergency_last_name = 'Emergency contact last name is required';
    if (!form.emergency_relationship) newErrors.emergency_relationship = 'Relationship is required';
    if (!form.emergency_phone.match(/^\d{10}$/)) newErrors.emergency_phone = 'Emergency phone must be 10 digits';
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await fetch('/api/auth/register-patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      if (response.ok) {
        alert('Account created successfully! Please login.');
        navigate('/login');
      } else {
        alert(data.error || 'Registration failed.');
      }
    } catch (err) {
      alert('Server error. Please try again later.');
    }
  };

  return (
    <div
      className="auth-page"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh'
      }}
    > <nav className="navbar">
      <div className="logo">
        <img src={require('../../assets/clinic-logo.png')} alt="MedBridge Clinic Logo" />
        <h1>Care Connect Clinic</h1>
      </div>
      <ul className="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="#about">About Us</a></li>
              <li><a href="#services">Services</a></li>
           
      </ul>
    </nav>
    <div className="register-container">
      <h2>Patient Registration</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label>Username*</label>
          <input name="username" value={form.username} onChange={handleChange} />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>
        <div className="form-group">
          <label>Password*</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>First Name*</label>
            <input name="first_name" value={form.first_name} onChange={handleChange} />
            {errors.first_name && <p className="error">{errors.first_name}</p>}
          </div>
          <div className="form-group">
            <label>Last Name*</label>
            <input name="last_name" value={form.last_name} onChange={handleChange} />
            {errors.last_name && <p className="error">{errors.last_name}</p>}
          </div>
        </div>
        <div className="form-group">
          <label>Date of Birth*</label>
          <input type="date" name="dob" value={form.dob} onChange={handleChange} />
          {errors.dob && <p className="error">{errors.dob}</p>}
        </div>
        <div className="form-group">
          <label>Gender*</label>
          <select name="sex" value={form.sex} onChange={handleChange}>
            <option value="">-- Select --</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.sex && <p className="error">{errors.sex}</p>}
        </div>

        <h3>Address</h3>
        <div className="form-group">
          <label>Street Number*</label>
          <input name="street_num" value={form.street_num} onChange={handleChange} />
          {errors.street_num && <p className="error">{errors.street_num}</p>}
        </div>
        <div className="form-group">
          <label>Street Name*</label>
          <input name="street_name" value={form.street_name} onChange={handleChange} />
          {errors.street_name && <p className="error">{errors.street_name}</p>}
        </div>
        <div className="form-group">
          <label>City*</label>
          <input name="city" value={form.city} onChange={handleChange} />
          {errors.city && <p className="error">{errors.city}</p>}
        </div>
        <div className="form-group">
          <label>State*</label>
          <select name="state" value={form.state} onChange={handleChange}>
            <option value="">-- Select State --</option>
            {usStates.map((st, idx) => (
              <option key={idx} value={st}>{st}</option>
            ))}
          </select>
          {errors.state && <p className="error">{errors.state}</p>}
        </div>
        <div className="form-group">
          <label>Zip Code*</label>
          <input name="postal_code" value={form.postal_code} onChange={handleChange} />
          {errors.postal_code && <p className="error">{errors.postal_code}</p>}
        </div>

        <div className="form-group">
          <label>Phone Number*</label>
          <input name="phone_num" value={form.phone_num} onChange={handleChange} />
          {errors.phone_num && <p className="error">{errors.phone_num}</p>}
        </div>
        <div className="form-group">
          <label>Email*</label>
          <input name="email" value={form.email} onChange={handleChange} />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <h3>Emergency Contact</h3>
        <div className="form-row">
          <div className="form-group">
            <label>First Name*</label>
            <input name="emergency_first_name" value={form.emergency_first_name} onChange={handleChange} />
            {errors.emergency_first_name && <p className="error">{errors.emergency_first_name}</p>}
          </div>
          <div className="form-group">
            <label>Last Name*</label>
            <input name="emergency_last_name" value={form.emergency_last_name} onChange={handleChange} />
            {errors.emergency_last_name && <p className="error">{errors.emergency_last_name}</p>}
          </div>
        </div>
        <div className="form-group">
          <label>Relationship*</label>
          <select name="emergency_relationship" value={form.emergency_relationship} onChange={handleChange}>
            <option value="">-- Select --</option>
            <option value="Parent">Parent</option>
            <option value="Sibling">Sibling</option>
            <option value="Spouse">Spouse</option>
            <option value="Friend">Friend</option>
            <option value="Guardian">Guardian</option>
          </select>
          {errors.emergency_relationship && <p className="error">{errors.emergency_relationship}</p>}
        </div>
        <div className="form-group">
          <label>Phone*</label>
          <input name="emergency_phone" value={form.emergency_phone} onChange={handleChange} />
          {errors.emergency_phone && <p className="error">{errors.emergency_phone}</p>}
        </div>

        <h3>Optional Insurance Info</h3>
        <div className="form-group">
          <label>Provider Name</label>
          <input name="provider_name" value={form.provider_name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Policy Number</label>
          <input name="policy_number" value={form.policy_number} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Coverage Details</label>
          <textarea name="coverage_details" value={form.coverage_details} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Effective From</label>
          <input type="date" name="effective_from" value={form.effective_from} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Effective To</label>
          <input type="date" name="effective_to" value={form.effective_to} onChange={handleChange} />
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
    </div>
  );
};

export default PatientRegister;
