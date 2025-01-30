import React, { useState, useEffect } from "react";
import WebSocketService from "./websocket"; // Import your WebSocketService

const WebSocketDisplay = () => {
  const [videoFeeds, setVideoFeeds] = useState({ cam1: null, cam2: null });
  const [alertData, setAlertData] = useState(null);
  const [threatData, setThreatData] = useState(null);

  useEffect(() => {
    // Initialize WebSocketService
    const wsService = new WebSocketService();

    // Callback function to handle incoming WebSocket messages
    const handleMessage = (data) => {
      // Handle video feed data
      if (data.type === "video_frame_1") {
        if (data.data) {
          setVideoFeeds((prev) => ({
            ...prev,
            cam1: `data:image/jpeg;base64,${data.data}`,
          }));
        }
      } else if (data.type === "video_frame_2") {
        if (data.data) {
          setVideoFeeds((prev) => ({
            ...prev,
            cam2: `data:image/jpeg;base64,${data.data}`,
          }));
        }
      }

      // Handle Alert data
      else if (data.type === "Alert") {
        setAlertData(data.alertData);
      }

      // Handle Threat data
      else if (data.type === "Threat") {
        setThreatData(data.threatData);
      }
    };

    // Connect to the WebSocket server and pass the message handler
    wsService.connect("http://127.0.0.1:5000", handleMessage);

    // Cleanup WebSocket connection on unmount
    return () => {
      wsService.disconnect();
    };
  }, []);

  return (
    <div className="websocket-display">
      <div className="video-feeds">
        <div className="video-feed">
          <h2>Camera 1 - Live Feed</h2>
          {videoFeeds.cam1 ? (
            <img
              src={videoFeeds.cam1}
              alt="Camera 1 Feed"
              width="100%"
              height="100%"
            />
          ) : (
            <p>Waiting for live feed...</p>
          )}
        </div>

        <div className="video-feed">
          <h2>Camera 2 - Live Feed</h2>
          {videoFeeds.cam2 ? (
            <img
              src={videoFeeds.cam2}
              alt="Camera 2 Feed"
              width="100%"
              height="100%"
            />
          ) : (
            <p>Waiting for live feed...</p>
          )}
        </div>
      </div>

      <div className="alert-section">
        <h3>Alert Details</h3>
        {alertData ? (
          <div>
            <p><strong>Anomaly:</strong> {alertData}</p>
          </div>
        ) : (
          <p>No alert data received.</p>
        )}
      </div>

      <div className="threat-section">
        <h3>Threat Details</h3>
        {threatData ? (
          <div>
            <p><strong>Threat Level:</strong> {threatData}</p>
          </div>
        ) : (
          <p>No threat data received.</p>
        )}
      </div>
    </div>
  );
};

export default WebSocketDisplay;
