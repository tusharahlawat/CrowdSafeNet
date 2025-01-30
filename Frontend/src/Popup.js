import React from 'react';
import './Popup.css';  // You can define custom styles here

const Popup = ({ alertData, onClose, onSOS }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Emergency Alert</h2>
        <div className="alert-section">
          <p><strong>SOS Triggered:</strong> {alertData.sos ? 'Yes' : 'No'}</p>
          <p><strong>Alert Level:</strong> {alertData.level}</p>
          <p><strong>Flagged Alerts:</strong> {alertData.flaggedAlerts}</p>
        </div>
        <button className="sos-button" onClick={onSOS}>Trigger SOS</button>
      </div>
    </div>
  );
};

export default Popup;
