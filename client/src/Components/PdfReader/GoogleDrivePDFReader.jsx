import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./GoogleDrivePDFViewer.css";

const GoogleDrivePDFViewer = () => {
  const location = useLocation();
  const incomingDriveLink = location.state?.driveLink || ""; // Get driveLink from navigate

  const [driveUrl, setDriveUrl] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (incomingDriveLink) {
      setDriveUrl(incomingDriveLink);
    }
  }, [incomingDriveLink]);

  const dummyKeyPoints = [
    "🔹 Introduction to the topic and historical context",
    "🔹 Key definitions and terminology used",
    "🔹 Summary of main arguments or findings",
    "🔹 Diagrams explained in sections 3 & 4",
    "🔹 Final conclusions and real-world applications",
  ];

  const extractFileId = (url) => {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]{25,})/);
    if (match) return match[1];
    const altMatch = url.match(/id=([a-zA-Z0-9_-]{25,})/);
    if (altMatch) return altMatch[1];
    return null;
  };

  const fileId = extractFileId(driveUrl);
  const embedUrl = fileId
    ? `https://drive.google.com/file/d/${fileId}/preview`
    : "";

  return (
    <div className="pdf-wrapper">
      <div className="pdf-app-container">
        

        {/* Main Content Area */}
        <div className="pdf-content-container">
          {/* PDF Viewer - Left Side */}
          <div className="pdf-viewer-section">
            {embedUrl ? (
              <div className="pdf-frame-container">
                <iframe
                  title="Google Drive PDF Viewer"
                  src={embedUrl}
                  className="pdf-viewer-iframe"
                ></iframe>
              </div>
            ) : (
              <div className="pdf-placeholder">
                <div className="placeholder-text">
                  Enter a Google Drive PDF link above to view the document
                </div>
              </div>
            )}
          </div>

          {/* Notes Section - Right Side */}
          <div className="notes-section">
            {/* <div className="key-points-container">
              <h2>Key Points</h2>
              <ul className="key-points-list">
                {dummyKeyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div> */}

            <div className="notes-container">
              <h3>Your Notes</h3>
              <textarea
                placeholder="Write your thoughts here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="notes-textarea"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleDrivePDFViewer;
