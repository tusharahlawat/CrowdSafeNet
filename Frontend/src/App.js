import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./WelcomePage";
import LoginPage from "./LoginPage";
import AboutUsPage from "./AboutUsPage";
import DashboardPage from "./DashboardPage";
import FlaggedAlertsPage from "./FlaggedAlertsPage"; 
import FlaggedAlertsProvider from "./FlaggedAlertsContext"; // Corrected import for the default export

function App() {
  return (
    <FlaggedAlertsProvider>  {/* Wrap the app with the FlaggedAlertsProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/aboutus" element={<AboutUsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/flagged-alerts" element={<FlaggedAlertsPage />} />
        </Routes>
      </Router>
    </FlaggedAlertsProvider>
  );
}

export default App;
