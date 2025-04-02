// import React from 'react';
// import axios from 'axios';
// import '../../styles/AdminDashboard.css';

// // Simple class-based component that doesn't rely on hooks
// class CreateEmployeeForm extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       clinics: [],
//       departments: [],
//       employeeData: {
//         first_name: '', 
//         last_name: '', 
//         middle_name: '',
//         address: { 
//           street_num: '', 
//           street_name: '', 
//           postal_code: '', 
//           city: '', 
//           state: '' 
//         },
//         email: '', 
//         phone: '', 
//         sex: '', 
//         dob: '', 
//         education: '', 
//         role: '',
//         specialization: '', 
//         clinic_id: '', 
//         department_id: '', 
//         hire_date: ''
//       },
//       errors: {}
//     };
//   }

//   async componentDidMount() {
//     try {
//       const clinicRes = await axios.get("http://localhost:5000/api/admin/clinics");
//       const deptRes = await axios.get("http://localhost:5000/api/admin/departments");
  
//       this.setState({
//         clinics: clinicRes.data,
//         departments: deptRes.data
//       });
//     } catch (err) {
//       console.error("Failed to fetch clinics or departments", err);
//     }
//   }
  

//   validateField = (name, value) => {
//     let error = '';
    
//     switch(name) {
//       case 'first_name':
//       case 'last_name':
//         if (value.length > 100) {
//           error = 'Name cannot exceed 100 characters';
//         }
//         break;
//       case 'middle_name':
//         if (value && value.length > 100) {
//           error = 'Middle name cannot exceed 100 characters';
//         }
//         break;
//       case 'street_num':
//         if (value.length > 45) {
//           error = 'Street number cannot exceed 45 characters';
//         }
//         break;
//       case 'street_name':
//       case 'city':
//       case 'state':
//         if (value.length > 100) {
//           error = 'Field cannot exceed 100 characters';
//         }
//         break;
//       case 'postal_code':
//         if (value.length > 45) {
//           error = 'Postal code cannot exceed 45 characters';
//         }
//         // US/Canada postal code validation
//         if (!/^\d{5}(-\d{4})?$/.test(value) && !/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(value)) {
//           error = 'Please enter a valid postal code';
//         }
//         break;
//       case 'email':
//         if (!/\S+@\S+\.\S+/.test(value)) {
//           error = 'Please enter a valid email address';
//         }
//         break;
//       case 'phone':
//         if (value.length > 10) {
//           error = 'Phone number cannot exceed 10 characters';
//         }
//         // Allow formats like (123) 456-7890, 123-456-7890, or 1234567890
//         if (!/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value)) {
//           error = 'Please enter a valid phone number';
//         }
//         break;
//       case 'dob':
//         const today = new Date();
//         const birthDate = new Date(value);
//         if (birthDate > today) {
//           error = 'Date of birth cannot be in the future';
//         }
//         break;
//       case 'hire_date':
//         const hireDate = new Date(value);
//         if (hireDate > new Date()) {
//           error = 'Hire date cannot be in the future';
//         }
//         break;
//       case 'education':
//         if (value.length > 255) {
//           error = 'Education cannot exceed 255 characters';
//         }
//         break;
//       case 'specialization':
//         if (value.length > 100) {
//           error = 'Specialization cannot exceed 100 characters';
//         }
//         break;
//       default:
//         break;
//     }
    
//     return error;
//   };

//   handleChange = (e) => {
//     const { name, value } = e.target;
//     const { employeeData, errors } = this.state;
    
//     // Validate the field
//     const error = this.validateField(name, value);
//     const updatedErrors = { ...errors, [name]: error };
    
//     let updatedEmployeeData;
    
//     if (name in employeeData) {
//       updatedEmployeeData = { ...employeeData, [name]: value };
//     } else {
//       updatedEmployeeData = {
//         ...employeeData,
//         address: { ...employeeData.address, [name]: value }
//       };
//     }
    
//     this.setState({
//       employeeData: updatedEmployeeData,
//       errors: updatedErrors
//     });
//   };

