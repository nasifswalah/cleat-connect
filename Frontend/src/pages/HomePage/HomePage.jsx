// Connecting with HomePage.css for styles
import "./HomePage.css";

// Import the neccessary hooks and components
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Import axios for making HTTP requests
import axios from "axios";

// Import Link component for navigation
import { Link } from "react-router-dom";

// Import ErrorToast to manage notifications 
import { ErrorToast } from "../../constants/toast";

// Import neccessary images and icons from assets folder
import AdImage1 from '../../assets/Ad1.png'
import AdImage2 from '../../assets/Ad2.png'
import AdImage3 from '../../assets/Ad3.png'
import AdImage4 from '../../assets/Ad4.png'
import circketImage from "../../assets/cricket-player.png";
import footballImage from "../../assets/football-player.png";
import tennisImage from "../../assets/tennis-player.png";
import basketballImage from "../../assets/basketball-player.png";
import linkdinIcon from "../../assets/linkdin.svg"
import facebookIcon from "../../assets/facebook.svg"
import twitterIcon from "../../assets/twitter.svg"
import instagramIcon from "../../assets/instagram.svg"


const HomePage = () => {
 
  // Destructuring darkMode from the user slice of Redux state
  const { darkMode } = useSelector((state) => state.user);

  // useState hook to manage various turf data
  const [turfData, setTurfData] = useState([]);

  // useEffect hook to retrive turf data 
  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await axios.get('/api/user/get-turfs');
        const data = await res.data;
        if (data.success === false) {
          ErrorToast('Failed to load');
          return;
        }
        setTurfData(data.data);
      } catch (error) {
        ErrorToast(error.response.data.message);
      }
    };
    fetchUpdates();
  }, []);

  return (
    <>
      <section className="home" id="home">
        <div className="home-text">
          <h1>
            Cleat Connect <br /> Sports
          </h1>
        </div>
      </section>

      <section className="type-container" id="category">
        <div className="type-text">
          <h2 className={`${darkMode ? 'dark-mode-text' : ''}`}>
            Start your game with <br /> lots of services
          </h2>
        </div>

        <div className="row-items">
          <div className={`container-box ${darkMode ? 'dark-mode' : ''}`}>
            <div className="container-image">
              <img src={circketImage} alt="" />
            </div>
            <h4>Cricket Pitch</h4>
          </div>
          <div className={`container-box ${darkMode ? 'dark-mode' : ''}`}>
            <div className="container-image">
              <img src={footballImage} alt="" />
            </div>
            <h4>Football Ground</h4>
          
          </div>
          <div className={`container-box ${darkMode ? 'dark-mode' : ''}`}>
            <div className="container-image">
              <img src={basketballImage} alt="" />
            </div>
            <h4>Basketball Court</h4>
           
          </div>
          <div className={`container-box ${darkMode ? 'dark-mode' : ''}`}>
            <div className="container-image">
              <img src={tennisImage} alt="" />
            </div>
            <h4>Tennis Court</h4>

          </div>
        </div>
      </section>

      <section className="turf-container" id="Updates">
        <div className="title">
          <h2 className={`${darkMode ? 'dark-mode-text' : ''}`}>
            Our Upcoming <br /> Games
          </h2>
        </div>

        <div className="turf-content">
          <div className="box">
            <div className="thum">
              <img src={AdImage1} alt="sample-image" />
              <h3>Sandtrap Sanctuary</h3>
            </div>

            <div className="dest-content">
              <div className="location">
                <h4 className={`${darkMode ? 'dark-mode-text' : ''}`}>Golf</h4>
                <p>Bangalore</p>
              </div>
            </div>
          </div>
          <div className="box">
            <div className="thum">
              <img src={AdImage2} alt="sample-image" />
              <h3>Tackle Turf</h3>
            </div>

            <div className="dest-content">
              <div className="location">
                <h4 className={`${darkMode ? 'dark-mode-text' : ''}`}>Rugby</h4>
                <p>Chennai</p>
              </div>
            </div>
          </div>
          <div className="box">
            <div className="thum">
              <img src={AdImage3} alt="sample-image" />
              <h3>Curveball Corner</h3>
            </div>

            <div className="dest-content">
              <div className="location">
                <h4 className={`${darkMode ? 'dark-mode-text' : ''}`}>Baseball</h4>
                <p>Calicut</p>
              </div>
            </div>
          </div>
          <div className="box">
            <div className="thum">
              <img src={AdImage4} alt="sample-image" />
              <h3>Puck Palace</h3>
            </div>

            <div className="dest-content">
              <div className="location">
                <h4 className={`${darkMode ? 'dark-mode-text' : ''}`}>Hockey</h4>
                <p>Kochi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="courts-container" id="courts">
        <div className="title">
          <h2 className={`${darkMode ? 'dark-mode-text' : ''}`}>
            Our Popular <br />
            Courts
          </h2>
        </div>


        <div className="courts-content">
          { turfData && turfData.map((turf) => (
            <div className="court-content" key={turf._id}>
              <Link to={`/turf-details/${turf._id}`}>
            <img src={turf.imageUrls[0]} alt="turf image" />
            </Link>
            <h5 >{turf.name}</h5>
            <p>{turf.location}</p>
          </div>
          ))}
        </div>
      </section>

      <section className="contact">
        <div className="footer">
          <div className="main">
            <div className="list">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <a href="#home">Home</a>
                </li>
                <li>
                  <a href="#category">Categories</a>
                </li>
                <li>
                  <a href="#Updates">Updates</a>
                </li>
                <li>
                  <a href="#courts">Explore</a>
                </li>
              </ul>
            </div>


            <div className="list">
              <h4>Help</h4>
              <ul>
                <li>
                  <a href="mailto:cleatconnect@gmial.com">Contact me</a>
                </li>
                <li>
                  <a href="/aboutUs">About us</a>
                </li>
              </ul>
            </div>

            <div className="list">
              <h4>Connect</h4>
              <div className="social">
                <a href="#"><img src={facebookIcon} alt="facebook" /></a>
                <a href="#"><img src={instagramIcon} alt="instagram" /></a>
                <a href="#"><img src={twitterIcon} alt="twitter" /></a>
                <a href="#"><img src={linkdinIcon} alt="linkdin" /></a>
              </div>
            </div>
          </div>
        </div>
        <div className="end-text">
          <p>Copyright @2024 All rights reserved | Made with by Nasif Swalah</p>
        </div>
      </section>
    </>
  );
};

export default HomePage;



