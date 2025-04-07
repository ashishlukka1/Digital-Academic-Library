import React, { useState, useEffect } from 'react';
import './SignUp.css';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  // Authentication state
  const [authMethod, setAuthMethod] = useState('form'); // 'form' or 'google'
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [googleUserData, setGoogleUserData] = useState(null);
  const navigate = useNavigate();
  
  // Form step tracking
  const [step, setStep] = useState(1);
  
  // Personal details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('student'); // Default to student
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Institution details
  const [institutionName, setInstitutionName] = useState('');
  const [department, setDepartment] = useState('');
  const [studentId, setStudentId] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  
  // Academic profile
  const [fields, setFields] = useState([]);
  const [interests, setInterests] = useState([]);
  
  // Input state for tag inputs
  const [fieldInput, setFieldInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  
  // Check if user exists in the backend
  const checkUserExists = async (email) => {
    try {
      const response = await axios.post('http://localhost:5000/users/check-user', { email });
      return { 
        exists: response.data.exists, 
        user: response.data.payload 
      };
    } catch (error) {
      console.error('Error checking user:', error);
      return { exists: false, user: null };
    }
  };
  
  // Handle form-based registration
  const handleFormCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // First check if the user already exists
      const { exists, user } = await checkUserExists(email);
      
      if (exists) {
        // If user exists, navigate based on role
        console.log('User already exists, redirecting to profile');
        if (user.role === 'student') {
          navigate('/userprofile');
        } else {
          navigate('/facultyprofile');
        }
      } else {
        // If user doesn't exist, proceed to next step
        setStep(2);
      }
    } catch (err) {
      console.error('Error checking user:', err);
      setError(err.response?.data?.message || 'Error checking user');
    } finally {
      setLoading(false);
    }
  };
  
  // Google signIn
  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userData = {
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        email: user.email || ''
      };
      
      // Check if user exists in backend
      const { exists, user: existingUser } = await checkUserExists(userData.email);
      
      if (exists) {
        if (existingUser.role === 'student') {
          navigate('/userprofile');
        } else {
          navigate('/facultyprofile');
        }
      } else {
        // User doesn't exist, need to complete registration
        console.log('Google user not found, continue with registration');
        setIsGoogleUser(true);
        setGoogleUserData(userData);
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setEmail(userData.email);
        setStep(2);
        setAuthMethod('google');
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('Google Sign-In failed: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new field tag
  const handleAddField = (e) => {
    e.preventDefault();
    if (fieldInput.trim() !== '' && !fields.includes(fieldInput.trim())) {
      setFields([...fields, fieldInput.trim()]);
      setFieldInput('');
    }
  };

  // Handle adding a new interest tag
  const handleAddInterest = (e) => {
    e.preventDefault();
    if (interestInput.trim() !== '' && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput('');
    }
  };

  // Handle removing a field tag
  const handleRemoveField = (fieldToRemove) => {
    setFields(fields.filter(field => field !== fieldToRemove));
  };

  // Handle removing an interest tag
  const handleRemoveInterest = (interestToRemove) => {
    setInterests(interests.filter(interest => interest !== interestToRemove));
  };

  // Handle enter key on input fields
  const handleKeyDown = (e, type) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'field') {
        handleAddField(e);
      } else if (type === 'interest') {
        handleAddInterest(e);
      }
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  // Handle role change
  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  // Submit complete registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const userData = {
      firstName,
      lastName,
      email,
      ...(authMethod === 'form' && { password }), // Only include password for form signup
      phoneNumber,
      role, // Include the selected role
      institutionName,
      academicProfile: {
        fields,
        interests
      },
      signupMethod: authMethod
    };
   console.log(userData)
    try {
      const response = await axios.post('http://localhost:5000/users/register', userData);
      
      if (response.data.success) {
        console.log('User registered:', response.data.user);
        // Store user info in localStorage if needed
        if(response.data.user.role==='student'){
          navigate('/userprofile');
        }else{
          navigate('/facultyprofile');
        }
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      // Check if the error is because user already exists
      if (err.response?.status === 400 && err.response?.data?.message === 'User already exists') {
        console.log('User already exists, redirecting to profile');
        const { exists, user } = await checkUserExists(email);
        if (user && user.role === 'student') {
          navigate('/userprofile');
        } else {
          navigate('/facultyprofile');
        }
      } else {
        setError(err.response?.data?.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Academic Sign Up</h2>
          {!isGoogleUser && <p>Step {step} of 2</p>}
          {isGoogleUser && <p>Complete Your Profile</p>}
        </div>
        
        {/* Show loading indicator when processing */}
        {loading && <div className="loading-indicator">Processing...</div>}
        
        {/* Show any error messages */}
        {error && <div className="error-message">{error}</div>}
        
        {/* Show Google Auth button only on first step of regular signup */}
        {!isGoogleUser && step === 1 && (
          <div className="auth-alternatives">
            <button 
              type="button" 
              className="google-auth-button"
              onClick={handleGoogleAuth}
              disabled={loading}
            >
              <img 
                src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg" 
                alt="Google logo" 
                className="google-icon" 
              />
              Continue with Google
            </button>
            <div className="divider">
              <span>or</span>
            </div>
          </div>
        )}
        
        {!isGoogleUser && step === 1 ? (
          // Personal details form (regular signup only)
          <form onSubmit={handleFormCheck} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="id@vnrvjiet.in"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength="8"
              />
              <p className="password-hint">Password must be at least 8 characters</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="9876543210"
                required
              />
            </div>
            
            {/* Role Selection */}
            <div className="form-group">
              <label>Role</label>
              <div className="radio-group">
                <div className="radio-item">
                  <input
                    type="radio"
                    id="roleStudent"
                    name="role"
                    value="student"
                    checked={role === 'student'}
                    onChange={handleRoleChange}
                  />
                  <label htmlFor="roleStudent">Student</label>
                </div>
                <div className="radio-item">
                  <input
                    type="radio"
                    id="roleFaculty"
                    name="role"
                    value="faculty"
                    checked={role === 'faculty'}
                    onChange={handleRoleChange}
                  />
                  <label htmlFor="roleFaculty">Faculty</label>
                </div>
              </div>
            </div>
            
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Checking...' : 'Next'}
            </button>
          </form>
        ) : (
          // Institutional and academic details form (both regular and Google signup)
          <form onSubmit={handleSubmit} className="auth-form">
            {/* For Google users, show read-only personal info */}
            {isGoogleUser && (
              <div className="google-user-info">
                <div className="auth-message">
                  <p className="auth-info">Welcome {firstName}! Please complete your academic profile.</p>
                </div>
                
                <div className="readonly-info">
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        readOnly
                        className="readonly-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        readOnly
                        className="readonly-input"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={email}
                      readOnly
                      className="readonly-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="9876543210"
                    required
                  />
                </div>
                
                {/* Role Selection for Google Users */}
                <div className="form-group">
                  <label>Role</label>
                  <div className="radio-group">
                    <div className="radio-item">
                      <input
                        type="radio"
                        id="roleStudent"
                        name="role"
                        value="student"
                        checked={role === 'student'}
                        onChange={handleRoleChange}
                      />
                      <label htmlFor="roleStudent">Student</label>
                    </div>
                    <div className="radio-item">
                      <input
                        type="radio"
                        id="roleFaculty"
                        name="role"
                        value="faculty"
                        checked={role === 'faculty'}
                        onChange={handleRoleChange}
                      />
                      <label htmlFor="roleFaculty">Faculty</label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="institutionName">Institution Name</label>
              <input
                type="text"
                id="institutionName"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder="VNRVJIET"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                type="text"
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Information Technology"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="studentId">Student ID</label>
                <input
                  type="text"
                  id="studentId"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="IT123456"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="graduationYear">Graduation Year</label>
                <input
                  type="number"
                  id="graduationYear"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  placeholder="Year"
                  min="2023"
                  max="2030"
                  required
                />
              </div>
            </div>
            
            {/* Fields of Study - Tag Input */}
            <div className="form-group">
              <label htmlFor="fields">Fields of Study</label>
              <div className="tag-input-container">
                <div className="tag-list">
                  {fields.map((field, index) => (
                    <div key={index} className="tag-item">
                      <span>{field}</span>
                      <button 
                        type="button" 
                        className="tag-remove" 
                        onClick={() => handleRemoveField(field)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <div className="tag-input-wrapper">
                  <input
                    type="text"
                    id="fieldInput"
                    value={fieldInput}
                    onChange={(e) => setFieldInput(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'field')}
                    placeholder="Type and press Enter"
                  />
                  <button 
                    type="button" 
                    className="tag-add-button" 
                    onClick={handleAddField}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            
            {/* Academic Interests - Tag Input */}
            <div className="form-group">
              <label htmlFor="interests">Academic Interests</label>
              <div className="tag-input-container">
                <div className="tag-list">
                  {interests.map((interest, index) => (
                    <div key={index} className="tag-item">
                      <span>{interest}</span>
                      <button 
                        type="button" 
                        className="tag-remove" 
                        onClick={() => handleRemoveInterest(interest)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <div className="tag-input-wrapper">
                  <input
                    type="text"
                    id="interestInput"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, 'interest')}
                    placeholder="Type and press Enter"
                  />
                  <button 
                    type="button" 
                    className="tag-add-button" 
                    onClick={handleAddInterest}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            
            <div className="button-group">
              {/* Only show Back button for regular signup */}
              {!isGoogleUser && (
                <button 
                  type="button" 
                  className="secondary-button" 
                  onClick={handlePrevStep}
                  disabled={loading}
                >
                  Back
                </button>
              )}
              <button 
                type="submit" 
                className="auth-button"
                disabled={loading}
              >
                {loading ? "Processing..." : (isGoogleUser ? "Complete Registration" : "Create Account")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;