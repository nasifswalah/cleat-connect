// Connecting with LandingPage.css for styles
import "./LandingPage.css";

// Import the neccessary hooks and components
import React from "react";
import { useSelector } from "react-redux";

// Import Link component for navigation
import { Link } from "react-router-dom";

// Import logo from assets folder
import cleatLogo from '../../assets/Cleat logo.png'




const LandingPage = () => {

  // Destructuring darkMode from the user slice of Redux state
  const {darkMode} = useSelector((state) => state.general);

  return (
    <main>
      <div className={`big-wrapper ${darkMode ? 'dark-mode' : ''}`}>
        <div className="showcase-area">
          <div className="container">
            <div className="left">
              <div className="landing-title">
                <h3 className={`${darkMode ? 'dark-mode-text' : ''}`}>Elevate Your Game </h3>
                <h3 className={`${darkMode ? 'dark-mode-text' : ''}`}>with Cleat Connect</h3>
              </div>
              <div className="text">
                <p>
                Discover seamless turf booking with Cleat Connect. Easily find and book turfs for any game, manage bookings effortlessly, and enjoy exclusive offers. Let's get started!
                </p>
              </div>
              <div className="explore-btn">
                <Link id="btn" className="start-btn" to='/homepage' >
                  Get started
                </Link>
              </div>
            </div>
            <div className="right">
                <img className="right-image" src={cleatLogo} alt="" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LandingPage;
