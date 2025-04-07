import React, { useState } from 'react';
import './Home.css'; // Renamed to avoid conflicts
import Navbar from '../Home_Nav/Navbar';
import CountUp from './CountUp'; 
import Footer from '../Footer/Footer';
import { useNavigate } from 'react-router-dom';

const DarkLandingPage = () => {
    
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    
    const handleSearch = (e) => {
        e.preventDefault();
        // Navigate to Guest component waith search text as state
        navigate('/guest', { state: { searchQuery: searchText } });
        console.log(searchText)
    };

    const quickAccessItems = [
        {
          icon: "📄",
          title: "Research Papers",
          description: "Access latest academic research and publications",
          link: "/research"
        },
        {
          icon: "📚",
          title: "Course Materials",
          description: "Find lecture notes, presentations, and study guides",
          link: "/courses"
        },
        {
          icon: "📱",
          title: "E-Books",
          description: "Browse through our extensive digital library",
          link: "/ebooks"
        },
        {
          icon: "💬",
          title: "Discussion Forums",
          description: "Engage in academic discussions and Q&A",
          link: "/forums"
        }
    ];
    
    function moveit(){
        navigate('/signin')
    }
    
    return (
      <div>
        <Navbar/> 
        <div className="landing-page-container">
            {/* Hero Section */}
            <div className="landing-content-wrapper">
                <div className="landing-left-content">
                    <div className="landing-header-tag">
                        <span className="landing-live-indicator"></span>
                        Academic Resource Hub
                    </div>
                    <h1 className="landing-main-heading">
                        Bridging the Gap in{' '}
                        <span className="landing-highlight">Academic Resource</span> Access
                    </h1>
                    <p className="landing-subheading">
                        A centralized platform connecting students and researchers with the 
                        academic resources they need, without the barriers.
                    </p>
                    
                    <div className="landing-cta-buttons">
                        <button className="landing-btn landing-primary-btn" onClick={moveit}>Explore Resources</button>
                        <button className="landing-btn landing-secondary-btn" onClick={moveit}>Learn More</button>
                    </div>
                    
                    <div className="landing-stats-container">
                        <div className="landing-stat-box">
                            <h2>
                                <CountUp
                                    from={0}
                                    to={10}
                                    separator=","
                                    direction="up"
                                    duration={2}
                                />K+
                            </h2>
                            <p>Research Papers</p>
                        </div>
                        <div className="landing-stat-box">
                            <h2>
                                <CountUp
                                    from={0}
                                    to={5}
                                    separator=","
                                    direction="up"
                                    duration={2}
                                />K+
                            </h2>
                            <p>Academic Books</p>
                        </div>
                        <div className="landing-stat-box">
                            <h2>
                                <CountUp
                                    from={0}
                                    to={100}
                                    separator=","
                                    direction="up"
                                    duration={2}
                                />+
                            </h2>
                            <p>Universities</p>
                        </div>
                    </div>
                </div>
                
                <div className="landing-right-content">
                    <div className="landing-svg-container">
                        <img src="https://i.postimg.cc/xT6rbG6K/c1.png" style={{width:"500px"}} alt="Academic Illustration" className="landing-svg-image" />
                    </div>
                </div>
            </div>
            
            {/* Discover Research Section */}
            <section className="discover-research-section">
                <div className="discover-container">
                    <div className="discover-content">
                        <h2 className="discover-heading">Discover research</h2>
                        <p className="discover-description">
                            Access over 160 million publication pages and stay up to date with 
                            what's happening in your field.
                        </p>
                        <form onSubmit={handleSearch} className="discover-search-form">
                            <div className="discover-search-container">
                                <span className="discover-search-icon">🔍</span>
                                <input 
                                    type="text" 
                                    placeholder="Search publications" 
                                    className="discover-search-input"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="discover-search-button">Search</button>
                        </form>
                    </div>
                    <div className="discover-image-container">
                        <img 
                            src="https://i.postimg.cc/2jnsghFh/traveler-girl-looks-through-binoculars-vector-illustration-isolated-white-background-660899-111-remo.png" 
                            alt="Researcher with binoculars" 
                            className="discover-image" 
                        />
                    </div>
                </div>
            </section>
            
            {/* Quick Access Section */}
            {/* <section className="quick-access-section">
                <div className="container">
                    <h2 className="section-title1">Quick Access</h2>
                    
                    <div className="quick-access-grid">
                        {quickAccessItems.map((item, index) => (
                            <div className="quick-access-card" key={index}>
                                <div className="card-icon">{item.icon}</div>
                                <h3 className="card-title">{item.title}</h3>
                                <p className="card-description">{item.description}</p>
                                <a href={item.link} className="card-link">
                                    Explore <span className="arrow">→</span>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section> */}
        </div>
        <Footer/>
      </div>
    );
};

export default DarkLandingPage;