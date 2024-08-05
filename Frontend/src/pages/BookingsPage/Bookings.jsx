// Import with Bookings.css for styles
import "./Bookings.css";

// Import the neccessary hooks and components
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Import axios for making HTTP requests
import axios from "axios";

// Import ErrorToast and successToast to manage notifications 
import { ErrorToast } from "../../constants/toast";


const Bookings = () => {

  // Destructuring darkMode from the user slice of Redux state
  const { darkMode } = useSelector((state) => state.general);

  // useState hook to store and manage bookings data
  const [ bookings, setBookings ] = useState([]);

  // useEffect hook to handle retriveing of bookings data 
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('/api/user/view-bookings');
        const data = await res.data;
        if (data.success !== true) {
          ErrorToast("Failed to find your bookigs!");
          return;
        }
        setBookings(data.data);
      } catch (error) {
        ErrorToast(error.response.data.message);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="listing-container">
    <h3 className={`listing-title ${darkMode ? "dark-mode-text" : ""}`}>My Bookings</h3>
    <div
      className={`bookingsDisplay booking-form ${darkMode ? "dark-mode" : ""}`}
    >
      {bookings &&
        bookings?.map((booking) => (
          <div className="bookings" key={booking._id}>
            <p>Turf Name: {booking.turfName}</p>
            <p>Booked Slots: {booking.timeSlotNames}</p>
            <p>Amount Paid: {booking.totalCost}</p>
            <p>Booked Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
          </div>
        ))}
    </div>
    </div>
  );
};

export default Bookings;