//   validateForm = () => {
//     const { employeeData } = this.state;
//     let formErrors = {};
//     let isValid = true;
    
//     // Validate all fields
//     Object.keys(employeeData).forEach(key => {
//       if (key === 'address') {
//         Object.keys(employeeData.address).forEach(addressKey => {
//           const error = this.validateField(addressKey, employeeData.address[addressKey]);
//           if (error) {
//             formErrors[addressKey] = error;
//             isValid = false;
//           }
//         });
//       } else {
//         const error = this.validateField(key, employeeData[key]);
//         if (error) {
//           formErrors[key] = error;
//           isValid = false;
//         }
//       }
//     });
    
//     // Required field validation
//     const requiredFields = [
//       'first_name', 'last_name', 'email', 'phone', 
//       'sex', 'dob', 'role', 'clinic_id', 'hire_date'
//     ];
    
//     const requiredAddressFields = [
//       'street_num', 'street_name', 'postal_code', 'city', 'state'
//     ];
    
//     requiredFields.forEach(field => {
//       if (!employeeData[field]) {
//         formErrors[field] = 'This field is required';
//         isValid = false;
//       }
//     });
    
//     requiredAddressFields.forEach(field => {
//       if (!employeeData.address[field]) {
//         formErrors[field] = 'This field is required';
//         isValid = false;
//       }
//     });
    
//     this.setState({ errors: formErrors });
//     return isValid;
//   };

//   handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!this.validateForm()) {
//       alert('Please correct the errors in the form');
//       return;
//     }
    
//     try {
//       const { employeeData } = this.state;
//       const addressRes = await axios.post('http://localhost:5000/api/addresses', employeeData.address);
//       const addressId = addressRes.data.address_id;
      
//       const employeeRes = await axios.post(
//         'http://localhost:5000/api/admin/create-employee',
//         { ...employeeData, address_id: addressId }
//       );
      
//       if (employeeRes.status === 200) {
//         alert('Employee added successfully!');
//         // Reset form
//         this.setState({
//           employeeData: {
//             first_name: '', last_name: '', middle_name: '',
//             address: { street_num: '', street_name: '', postal_code: '', city: '', state: '' },
//             email: '', phone: '', sex: '', dob: '', education: '', role: '',
//             specialization: '', clinic_id: '', department_id: '', hire_date: ''
//           },
//           errors: {}
//         });
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Failed to add employee. ' + (error.response?.data?.message || error.message));
//     }
//   };

//   render() {
//     const { employeeData, errors, clinics, departments } = this.state;

//     return (
//       <form onSubmit={this.handleSubmit} className="admin-box">
//         <h3>Create New Employee</h3>
        
//         <div className="form-group">
//           <label>First Name *</label>
//           <input 
//             name="first_name" 
//             placeholder="First Name" 
//             value={employeeData.first_name} 
//             onChange={this.handleChange} 
//             required 
//             maxLength={100}
//             className={errors.first_name ? 'input-error' : ''}
//           />
//           {errors.first_name && <div className="error-message">{errors.first_name}</div>}
//         </div>
        
//         <div className="form-group">
//           <label>Last Name *</label>
//           <input 
//             name="last_name" 
//             placeholder="Last Name" 
//             value={employeeData.last_name} 
//             onChange={this.handleChange} 
//             required 
//             maxLength={100}
//             className={errors.last_name ? 'input-error' : ''}
//           />
//           {errors.last_name && <div className="error-message">{errors.last_name}</div>}
//         </div>
        
//         <div className="form-group">
//           <label>Middle Name</label>
//           <input 
//             name="middle_name" 
//             placeholder="Middle Name" 
//             value={employeeData.middle_name} 
//             onChange={this.handleChange}
//             maxLength={100} 
//             className={errors.middle_name ? 'input-error' : ''}
//           />
//           {errors.middle_name && <div className="error-message">{errors.middle_name}</div>}
//         </div>

//         <div className="form-section">
//           <h4>Address Information</h4>
          
