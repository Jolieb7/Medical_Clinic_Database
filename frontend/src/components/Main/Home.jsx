import React from 'react';
import "../../styles/Home.css"
import logo from '../../assets/clinic-logo.png';
import bgImage from '../../assets/healthcare-bg.jpg';

const Home = () => {
  return (

    <div
      className="home"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundColor: '#004080'
      }}
      
    
    >
     

      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="MedBridge Clinic Logo" />
          <h1>Care Connect Clinic</h1>
        </div>
        <ul className="nav-links">
          <li><a href="#about">About Us</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="/login">User Login</a></li>
        </ul>
      </nav>

      <main className="main-section">
      <div className="overlay">
        <h2>Your Health, Our Priority</h2>
        <p>Connecting you to quality healthcare</p>
        <a href="/login" className="cta-button">Login to Your Portal</a>
        <p></p>
        <p><a href="/login" className="cta-button">Pay Bill</a></p>
      </div>
    </main>
      <footer className="footer">
        <h3>Our Locations</h3>
        <div className="locations">
          <div className="location">
            <strong>Houston, TX</strong>
            <p>123 Medical Plaza, Houston, TX 77002</p>
          </div>
          <div className="location">
            <strong>Miami, FL</strong>
            <p>789 Sunshine Blvd, Miami, FL 33101</p>
          </div>
          <div className="location">
            <strong>New Orleans, LA</strong>
            <p>456 Bourbon Street, New Orleans, LA 70112</p>
          </div>
        </div>
      </footer>
    </div>

  );

};
console.log("Home component rendered");


export default Home;
