import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Employee_Form from "../components/Employee_Form";


const Admin_dashboard = () => {
    return (
        <div style={{ maxWidth: "400px", margin: "0 auto" }}>
          <h2>Dashboard</h2>
          <p>Welcome to the dashboard Admin!</p>
          <Employee_Form />
        </div>
      );
}

export default Admin_dashboard;