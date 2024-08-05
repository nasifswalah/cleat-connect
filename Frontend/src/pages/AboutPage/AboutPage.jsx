import React from 'react'

// Connecting with AboutPage.css to access the styles
import './AboutPage.css'

// Import the useSelector from react-redux
import { useSelector } from 'react-redux'

// Import the neccessary image from assets folder
import collage from '../../assets/collage--2.png'

const AboutPage = () => {
  
  // Destructuring darkMode from user slice 
  const { darkMode } = useSelector((state) => state.user);
  return (
    <>
      <section className={`about-section ${darkMode ? 'dark-mode' : ''}`}>
        <div className="about-container">
            <img src={collage} alt="collage" />
            <div className="about-text">
                <h4>About Us</h4>
                <h2 className={`${darkMode ? 'dark-mode-text' : ''}`}>Where Sports Meet Simplicity</h2>
                <p>At Cleat Connect, we are passionate about simplifying the way sports enthusiasts discover and book turfs. Our mission is to provide a seamless platform that offers a wide selection of top-tier sports facilities, paired with intuitive booking features and exclusive offers. Whether you're a player or an organizer, Cleat Connect is here to enhance your sports experience and make turf bookings effortless.</p>
            </div>
        </div>
      </section>
    </>
  )
}

export default AboutPage
