import React, { useEffect, useState } from "react";
import "./FlaggedAlerts.css"
const FlaggedAlertsPage = () => {
    const [alerts, setAlerts] = useState([]);
  
    // Fetch the alerts from localStorage when the component mounts
    useEffect(() => {
      const storedAlerts = JSON.parse(localStorage.getItem("alerts")) || [];
      setAlerts(storedAlerts);
    }, []);
  
    // Function to remove an alert from the list
    const handleDismissAlert = (id) => {
      // Remove the alert from the list
      const updatedAlerts = alerts.filter(alert => alert.id !== id);
      setAlerts(updatedAlerts);
  
      // Update localStorage with the new alerts list
      localStorage.setItem("alerts", JSON.stringify(updatedAlerts));
  
      // Update the flaggedAlerts count in localStorage
      localStorage.setItem("flaggedAlerts", updatedAlerts.length);
    };
  
    // Function for taking action (for demo purposes, just logs the alert)
    const handleTakeAction = (id) => {
      const alert = alerts.find((alert) => alert.id === id);
      console.log(`Taking action on Alert ${alert.id}:`, alert);
      // You can add your custom action here, like navigating to a new page or updating the alert status.
    };
  
    return (
      <div className="flagged-alerts-container">
        <h1 className="page-title">Flagged Alerts</h1>
        <button className="back-btn" onClick={() => window.history.back()}>Back to Dashboard</button>
        <div className="alerts-list">
          {alerts.length === 0 ? (
            <p>No flagged alerts at the moment.</p>
          ) : (
            <ul>
              {alerts.map((alert) => (
                <li key={alert.id} className="alert-item">
                  <div className="alert-details">
                    <p><strong>Alert {alert.id}:</strong> {alert.description}</p>
                    <p><em>{alert.timestamp}</em></p>
                  </div>
                  <div>
                    <button 
                      className="dismiss-btn" 
                      onClick={() => handleDismissAlert(alert.id)}
                    >
                      Dismiss
                    </button>
                    <button 
                      className="take-action-btn"
                      onClick={() => handleTakeAction(alert.id)}
                    >
                      Take Action
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  };
  
  export default FlaggedAlertsPage;