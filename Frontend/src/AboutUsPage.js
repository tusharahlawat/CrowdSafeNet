import React from "react";
import { useNavigate } from "react-router-dom";
import "./AboutUsPage.css";

const AboutUsPage = () => {
  const navigate = useNavigate();

  // Function to navigate back to Dashboard
  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="aboutus-container">
      {/* Header with Back Button */}
      <div className="aboutus-header">
        <button onClick={handleBackToDashboard} className="back-arrow">
          &#8592; Back to Dashboard
        </button>
      </div>

      {/* Main Title */}
      <h1 className="aboutus-title">About CrowdSafeNet</h1>

      {/* Row container that holds the two image boxes and the main box in center */}
      <div className="aboutus-row">
        {/* Box on the left side */}
        <div className="image-box-left">
          <img
            src="https://images.csmonitor.com/csm/2015/07/921740_1_0714-india-stampede_standard.jpg?alias=standard_900x600"
            alt="CrowdSafeNet Left"
            className="circle-img-left"
          />
        </div>

        {/* Centered main box with shadow (TEXT ONLY) */}
        <div className="aboutus-box">
          <p>
            <strong>CrowdSafeNet</strong> is an AI-powered anomaly detection system
            engineered to monitor and protect large gatherings. By integrating{" "}
            <em>motion analysis</em> and <em>appearance-based detection</em>, our
            solution excels in complex settings where traditional surveillance
            methods often fail.
          </p>

          <p>
            Trained on the renowned UCSD Anomaly Detection Dataset, CrowdSafeNet
            delivers a remarkable <strong>98.7% accuracy</strong>, ensuring early
            detection of unusual activities. Our approach leverages Mixture of
            Dynamic Textures (MDT) to capture both visual appearance and movement
            patterns, enabling robust real-time monitoring.
          </p>

          <p>
            From massive events and bustling transit hubs to high-stakes public
            gatherings, CrowdSafeNet actively alerts security teams, reduces false
            alarms, and enhances crowd safety. Our mission is to provide an
            adaptive, cutting-edge system that prevents critical incidents before
            they escalate.
          </p>
        </div>

        {/* Box on the right side */}
        <div className="image-box-right">
          <img
            src="https://www.washingtonpost.com/rf/image_908w/2010-2019/Wires/Images/2015-07-14/Getty/Del6429870.jpg"
            alt="CrowdSafeNet Right"
            className="circle-img-right"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;