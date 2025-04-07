import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar-custom">
      <div className="navbar-container">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <span className="brand-text">BookHub</span>
        </Link>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          <Link to="/signin" className="btn-signin">
            <span>Sign In</span>
          </Link>
          <Link to="/signup" className="btn-signup">
            <span>Sign Up</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
