import React from 'react';
import './Abuse.css'; // Create this CSS file for styling

const AbuseWarningPopup = ({ onClose, onLeaveRoom }) => {
  return (
    <div className="abuse-warning-overlay">
      <div className="abuse-warning-modal">
        <div className="abuse-warning-header">
          <h3>⚠️ Warning: Inappropriate Content</h3>
        </div>
        <div className="abuse-warning-body">
          <p>Abusive or inappropriate language has been detected in this conversation.</p>
          <p>Please keep conversations respectful and appropriate. Continued violation may result in account restrictions.</p>
        </div>
        <div className="abuse-warning-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Acknowledge
          </button>
          <button className="btn btn-primary" onClick={onLeaveRoom}>
            Leave Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default AbuseWarningPopup;