import React, { useState } from 'react';
import axios from 'axios';

const AcademicResourceRequestForm = () => {
  const [formData, setFormData] = useState({
    student: '',
    title: '',
    description: '',
    resourceType: 'other',
    institutionName: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await axios.post('http://localhost:5000/users/requests', formData);
      if (res.data.success) {
        setMessage({ type: 'success', text: "Successfully Submitted" });
      } else {
        setMessage({ type: 'error', text: "There is some issue with your request" });
      }
    } catch (error) {
      setMessage({ type: 'error', text: "There is some Network issue please try after some time" });
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Knowledge Orbit Animation
  const KnowledgeAnimation = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" className="w-100 h-100">
      {/* Background gradient */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0a192f" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#112240" stopOpacity="0.6"/>
        </linearGradient>
        
        {/* Book glow effect */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
      
      {/* Semi-transparent background */}
      <rect width="300" height="400" fill="url(#bgGradient)"/>
      
      {/* Floating books animation */}
      <g>
        {/* Book 1 */}
        <g>
          <animateTransform attributeName="transform" type="translate" 
            values="0,0; 0,-10; 0,0" dur="4s" repeatCount="indefinite"/>
          
          {/* Book cover */}
          <rect x="60" y="150" width="70" height="100" rx="3" fill="#64ffda" stroke="#0a8c6a" strokeWidth="2">
            <animate attributeName="opacity" values="0.8;1;0.8" dur="4s" repeatCount="indefinite"/>
          </rect>
          
          {/* Book pages */}
          <rect x="65" y="155" width="60" height="90" fill="#e6f1ff"/>
          
          {/* Book title */}
          <text x="95" y="205" textAnchor="middle" fontFamily="Arial" fontSize="10" fill="#0a192f">RESEARCH</text>
        </g>
        
        {/* Book 2 */}
        <g>
          <animateTransform attributeName="transform" type="translate" 
            values="0,0; 0,-8; 0,0" dur="3.5s" begin="0.5s" repeatCount="indefinite"/>
          
          {/* Book cover */}
          <rect x="170" y="180" width="70" height="100" rx="3" fill="#5c6bc0" stroke="#3949ab" strokeWidth="2">
            <animate attributeName="opacity" values="0.8;1;0.8" dur="3.5s" begin="0.5s" repeatCount="indefinite"/>
          </rect>
          
          {/* Book pages */}
          <rect x="175" y="185" width="60" height="90" fill="#e6f1ff"/>
          
          {/* Book title */}
          <text x="205" y="235" textAnchor="middle" fontFamily="Arial" fontSize="10" fill="#e6f1ff">ACADEMIC</text>
        </g>
      </g>
      
      {/* Orbital circles */}
      <g>
        {/* Center point */}
        <circle cx="150" cy="200" r="8" fill="#64ffda">
          <animate attributeName="r" values="8;10;8" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite"/>
        </circle>
        
        {/* Orbital path 1 */}
        <circle cx="150" cy="200" r="50" fill="none" stroke="#8892b0" strokeWidth="1" strokeDasharray="5,5">
          <animate attributeName="stroke-opacity" values="0.3;0.7;0.3" dur="8s" repeatCount="indefinite"/>
        </circle>
        
        {/* Orbital path 2 */}
        <circle cx="150" cy="200" r="80" fill="none" stroke="#8892b0" strokeWidth="1" strokeDasharray="5,5">
          <animate attributeName="stroke-opacity" values="0.7;0.3;0.7" dur="8s" repeatCount="indefinite"/>
        </circle>
        
        {/* Particle 1 */}
        <circle cx="150" cy="150" r="6" fill="#64ffda">
          <animateTransform attributeName="transform" type="rotate" from="0 150 200" to="360 150 200" dur="8s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0.7;1" dur="8s" repeatCount="indefinite"/>
        </circle>
        
        {/* Particle 2 */}
        <circle cx="230" cy="200" r="6" fill="#5c6bc0">
          <animateTransform attributeName="transform" type="rotate" from="90 150 200" to="450 150 200" dur="10s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.7;1;0.7" dur="10s" repeatCount="indefinite"/>
        </circle>
        
        {/* Particle 3 */}
        <circle cx="150" cy="280" r="6" fill="#ffca28">
          <animateTransform attributeName="transform" type="rotate" from="180 150 200" to="540 150 200" dur="6s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.7;1;0.7" dur="6s" repeatCount="indefinite"/>
        </circle>
        
        {/* Particle 4 */}
        <circle cx="70" cy="200" r="6" fill="#ff5252">
          <animateTransform attributeName="transform" type="rotate" from="270 150 200" to="630 150 200" dur="12s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0.7;1" dur="12s" repeatCount="indefinite"/>
        </circle>
      </g>
      
      {/* Light beams */}
      <g>
        {/* Beam 1 */}
        <path d="M150,100 L120,50" stroke="#64ffda" strokeWidth="2" strokeLinecap="round" opacity="0.7">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite"/>
        </path>
        
        {/* Beam 2 */}
        <path d="M150,100 L180,60" stroke="#5c6bc0" strokeWidth="2" strokeLinecap="round" opacity="0.7">
          <animate attributeName="opacity" values="0.6;0.3;0.6" dur="4s" repeatCount="indefinite"/>
        </path>
        
        {/* Beam 3 */}
        <path d="M150,100 L90,80" stroke="#ffca28" strokeWidth="2" strokeLinecap="round" opacity="0.7">
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="5s" repeatCount="indefinite"/>
        </path>
        
        {/* Beam 4 */}
        <path d="M150,100 L210,80" stroke="#ff5252" strokeWidth="2" strokeLinecap="round" opacity="0.7">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3.5s" repeatCount="indefinite"/>
        </path>
      </g>
      
      {/* Knowledge text */}
      <text x="150" y="330" textAnchor="middle" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="#64ffda">
        RESOURCE REQUEST
        <animate attributeName="opacity" values="0.7;1;0.7" dur="4s" repeatCount="indefinite"/>
      </text>
      
      {/* Glowing connection lines */}
      <g>
        <path d="M70,170 Q150,120 230,180" stroke="#64ffda" strokeWidth="1" fill="none" opacity="0.5">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="5s" repeatCount="indefinite"/>
        </path>
      </g>
    </svg>
  );

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#0a192f' }}>
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            {/* Combined Form and SVG in one div with same background */}
            <div className="card" style={{ backgroundColor: 'rgba(16,33,65,0.8)', borderRadius: '0.5rem' }}>
              <div className="row g-0">
                {/* Form Section */}
                <div className="col-md-7">
                  <div className="card-body p-4">
                    <h2 className="card-title mb-4" style={{ color: '#64ffda', fontWeight: 'bold' }}>Request Academic Resource</h2>
                    
                    {message && (
                      <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} mb-4`} style={{ backgroundColor: message.type === 'success' ? '#0a8c6a' : null, color: '#e6f1ff' }}>
                        {message.text}
                      </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="studentName" className="form-label" style={{ color: '#8892b0' }}>
                          Your Name*
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="studentName"
                          name="student"
                          value={formData.student}
                          onChange={handleChange}
                          required
                          style={{ backgroundColor: '#112240', border: '1px solid #8892b0', color: '#e6f1ff' }}
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="resourceTitle" className="form-label" style={{ color: '#8892b0' }}>
                          Resource Title*
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="resourceTitle"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          required
                          style={{ backgroundColor: '#112240', border: '1px solid #8892b0', color: '#e6f1ff' }}
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="resourceType" className="form-label" style={{ color: '#8892b0' }}>
                          Resource Type
                        </label>
                        <select
                          className="form-select"
                          id="resourceType"
                          name="resourceType"
                          value={formData.resourceType}
                          onChange={handleChange}
                          style={{ backgroundColor: '#112240', border: '1px solid #8892b0', color: '#e6f1ff' }}
                        >
                          <option value="book">Book</option>
                          <option value="journal">Journal</option>
                          <option value="article">Article</option>
                          <option value="courseMaterial">Course Material</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="institutionName" className="form-label" style={{ color: '#8892b0' }}>
                          Institution Name*
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="institutionName"
                          name="institutionName"
                          value={formData.institutionName}
                          onChange={handleChange}
                          required
                          style={{ backgroundColor: '#112240', border: '1px solid #8892b0', color: '#e6f1ff' }}
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="description" className="form-label" style={{ color: '#8892b0' }}>
                          Description
                        </label>
                        <textarea
                          className="form-control"
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows="4"
                          style={{ backgroundColor: '#112240', border: '1px solid #8892b0', color: '#e6f1ff' }}
                          placeholder="Please provide details about the resource you are requesting..."
                        ></textarea>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn w-100"
                        style={{ 
                          backgroundColor: '#64ffda', 
                          color: '#0a192f',
                          fontWeight: '500',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                      </button>
                    </form>
                  </div>
                </div>
                
                {/* SVG Animation Section */}
                <div className="col-md-5 d-flex align-items-center justify-content-center p-3">
                  <KnowledgeAnimation />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicResourceRequestForm;