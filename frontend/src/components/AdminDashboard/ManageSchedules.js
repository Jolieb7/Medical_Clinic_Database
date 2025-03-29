//      This file contains the code for the ManageSchedules component which is a child component of the AdminDashboard component.
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/AdminDashboard.css';

const ManageSchedules = () => {
  const [clinics, setClinics] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [form, setForm] = useState({ day_of_week: '', start_time: '', end_time: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch clinics on component mount
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get('http://localhost:5000/api/admin/clinics');
        setClinics(response.data);
      } catch (err) {
        console.error('Error fetching clinics:', err);
        setError('Failed to load clinics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, []);


  const fetchEmployeesByClinic = async (clinicId) => {
    if (!clinicId) return;
    
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`http://localhost:5000/api/admin/employees/by-clinic`, {
        params: { clinic_id: clinicId }
      });
      
      
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees. Please try again later.');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = async (employeeId) => {
    if (!employeeId) return;
    
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`http://localhost:5000/api/admin/schedules/${employeeId}`);
      setSchedules(response.data);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError('Failed to load schedules. Please try again later.');
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClinicChange = (e) => {
    const clinicId = e.target.value;
    setSelectedClinic(clinicId);
    setSelectedEmployee('');
    setEmployees([]);
    setSchedules([]);
    if (clinicId) {
      fetchEmployeesByClinic(clinicId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      await axios.post('http://localhost:5000/api/admin/schedules', {
        employee_id: selectedEmployee,
        clinic_id: selectedClinic,
        ...form
      });
      
      setMessage('Schedule created successfully!');
      setForm({ day_of_week: '', start_time: '', end_time: '' }); // Reset form
      fetchSchedules(selectedEmployee); // Refresh schedules
    } catch (err) {
      console.error('Error creating schedule:', err);
      setError('Failed to create schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (schedule) => {
    const newStart = prompt('New Start Time (HH:MM:SS):', schedule.start_time);
    const newEnd = prompt('New End Time (HH:MM:SS):', schedule.end_time);
    
    if (newStart && newEnd) {
      try {
        setLoading(true);
        setError('');
        setMessage('');
        
        await axios.put(`http://localhost:5000/api/admin/schedules/${schedule.schedule_id}`, {
          ...schedule,
          start_time: newStart,
          end_time: newEnd
        });
        
        setMessage('Schedule updated successfully!');
        fetchSchedules(schedule.employee_id);
      } catch (err) {
        console.error('Error updating schedule:', err);
        setError('Failed to update schedule. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="schedule-container">
      <div className="admin-tab-content">
        <h2 className="section-title">Manage Employee Schedules</h2>
  
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        {loading && <p>Loading...</p>}
  
        {/* Dropdown group */}
        <div className="dropdown-group">
          <div className="dropdown-field">
            <label htmlFor="clinic-select">Clinic</label>
            <select
              id="clinic-select"
              value={selectedClinic}
              onChange={handleClinicChange}
              disabled={loading}
            >
              <option value="">Select Clinic</option>
              {clinics.map(c => (
                <option key={c.clinic_id} value={c.clinic_id}>{c.clinic_name}</option>
              ))}
            </select>
          </div>
  
          <div className="dropdown-field">
            <label htmlFor="employee-select">Employee</label>
            <select
              id="employee-select"
              value={selectedEmployee}
              onChange={(e) => {
                setSelectedEmployee(e.target.value);
                if (e.target.value) {
                  fetchSchedules(e.target.value);
                } else {
                  setSchedules([]);
                }
              }}
              disabled={!selectedClinic || loading}
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.first_name} {emp.last_name} (ID: {emp.employee_id})
                </option>
              ))}
            </select>
          </div>
        </div>
  
        {/* Schedule Form */}
        <form className="schedule-form" onSubmit={handleSubmit}>
          <select
            name="day_of_week"
            value={form.day_of_week}
            onChange={(e) => setForm({ ...form, day_of_week: e.target.value })}
            required
            disabled={loading}
          >
            <option value="">Select Day</option>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          <input
            type="time"
            value={form.start_time}
            onChange={(e) => setForm({ ...form, start_time: e.target.value })}
            required
            disabled={loading}
          />
          <input
            type="time"
            value={form.end_time}
            onChange={(e) => setForm({ ...form, end_time: e.target.value })}
            required
            disabled={loading}
          />
          <button type="submit" disabled={!selectedEmployee || loading}>
            Create Schedule
          </button>
        </form>
  
        {/* Existing schedules */}
        {schedules.length > 0 && (
          <div className="schedule-table">
            <h3>Existing Schedules</h3>
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map(sch => (
                  <tr key={sch.schedule_id}>
                    <td>{sch.day_of_week}</td>
                    <td>{sch.start_time}</td>
                    <td>{sch.end_time}</td>
                    <td>
                      <button onClick={() => handleEdit(sch)} disabled={loading}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default ManageSchedules;