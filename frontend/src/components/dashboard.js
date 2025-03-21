import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const dashboard = () => {
    return (
        <div style={{ maxWidth: "400px", margin: "0 auto" }}>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          </form>
        </div>
      );
}

export default dashboard;