import React, { useEffect, useState } from "react";
import "./Bookings.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ErrorToast } from "../../constants/toast";
import { setLoader } from "../../redux/userSlice.js";

const Bookings = () => {
    const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.user);

  const [ bookings, setBookings ] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
        dispatch(setLoader(true));
      try {
        const res = await axios.get('/api/user/view-bookings');
        const data = await res.data;
        if (data.success !== true) {
            dispatch(setLoader(false));
          ErrorToast("Failed to find your bookigs!");
          return;
        }
        setBookings(data.data);
        dispatch(setLoader(false));
      } catch (error) {
        dispatch(setLoader(false));
        ErrorToast(error.response);
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
