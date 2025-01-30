import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/dashboard"); // Navigate to the Dashboard if login is successful
      } else {
        setErrorMessage(data.message); // Show error message if login fails
      }
    } catch (error) {
      setErrorMessage("Server error. Please try again later.");
    }
  };

  const handleCreateAccount = async () => {
    if (userID && password && password === confirmPassword) {
      try {
        const response = await fetch("/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID, password }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Account created successfully! You can now log in.");
          setIsCreatingAccount(false); // Switch to login form
        } else {
          setErrorMessage(data.message);
        }
      } catch (error) {
        setErrorMessage("Server error. Please try again later.");
      }
    } else {
      setErrorMessage("Passwords must match and fields cannot be empty.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>CrowdSafeNet</h2>

        {!isCreatingAccount ? (
          <>
            <input
              type="text"
              placeholder="User ID"
              className="input-field"
              value={userID}
              onChange={(e) => setUserID(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin} className="login-button">
              Login
            </button>
            <p>
              Don't have an account?{" "}
              <a onClick={() => setIsCreatingAccount(true)} className="link">
                Create Account
              </a>
            </p>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="User ID"
              className="input-field"
              value={userID}
              onChange={(e) => setUserID(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="input-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={handleCreateAccount} className="login-button">
              Create Account
            </button>
            <p>
              Already have an account?{" "}
              <a onClick={() => setIsCreatingAccount(false)} className="link">
                Login
              </a>
            </p>
          </>
        )}

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
