import React, { useState } from "react";
import { motion } from "framer-motion";
import "./CrowdSafeNet.css";
import LoginPage from "./LoginPage";
import WelcomePage from "./WelcomePage";
import DashboardPage from "./DashboardPage";

const CrowdSafeNet = () => {
  const [page, setPage] = useState("welcome");

  const handleLogin = () => {
    setPage("dashboard");
  };

  return (
    <div className="crowdsafenet-container">
      {page === "welcome" && <WelcomePage onProceed={() => setPage("login")} />}
      {page === "login" && <LoginPage onLogin={handleLogin} />}
      {page === "dashboard" && <DashboardPage />}
    </div>
  );
};

export default CrowdSafeNet;