import { useState } from 'react';
import axios from 'axios';

const Employee_Form = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    hire_date: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'http://localhost:5000/api/employees', // Backend endpoint for adding new employees
        formData
      );

      if (res.status === 200) {
        alert('Employee added successfully!');
      } else {
        alert('Failed to add employee');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Error adding employee');
    }
  };

  return (
    <div>
      <h2>Add New Employee</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Role</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Hire Date</label>
          <input
            type="date"
            name="hire_date"
            value={formData.hire_date}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default Employee_Form;
