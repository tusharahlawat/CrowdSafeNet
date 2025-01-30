import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import WebSocketService from "./websocket";
import "./Dashboard.css";

const DashboardPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [videoFeeds, setVideoFeeds] = useState({ cam1: null, cam2: null });
  const [alertData, setAlertData] = useState({
    sos: false,
    level: "Low",
    anomaly: "None",
    flaggedAlerts: 0,
  });
  const navigate = useNavigate();

  // Update localStorage when the alert data changes
  useEffect(() => {
    const storedAlerts = JSON.parse(localStorage.getItem("alerts")) || [];
    setAlertData((prev) => ({
      ...prev,
      flaggedAlerts: storedAlerts.length,
    }));
  }, []);

  useEffect(() => {
    const wsService = new WebSocketService();

    wsService.connect("ws://127.0.0.1:5000", (data) => {
      if (data.type === "video_frame_1") {
        // Handle cam1 video frame data
        if (data.data) {
          setVideoFeeds((prev) => ({
            ...prev,
            cam1: `data:image/jpeg;base64,${data.data}`,
          }));
        }
      } else if (data.type === "video_frame_2") {
        // Handle cam2 video frame data
        if (data.data) {
          setVideoFeeds((prev) => ({
            ...prev,
            cam2: `data:image/jpeg;base64,${data.data}`,
          }));
        }
      } else if (data.type === "Alert") {
        // Handle alert data and update the alertData object
        setAlertData((prev) => ({
          ...prev,
          anomaly: data.alertData || "None", // Ensure anomaly data is correctly set
        }));
      } else if (data.type === "Threat") {
        // Handle threat data
        setAlertData((prev) => ({
          ...prev,
          level: data.threatData || "Low", // Ensure threat level is correctly set
        }));
      }
    });

    return () => {
      wsService.disconnect();
    };
  }, []);

  // Function to handle flagging a new alert
  const handleFlagNewAlert = () => {
    // Create a new alert object (you can adjust the structure as needed)
    const newAlert = {
      id: Date.now(),  // Unique ID based on timestamp
      description: "New flagged alert",  // This could be dynamic based on the detected anomaly
      timestamp: new Date().toLocaleString(),  // Add a timestamp for when the alert was flagged
    };

    // Fetch current alerts from localStorage
    const storedAlerts = JSON.parse(localStorage.getItem("alerts")) || [];

    // Add the new alert to the alerts list
    storedAlerts.push(newAlert);

    // Update localStorage with the new alerts list
    localStorage.setItem("alerts", JSON.stringify(storedAlerts));

    // Update the flaggedAlerts count in localStorage
    localStorage.setItem("flaggedAlerts", storedAlerts.length);

    // Update the local state for alertData
    setAlertData((prev) => ({
      ...prev,
      flaggedAlerts: storedAlerts.length,
    }));
  };

  return (
    <div className="dashboard-container">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="dashboard-content"
      >
        <div className="header">
          <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </div>
        </div>
        <h1 className="dashboard-title">CrowdSafeNet</h1>
        <motion.div
          className={`dropdown-menu ${menuOpen ? "open" : ""}`}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: menuOpen ? 0 : -20, opacity: menuOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ul>
            <li onClick={() => navigate("/")}>Home</li>
            <li onClick={() => navigate("/aboutus")}>About Us</li>
            <li onClick={() => navigate("/flagged-alerts")}>
              Flagged Alerts {alertData.flaggedAlerts > 0 && `(${alertData.flaggedAlerts})`}
            </li>
            <li onClick={() => navigate("/login")}>Switch Account</li>
            <li onClick={() => { localStorage.clear(); navigate("/login"); }}>Logout</li>
          </ul>
        </motion.div>

        <div className="dashboard-grid">
          {["cam1", "cam2"].map((cam, index) => (
            <div
              key={index}
              className="camera-feed wide"
              style={{ width: "700px", height: "350px" }}
              onClick={() => setSelectedFeed(cam)}
            >
              <h2>{`Cam ${index + 1} - Live Feed`}</h2>
              <div className="video-placeholder" style={{ width: "100%", height: "300px" }}>
                {videoFeeds[cam] ? (
                  <img
                    src={videoFeeds[cam]}
                    alt={`Camera ${index + 1}`}
                    width="100%"
                    height="100%"
                  />
                ) : (
                  <p>Waiting for live feed...</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedFeed && (
          <div className="video-details-popup">
            <button onClick={() => setSelectedFeed(null)} className="close-btn">
              X
            </button>
            <div className="popup-content">
              <div className="popup-video-section">
                <h2>{selectedFeed === "cam1" ? "Cam 1" : "Cam 2"} - Live Feed</h2>
                {videoFeeds[selectedFeed] ? (
                  <img
                    src={videoFeeds[selectedFeed]}
                    alt={selectedFeed}
                    width="100%"
                    height="100%"
                  />
                ) : (
                  <p>Waiting for live feed...</p>
                )}
              </div>
            </div>
            <div className="popup-details-section">
              <h3>Alert Details</h3>
              <div className="details-row">
                <p><strong>SOS Triggered:</strong> {alertData.sos ? 'Yes' : 'No'}</p>
                <button
                  className="sos-button"
                  onClick={() => setAlertData({ ...alertData, sos: true })}
                >
                  Trigger SOS
                </button>
              </div>
              <div className="details-row">
                <p><strong>Alert Level:</strong> {alertData.level}</p>
              </div>
              <div className="details-row">
                <p><strong>Anomaly:</strong> {alertData.anomaly}</p>
              </div>
              <div className="details-row">
                <p><strong>Flagged Alerts:</strong> {alertData.flaggedAlerts}</p>
                <button
                  className="sos-button"
                  onClick={handleFlagNewAlert}
                >
                  Flag New Alert
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardPage;
