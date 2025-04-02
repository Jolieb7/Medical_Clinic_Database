import { useState } from 'react';
import axios from 'axios';

const Employee_Form = () => {
  const [employeeData, setEmployeeData] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    address: {
      street_num: '',
      street_name: '',
      postal_code: '',
      city: '',
      state: '',
    },
    email: '',
    phone: '',
    sex: '',
    dob: '',
    education: '',
    role: '',
    specialization: '',
    clinic_id: '',
    department_id: '',
    hire_date: '',
  });

  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    if (name in employeeData) {
      setEmployeeData({ ...employeeData, [name]: value });
    } else {
      setEmployeeData({
        ...employeeData,
        address: {
          ...employeeData.address,
          [name]: value,
        },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Add the address first
      const addressRes = await axios.post('http://localhost:5000/api/addresses', employeeData.address);
      const addressId = addressRes.data.address_id; // Assuming the backend returns the address_id

      // Step 2: Add the employee with the returned address_id
      const employeeRes = await axios.post(
        'http://localhost:5000/api/create-employee',
        { ...employeeData, address_id: addressId },
        { withCredentials: true }
      );

      if (employeeRes.status === 200) {
        alert('Employee added successfully!');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Error adding employee');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
    <div>
      {/* Employee Fields */}
      <input
        type="text"
        name="first_name"
        value={employeeData.first_name}
        onChange={handleEmployeeChange}
        placeholder="First Name"
        required
      />
      <input
        type="text"
        name="last_name"
        value={employeeData.last_name}
        onChange={handleEmployeeChange}
        placeholder="Last Name"
        required
      />
      <input
        type="text"
        name="middle_name"
        value={employeeData.middle_name}
        onChange={handleEmployeeChange}
        placeholder="Middle Name"
      />
      {/* Address Fields */}
      <input
        type="text"
        name="street_num"
        value={employeeData.address.street_num}
        onChange={handleEmployeeChange}
        placeholder="Street Number"
        required
      />
      <input
        type="text"
        name="street_name"
        value={employeeData.address.street_name}
        onChange={handleEmployeeChange}
        placeholder="Street Name"
        required
      />
      <input
        type="text"
        name="postal_code"
        value={employeeData.address.postal_code}
        onChange={handleEmployeeChange}
        placeholder="Postal Code"
        required
      />
      <input
        type="text"
        name="city"
        value={employeeData.address.city}
        onChange={handleEmployeeChange}
        placeholder="City"
        required
      />
      <input
        type="text"
        name="state"
        value={employeeData.address.state}
        onChange={handleEmployeeChange}
        placeholder="State"
        required
      />
        {/* Employee Fields again*/}
      <input
        type="email"
        name="email"
        value={employeeData.email}
        onChange={handleEmployeeChange}
        placeholder="Email"
        required
      />
      <input
        type="text"
        name="phone"
        value={employeeData.phone}
        onChange={handleEmployeeChange}
        placeholder="Phone Number"
        required
      />
      <select
        type="text"
        name="sex"
        value={employeeData.sex}
        onChange={handleEmployeeChange}
        placeholder="Sex"
        >
        <option value="1">male</option>
        <option value="2">female</option>
        <option value="3">other</option>
      </select>
      <input
        type="date"
        name="dob"
        value={employeeData.date_of_birth}
        onChange={handleEmployeeChange}
        placeholder="Date of Birth"
        required
      />
      <input
        type="text"
        name="education"
        value={employeeData.education}
        onChange={handleEmployeeChange}
        placeholder="Education"
      />
      <select
        name="role"
        value={employeeData.role}
        onChange={handleEmployeeChange}
        placeholder="Role"
        required
        >
        <option value="1">Doctor</option>
        <option value="2">Nurse</option>
        <option value="3">Receptionist</option>
      </select>
      <input
        type="text"
        name="specialization"
        value={employeeData.specialization}
        onChange={handleEmployeeChange}
        placeholder="Specialization"
      />
      <select
        name="clinic_id"
        value={employeeData.clinic_id}
        onChange={handleEmployeeChange}
        placeholder="clinic"
        required
        >
        <option value="1">Clinic 1</option>
        <option value="2">Clinic 2</option>
        <option value="3">Clinic 3</option>
      </select>
      <input
        type="text"
        name="department_id"
        value={employeeData.department_id}
        onChange={handleEmployeeChange}
        placeholder="department"
      />
      <input
        type="date"
        name="hire_date"
        value={employeeData.hire_date}
        onChange={handleEmployeeChange}
        required
      />
      </div>
      <button type="submit">Add Employee</button>
    </form>
  );
};

export default Employee_Form;