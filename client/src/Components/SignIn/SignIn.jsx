import React, { useState, useEffect } from 'react';
import './SignIn.css';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


// Initialize Firebase (replace with your own Firebase config)
const firebaseConfig = {
  apiKey: "AIzaSyCqbMtwmzysfn89KGZtSJgQ9A-YZ7jyv5s",
  authDomain: "lumora-32951.firebaseapp.com",
  projectId: "lumora-32951",
  storageBucket: "lumora-32951.firebasestorage.app",
  messagingSenderId: "441704832855",
  appId: "1:441704832855:web:9768350d67a3c595e8a812",
  measurementId: "G-E5HJPMMH6N"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Handle regular sign in
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log('Sign in with:', { email, password, rememberMe });

      const response = await axios.post('http://localhost:5000/users/login', {
        email,
        password
      });

      if (response.data.success) {
        // navigate to user profile or dashboard
        console.log(response.data);
        if(response.data.payload.role==='student'){
        navigate('/userprofile');
        }else{
          navigate('/facultyprofile')
        }
      } else {
        setError('Invalid credentials');
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google sign in
const handleGoogleSignIn = async () => {
  setLoading(true);
  setError(null);

  try {
    const result = await signInWithPopup(auth, googleProvider);

    const user = result.user;

    console.log('Google User:', {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      phoneNumber: user.phoneNumber,
      providerData: user.providerData
    });

    // 👉 Send email to your backend to check if user exists
    const response = await axios.post('http://localhost:5000/users/signin', {
      email: user.email
    });

    if (response.data.success) {
      console.log(response.data);
        if(response.data.payload.role==='student'){
        navigate('/userprofile');
        }else{
          navigate('/facultyprofile')
        }
    } else {
      setError('User not found in system');
    }

  } catch (error) {
    console.error('Google Sign In Error:', error);
    setError(error.response?.data?.message || 'Something went wrong');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your Digital Academic Library account</p>
        </div>
        
        {error && (
      <div className="auth-error  border border-red-400 text-red-700 px-4 py-2 my-2 rounded relative mt-4">
        {error}
      </div>
)}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
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
              placeholder="Password"
              required
            />
          </div>
          
          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="/forgot-password" className="forgot-password">Forgot password?</a>
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>Sign In</button>
        </form>
        
        <div className="social-signin">
          <div className="divider">
            <span>OR</span>
          </div>
          <button 
            type="button"
            className="google-signin-button"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <img 
              src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg" 
              alt="Google logo" 
              className="google-icon" 
            />
            Continue with Google
            {loading && <span className="spinner"></span>}
          </button>
        </div>
        
        <div className="auth-footer">
          <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;