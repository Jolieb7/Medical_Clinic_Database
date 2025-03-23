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
    role: '',
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
        'http://localhost:5000/api/employees',
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
        type="email"
        name="email"
        value={employeeData.email}
        onChange={handleEmployeeChange}
        placeholder="Email"
        required
      />
      <input
        type="text"
        name="role"
        value={employeeData.role}
        onChange={handleEmployeeChange}
        placeholder="Role"
        required
      />
      <input
        type="date"
        name="hire_date"
        value={employeeData.hire_date}
        onChange={handleEmployeeChange}
        required
      />

      {/* Address Fields */}
      <input
        type="text"
        name="street"
        value={employeeData.address.street}
        onChange={handleEmployeeChange}
        placeholder="Street"
        required
      />
      <input
        type="text"
        name="number"
        value={employeeData.address.number}
        onChange={handleEmployeeChange}
        placeholder="Street Number"
        required
      />
      <input
        type="text"
        name="name"
        value={employeeData.address.name}
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

      <button type="submit">Add Employee</button>
    </form>
  );
};

export default Employee_Form;
