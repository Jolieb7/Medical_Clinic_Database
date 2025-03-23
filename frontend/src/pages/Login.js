import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/login", {
        username,  // Match the backend field
        password,
      },
      { withCredentials: true }
    );

      if(res.status === 200){
        alert("Login successful!");
        localStorage.setItem("token", res.data.token);
        if (res.data.user.role === "Admin") {
          navigate("/admin_dashboard");
        } else {
        navigate("/dashboard");
        }
      }
      
    } catch (error) {
      alert("Invalid username or password");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        {/* Login text boxes */}
        <input
          type="text"  
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>

         {/* New user register Button */}
         <p style={{ marginTop: "10px" }}>
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            style={{ color: "blue", cursor: "pointer", background: "none", border: "none" }}
          >
            Register here
          </button>
        </p>
        
        {/* Testing Dashboard */}
        <p style={{ marginTop: "10px" }}>
          To Dashboard{" "}
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            style={{ color: "blue", cursor: "pointer", background: "none", border: "none" }}
          >
            here
          </button>
        </p>

      </form>
    </div>
  );
};

export default Login;


