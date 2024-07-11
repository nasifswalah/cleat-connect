import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import cleatLogo from '../../assets/Cleat logo.png'
import "./LandingPage.css";


const LandingPage = () => {
  return (
    <main>
      <div className="big-wrapper">
        <Navbar />
      
        <div className="showcase-area">
          <div className="container">
            <div className="left">
              <div className="landing-title">
                <h3>Elevate Your Game </h3>
                <h3>with Cleat Connect</h3>
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
