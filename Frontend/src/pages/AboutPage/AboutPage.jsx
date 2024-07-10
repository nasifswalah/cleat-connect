import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import collage from '../../assets/collage2.png'
import './AboutPage.css'

const AboutPage = () => {
  return (
    <>
      <Navbar/>
      <section className="about-section">
        <div className="about-container">
            <img src={collage} alt="collage" />
            <div className="about-text">
                <h4>About Us</h4>
                <h2>Where Sports Meet Simplicity</h2>
                <p>At Cleat Connect, we are passionate about simplifying the way sports enthusiasts discover and book turfs. Our mission is to provide a seamless platform that offers a wide selection of top-tier sports facilities, paired with intuitive booking features and exclusive offers. Whether you're a player or an organizer, Cleat Connect is here to enhance your sports experience and make turf bookings effortless.</p>
            </div>
        </div>
      </section>
    </>
  )
}

export default AboutPage
