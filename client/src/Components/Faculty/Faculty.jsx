import React, { useEffect } from 'react';
import { Book, Users, BookOpen, MessageSquare } from 'lucide-react';
import './Faculty.css';
import CountUp2 from './CountUp2';
import c2 from '../../assets/c2.svg';
import { useNavigate } from 'react-router-dom';

const Faculty = () => {
  // Intersection Observer for animation on scroll
  const navigate=useNavigate();
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    return () => {
      animatedElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  function handlePublish(){
    navigate('/publish')
  }

  function handleRequests(){
    navigate('/requests')
  }

  return (
    <div className="landing-container">
      <div className="hero-section">
        <div className="content-wrapper">
          {/* Text Content */}
          <div className="text-content animate-on-scroll">  
            <h1 className="main-heading">
              Share Your Knowledge<br />with the Academic World
            </h1>
            
            <p className="subtitle">
              Publish and manage your academic books in one place. Connect 
              with students and share your expertise effortlessly.
            </p>
            
            <div className="button-container">
              <button className="primary-button" onClick={()=>{handlePublish()}}>Start Publishing</button>
              <button className="primary-button" onClick={()=>{handleRequests()}}>Book Requests</button>
            </div>
          </div>
          
          {/* Image */}
          <div className="image-container animate-on-scroll">
            <div className="hero-image">
              <img src={c2} alt="Academic publishing illustration" className="floating" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <h2 className="section-title2 animate-on-scroll">Our Impact</h2>
        
        <div className="stats-grid">
          <div className="stat-item animate-on-scroll">
            <Book className="stat-icon" />
            <div className="stat-content">
              <CountUp2
                from={0}
                to={1000}
                separator=","
                direction="up"
                duration={2}
                className="stat-number"
                suffix="+"
              />
              <p className="stat-label">Published Books</p>
            </div>
          </div>
          
          <div className="stat-item animate-on-scroll">
            <Users className="stat-icon" />
            <div className="stat-content">
              <CountUp2
                from={0}
                to={500}
                separator=","
                direction="up"
                duration={2}
                className="stat-number"
                suffix="+"
              />
              <p className="stat-label">Active Teachers</p>
            </div>
          </div>
          
          <div className="stat-item animate-on-scroll">
            <BookOpen className="stat-icon" />
            <div className="stat-content">
              <CountUp2
                from={0}
                to={50}
                separator=","
                direction="up"
                duration={2}
                className="stat-number"
                suffix="+"
              />
              <p className="stat-label">Academic Categories</p>
            </div>
          </div>
          
          <div className="stat-item animate-on-scroll">
            <MessageSquare className="stat-icon" />
            <div className="stat-content">
              <CountUp2
                from={0}
                to={10000}
                separator=","
                direction="up"
                duration={2}
                className="stat-number"
                suffix="+"
              />
              <p className="stat-label">Student Requests</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faculty;