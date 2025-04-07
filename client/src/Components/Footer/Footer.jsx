import React from 'react';
import './Footer.css';
import { FaInstagram, FaTwitter, FaFacebookF, FaLinkedinIn, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <div>
      <div className="footer">
        <div className="footer-content container">
          <div className="footer-main">
            {/* First Column - Library Info */}
            <div className="footer-column">
              <h3 className="footer-title">CloudCampus Library</h3>
              {/* <p className="footer-description">Empowering minds through knowledge and innovation. Your gateway to academic excellence and lifelong learning.</p> */}
              <div className="contact-info">
                <p><FaMapMarkerAlt className="icon" /> 1234 Scholar Avenue, Academic District</p>
                <p><FaPhone className="icon" /> +1 (555) 123-4567</p>
                <p><FaEnvelope className="icon" /> library@cloudcampus.edu</p>
              </div>
            </div>
            
            {/* Second Column - Library Hours */}
            <div className="footer-column">
              <h3 className="footer-title">Library Hours</h3>
              <table className="hours-table">
                <tbody>
                  <tr>
                    <td>Monday - Friday:</td>
                    <td>8:00 AM - 10:00 PM</td>
                  </tr>
                  <tr>
                    <td>Saturday:</td>
                    <td>9:00 AM - 6:00 PM</td>
                  </tr>
                  <tr>
                    <td>Sunday:</td>
                    <td>12:00 PM - 8:00 PM</td>
                  </tr>
                  <tr>
                    <td>Holidays:</td>
                    <td>Hours may vary</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Third Column - Connect With Us */}
            <div className="footer-column">
              <h3 className="footer-title">Connect With Us</h3>
              {/* <p className="connect-text">Stay updated with events, new resources, and library announcements through our social media channels.</p> */}
              <div className="social-icons">
                <a href="https://instagram.com" aria-label="Instagram"><FaInstagram /></a>
                <a href="https://twitter.com" aria-label="Twitter"><FaTwitter /></a>
                <a href="https://facebook.com" aria-label="Facebook"><FaFacebookF /></a>
                <a href="https://linkedin.com" aria-label="LinkedIn"><FaLinkedinIn /></a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <p>Â© {new Date().getFullYear()} CloudCampus Library. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;