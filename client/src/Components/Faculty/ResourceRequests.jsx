import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Container, Badge, Spinner, Alert } from "react-bootstrap";
import "./ResourceRequests.css"; // External CSS file

const ResourceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResourceRequests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/faculty/get-req");
        console.log("API Response:", response.data);

        // Check if response data is in expected format
        const requestData = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        setRequests(requestData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchResourceRequests();
  }, []);

  const getResourceTypeBadge = (type) => {
    const badgeClasses = {
      book: "resource-badge book",
      journal: "resource-badge journal",
      article: "resource-badge article",
      courseMaterial: "resource-badge course",
      other: "resource-badge other",
    };

    return (
      <Badge className={badgeClasses[type] || badgeClasses.other}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" role="status" className="spinner">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          Failed to load resource requests: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="resource-requests-container">
      <div className="resource-header">
        <h2>Resource Requests</h2>
        <p>View and manage student resource requests</p>
      </div>

      {requests.length === 0 ? (
        <div className="no-requests">
          <p>No resource requests found</p>
        </div>
      ) : (
        <div className="table-responsive">
          <Table className="resource-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Title</th>
                <th>Description</th>
                <th>Resource Type</th>
                <th>Institution</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr key={index} className="resource-item">
                  <td>{request.student}</td>
                  <td className="resource-title">{request.title}</td>
                  <td>
                    {request.description ? (
                      request.description
                    ) : (
                      <span className="no-description">No description</span>
                    )}
                  </td>
                  <td>{getResourceTypeBadge(request.resourceType)}</td>
                  <td>{request.institutionName}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default ResourceRequests;