//           <div className="form-group">
//             <label>Street Number *</label>
//             <input 
//               name="street_num" 
//               placeholder="Street Number" 
//               value={employeeData.address.street_num} 
//               onChange={this.handleChange} 
//               required
//               maxLength={45}
//               className={errors.street_num ? 'input-error' : ''}
//             />
//             {errors.street_num && <div className="error-message">{errors.street_num}</div>}
//           </div>
          
//           <div className="form-group">
//             <label>Street Name *</label>
//             <input 
//               name="street_name" 
//               placeholder="Street Name" 
//               value={employeeData.address.street_name} 
//               onChange={this.handleChange} 
//               required
//               maxLength={100}
//               className={errors.street_name ? 'input-error' : ''}
//             />
//             {errors.street_name && <div className="error-message">{errors.street_name}</div>}
//           </div>
          
//           <div className="form-group">
//             <label>Postal Code *</label>
//             <input 
//               name="postal_code" 
//               placeholder="Postal Code" 
//               value={employeeData.address.postal_code} 
//               onChange={this.handleChange} 
//               required
//               maxLength={45}
//               className={errors.postal_code ? 'input-error' : ''}
//             />
//             {errors.postal_code && <div className="error-message">{errors.postal_code}</div>}
//           </div>
          
//           <div className="form-group">
//             <label>City *</label>
//             <input 
//               name="city" 
//               placeholder="City" 
//               value={employeeData.address.city} 
//               onChange={this.handleChange} 
//               required
//               maxLength={45}
//               className={errors.city ? 'input-error' : ''}
//             />
//             {errors.city && <div className="error-message">{errors.city}</div>}
//           </div>
          
//           <div className="form-group">
//             <label>State *</label>
//             <input 
//               name="state" 
//               placeholder="State" 
//               value={employeeData.address.state} 
//               onChange={this.handleChange} 
//               required
//               maxLength={45}
//               className={errors.state ? 'input-error' : ''}
//             />
//             {errors.state && <div className="error-message">{errors.state}</div>}
//           </div>
//         </div>

//         <div className="form-section">
//           <h4>Personal Information</h4>
          
//           <div className="form-group">
//             <label>Email *</label>
//             <input 
//               type="email" 
//               name="email" 
//               placeholder="Email" 
//               value={employeeData.email} 
//               onChange={this.handleChange} 
//               required
//               className={errors.email ? 'input-error' : ''}
//             />
//             {errors.email && <div className="error-message">{errors.email}</div>}
//           </div>
          
//           <div className="form-group">
//             <label>Phone Number *</label>
//             <input 
//               name="phone" 
//               placeholder="Phone Number" 
//               value={employeeData.phone} 
//               onChange={this.handleChange} 
//               required
//               maxLength={10}
//               className={errors.phone ? 'input-error' : ''}
//             />
//             {errors.phone && <div className="error-message">{errors.phone}</div>}
//           </div>
          
//           <div className="form-group">
//             <label>Gender *</label>
//             <select 
//               name="sex" 
//               value={employeeData.sex} 
//               onChange={this.handleChange} 
//               required
//               className={errors.sex ? 'input-error' : ''}
//             >
//               <option value="">-- Select Gender --</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//             </select>
//             {errors.sex && <div className="error-message">{errors.sex}</div>}
//           </div>
          
//           <div className="form-group">
//             <label>Date of Birth *</label>
//             <input 
//               type="date" 
//               name="dob" 
//               placeholder="Date of Birth" 
//               value={employeeData.dob} 
//               onChange={this.handleChange} 
//               required
//               className={errors.dob ? 'input-error' : ''}
//             />
//             {errors.dob && <div className="error-message">{errors.dob}</div>}
//           </div>
//         </div>

//         <div className="form-section">
//           <h4>Professional Information</h4>
          
//           <div className="form-group">
//             <label>Education</label>
//             <input 
//               name="education" 
//               placeholder="Education" 
//               value={employeeData.education} 
//               onChange={this.handleChange}
//               maxLength={255}
//               className={errors.education ? 'input-error' : ''}
//             />
//             {errors.education && <div className="error-message">{errors.education}</div>}
//           </div>
          
//           <div className="form-group">
//             <label>Role *</label>
//             <select 
//               name="role" 
//               value={employeeData.role} 
//               onChange={this.handleChange} 
//               required
//               className={errors.role ? 'input-error' : ''}
//             >
//               <option value="">-- Select Role --</option>
//               <option value="1">Doctor</option>
//               <option value="2">Nurse</option>
//               <option value="3">Receptionist</option>
//               <option value="4">Datbase Administrator</option>
         
//             </select>
//             {errors.role && <div className="error-message">{errors.role}</div>}
//           </div>
          
//           {/* Show specialization only for doctors and nurses */}
//           {(employeeData.role === '1' || employeeData.role === '2') && (
//             <div className="form-group">
//               <label>Specialization</label>
//               <select 
//                 name="specialization" 
//                 value={employeeData.specialization} 
//                 onChange={this.handleChange}
//                 maxLength={100}
//                 className={errors.specialization ? 'input-error' : ''}
//               >
//                 <option value="">-- Select Specialization --</option>
//                 <option value="Primary Care">Primary Care</option>
//                 <option value="Cardiology">Cardiology</option>
//                 <option value="Internal Medicine">Internal Medicine</option>
//                 <option value="Pediatrics">Pediatrics</option>
//               </select>
//               {errors.specialization && <div className="error-message">{errors.specialization}</div>}
//             </div>
//           )}
          
//           <div className="form-group">
//             <label>Clinic *</label>
//             <select 
//               name="clinic_id" 
//               value={employeeData.clinic_id} 
//               onChange={this.handleChange} 
//               required
//               className={errors.clinic_id ? 'input-error' : ''}
//             >
//               <option value="">-- Select Clinic --</option>
//               <option value="1">Clinic 1</option>
//               {clinics.map(clinic => (
//                 <option key={clinic.clinic_id} value={clinic.clinic_id}>
//                   {clinic.clinic_name}
//                 </option>
//               ))}
//             </select>
//             {errors.clinic_id && <div className="error-message">{errors.clinic_id}</div>}
//           </div>
          
//           <div className="form-group">
//             <label>Department</label>
//             <select 
//               name="department_id" 
//               value={employeeData.department_id} 
//               onChange={this.handleChange}
//               className={errors.department_id ? 'input-error' : ''}
//             >
//               <option value="">-- Select Department --</option>
//               {departments.map(dept => (
//                 <option key={dept.department_id} value={dept.department_id}>
//                   {dept.department_name}
//                 </option>
//               ))}
//             </select>
//             {errors.department_id && <div className="error-message">{errors.department_id}</div>}
//           </div>
          
//           <div className="form-group">
//             <label>Hire Date *</label>
//             <input 
//               type="date" 
//               name="hire_date" 
//               placeholder="Hire Date" 
//               value={employeeData.hire_date} 
//               onChange={this.handleChange} 
//               required
//               className={errors.hire_date ? 'input-error' : ''}
//             />
//             {errors.hire_date && <div className="error-message">{errors.hire_date}</div>}
//           </div>
//         </div>

//         <button type="submit" className="submit-btn">Add Employee</button>
//       </form>
//     );
//   }
// }
// export default CreateEmployeeForm;
import React from 'react';
import axios from 'axios';
import '../../styles/AdminDashboard.css';

class CreateEmployeeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clinics: [],
      departments: [],
      states: [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
        'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
        'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
        'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
        'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
        'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
        'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
        'Wisconsin', 'Wyoming'
      ],
      successMsg: '',
      errorMsg: '',
      employeeData: {
        first_name: '', 
        last_name: '', 
        middle_name: '',
        address: { 
          street_num: '', 
          street_name: '', 
          postal_code: '', 
          city: '', 
          state: '' 
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
        license_number: '',
        hire_date: ''
      },
      errors: {}
    };
  }

  async componentDidMount() {
    try {
      const clinicRes = await axios.get("http://localhost:5000/api/admin/clinics");
      const deptRes = await axios.get("http://localhost:5000/api/admin/departments");

      this.setState({
        clinics: clinicRes.data,
        departments: deptRes.data
      });
    } catch (err) {
      console.error("Failed to fetch clinics or departments", err);
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    const { employeeData, errors } = this.state;

    let formattedValue = value;
    if (name === 'phone') {
      formattedValue = value.replace(/[^\d]/g, '').slice(0, 10);
    }

    const error = this.validateField(name, formattedValue);
    const updatedErrors = { ...errors, [name]: error };

    let updatedEmployeeData;
    if (name in employeeData) {
      updatedEmployeeData = { ...employeeData, [name]: formattedValue };
    } else {
      updatedEmployeeData = {
        ...employeeData,
        address: { ...employeeData.address, [name]: formattedValue }
      };
    }

    if (name === 'role') {
      updatedEmployeeData.specialization = '';
      updatedEmployeeData.department_id = '';
    }

    this.setState({
      employeeData: updatedEmployeeData,
      errors: updatedErrors,
      successMsg: '',
      errorMsg: ''
    });
  };

  validateField = (name, value) => {
    let error = '';
    if (!value && ["first_name", "last_name", "email", "phone", "sex", "dob", "role", "clinic_id", "hire_date"].includes(name)) {
      error = "This field is required";
    }
  

    if (name === 'postal_code') {
      const zipRegex = /^\d{5}(-\d{4})?$/;
      if (!zipRegex.test(value)) {
        error = 'Invalid ZIP code format';
      }
    }

    return error;
  };

  validateForm = () => {
    const { employeeData } = this.state;
    let errors = {};
    let isValid = true;

    const requiredFields = ['first_name', 'last_name', 'email', 'phone', 'sex', 'dob', 'role', 'clinic_id', 'hire_date'];
    const requiredAddressFields = ['street_num', 'street_name', 'postal_code', 'city', 'state'];

    requiredFields.forEach(field => {
      if (!employeeData[field]) {
        errors[field] = 'This field is required';
        isValid = false;
      }
    });

    requiredAddressFields.forEach(field => {
      if (!employeeData.address[field]) {
        errors[field] = 'This field is required';
        isValid = false;
      }
    });
    if ((employeeData.role === '1' || employeeData.role === '2') && !employeeData.license_number) {
      errors.license_number = 'License number is required for this role';
      isValid = false;
    }
    

    if (employeeData.role === '1' && (!employeeData.specialization || !employeeData.department_id)) {
      errors.specialization = 'Specialization is required for doctors';
      errors.department_id = 'Department is required for doctors';
      isValid = false;
    }

    if (employeeData.role === '2' && !employeeData.department_id) {
      errors.department_id = 'Department is required for nurses';
      isValid = false;
    }

    this.setState({ errors });
    return isValid;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    if (!this.validateForm()) {
      this.setState({ errorMsg: 'Please correct the errors in the form.', successMsg: '' });
      return;
    }

    try {
      const { employeeData } = this.state;
      const res = await axios.post("http://localhost:5000/api/admin/create-employee", employeeData);
      if (res.status === 200) {
        this.setState({
          successMsg: "Employee created successfully!",
          errorMsg: '',
          employeeData: {
            first_name: '', last_name: '', middle_name: '',
            address: { street_num: '', street_name: '', postal_code: '', city: '', state: '' },
            email: '', phone: '', sex: '', dob: '', education: '', role: '',
            specialization: '', clinic_id: '', department_id: '', hire_date: ''
          },
          errors: {}
        });
      }
    } catch (err) {
      console.error(err);
      this.setState({ errorMsg: 'Error creating employee.', successMsg: '' });
    }
  };

  render() {
    const { employeeData, errors, clinics, departments, states, successMsg, errorMsg } = this.state;

    return (
      <form onSubmit={this.handleSubmit} className="admin-box">
        <h3>Create New Employee</h3>

        {successMsg && <div className="success-message">{successMsg}</div>}
        {errorMsg && <div className="error-message">{errorMsg}</div>}

        <input name="first_name" value={employeeData.first_name} onChange={this.handleChange} placeholder="First Name *" className={errors.first_name ? 'input-error' : ''} />
        {errors.first_name && <div className="error-message">{errors.first_name}</div>}

        <input name="last_name" value={employeeData.last_name} onChange={this.handleChange} placeholder="Last Name *" className={errors.last_name ? 'input-error' : ''} />
        {errors.last_name && <div className="error-message">{errors.last_name}</div>}

        <input name="middle_name" value={employeeData.middle_name} onChange={this.handleChange} placeholder="Middle Name" />

        <h4>Address</h4>
        {['street_num', 'street_name', 'postal_code', 'city'].map(field => (
          <input
            key={field}
            name={field}
            value={employeeData.address[field]}
            onChange={this.handleChange}
            placeholder={`${field.replace('_', ' ')} *`}
            className={errors[field] ? 'input-error' : ''}
          />
        ))}

        <select name="state" value={employeeData.address.state} onChange={this.handleChange} className={errors.state ? 'input-error' : ''}>
          <option value="">-- Select State --</option>
          {states.map((stateName) => (
            <option key={stateName} value={stateName}>{stateName}</option>
          ))}
        </select>

        <input name="email" value={employeeData.email} onChange={this.handleChange} placeholder="Email *" className={errors.email ? 'input-error' : ''} />
        {errors.email && <div className="error-message">{errors.email}</div>}

        <input name="phone" value={employeeData.phone} onChange={this.handleChange} placeholder="Phone * (10 digits)" className={errors.phone ? 'input-error' : ''} />

        <input name="dob" type="date" value={employeeData.dob} onChange={this.handleChange} className={errors.dob ? 'input-error' : ''} />

        <input name="education" value={employeeData.education} onChange={this.handleChange} placeholder="Education (e.g. MBBS, BSc in Nursing)" />

        <select name="sex" value={employeeData.sex} onChange={this.handleChange} className={errors.sex ? 'input-error' : ''}>
          <option value="">-- Select Gender --</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <select name="role" value={employeeData.role} onChange={this.handleChange} className={errors.role ? 'input-error' : ''}>
          <option value="">-- Select Role --</option>
          <option value="1">Doctor</option>
          <option value="2">Nurse</option>
          <option value="3">Receptionist</option>
          <option value="4">Database Administrator</option>
        </select>

        {employeeData.role === '1' && (
          <input
            name="specialization"
            value={employeeData.specialization}
            onChange={this.handleChange}
            placeholder="Specialization *"
            className={errors.specialization ? 'input-error' : ''}
          />
        )}

        {(employeeData.role === '1' || employeeData.role === '2') && (
          <select name="department_id" value={employeeData.department_id} onChange={this.handleChange} className={errors.department_id ? 'input-error' : ''}>
            <option value="">-- Select Department --</option>
            {departments.map(dept => (
              <option key={dept.department_id} value={dept.department_id}>{dept.department_name}</option>
            ))}
          </select>
        )}
        {(employeeData.role === '1' || employeeData.role === '2') && (
  <input
    name="license_number"
    value={employeeData.license_number || ''}
    onChange={this.handleChange}
    placeholder="License Number *"
    className={errors.license_number ? 'input-error' : ''}
  />
)}
{errors.license_number && <div className="error-message">{errors.license_number}</div>}


        <select name="clinic_id" value={employeeData.clinic_id} onChange={this.handleChange} className={errors.clinic_id ? 'input-error' : ''}>
          <option value="">-- Select Clinic --</option>
          {clinics.map(clinic => (
            <option key={clinic.clinic_id} value={clinic.clinic_id}>{clinic.clinic_name}</option>
          ))}
        </select>

        <input name="hire_date" type="date" value={employeeData.hire_date} onChange={this.handleChange} className={errors.hire_date ? 'input-error' : ''} />

        <button type="submit">Add Employee</button>
      </form>
    );
  }
}

export default CreateEmployeeForm;
