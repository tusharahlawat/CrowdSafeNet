import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./WelcomePage.css"; // Import the updated CSS

const WelcomePage = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle the button click to navigate to the LoginPage
  const handleProceed = () => {
    navigate("/login"); // Navigate to the login page
  };

  return (
    <div className="welcome-container">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="welcome-card"
      >
        <h1 className="welcome-title">
          Welcome to <span className="highlight">CrowdSafeNet</span>
        </h1>
        <h2 className="welcome-motto">"Detect, Prevent, Protect"</h2>
        <button className="welcome-button" onClick={handleProceed}>
          Proceed to Login
        </button>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
