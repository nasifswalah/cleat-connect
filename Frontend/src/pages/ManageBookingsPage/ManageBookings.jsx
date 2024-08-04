import React, { useEffect, useState } from "react";
import "./ManageBookings.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setLoader } from "../../redux/userSlice.js";
import { ErrorToast, successToast } from "../../constants/toast";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";

const ManageBookings = () => {
  const dispatch = useDispatch();
  const { darkMode, currentUser } = useSelector((state) => state.user);

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      dispatch(setLoader(true));
      try {
        const res = await axios.get("/api/manager/manage-bookings");
        const data = await res.data;
        if (data.success !== true) {
          dispatch(setLoader(false));
          ErrorToast("Failed to find bookigs!");
          return;
        }
        setBookings(data.data);
        dispatch(setLoader(false));
      } catch (error) {
        dispatch(setLoader(false));
        ErrorToast(error.response.data.message);
      }
    };

    fetchBookings();
  }, []);

  const handleConfirmation = async (booking) => {
    const subject = 'Booking Confirmation Details';
    const content = `Your booking confirmed by the turf manager.
    For more details contact: ${currentUser.data.email}.`
    dispatch(setLoader(true))
    try {
      const res = await axios.post('/api/manager/confirmation', {
        bookedByName: booking.bookedByName,
        bookedBy: booking.bookedBy,
        turfId: booking.turfId,
        subject,
        content,
        timeSlotNames: booking.timeSlotNames,
        totalCost: booking.totalCost,
      });
      const data = await res.data;
      if (data.success !== true){
        dispatch(setLoader(false))
        ErrorToast('Something went wrong');
        return;
      }
      dispatch(setLoader(false))
      successToast(data.message);
    } catch (error) {
      dispatch(setLoader(false))
      ErrorToast(error.response.data.message);
    }
  };
  
  const handleCancellationMail = async (booking) => {
    const subject = 'Booking Cancellation Details';
    const content = `Your booking cancelled by the turf manager.
    For more details contact: ${currentUser.data.email}.`
    try {
      const res = await axios.post('/api/manager/confirmation', {
        bookedByName: booking.bookedByName,
        bookedBy: booking.bookedBy,
        turfId: booking.turfId,
        subject,
        content,
        timeSlotNames: booking.timeSlotNames,
        totalCost: booking.totalCost,
      });
      const data = await res.data;
      if (data.success !== true){
        ErrorToast('Something went wrong');
        return;
      }
      successToast(data.message);
    } catch (error) {
      ErrorToast(error.response.data.message);
    }
  };

  const handleCancellation = async (booking) =>{
    dispatch(setLoader(true))
    try {
        const res = await axios.delete(`/api/manager/cancel-booking/${booking._id}`);
        const data = await res.data;
        if(data.success !== true){
            dispatch(setLoader(false));
            ErrorToast('Something went wrong!');
            return;
        }
        dispatch(setLoader(false));
        successToast(data.message);
        handleCancellationMail(booking);
        setBookings((prev) => prev.filter((listing) => listing._id !== booking._id));
    } catch (error) {
        dispatch(setLoader(false));
        ErrorToast(error.response.data.message);
    }
  };

  return (
    <div className="listing-container">
      <h3 className={`listing-title ${darkMode ? "dark-mode-text" : ""}`}>
        Manage Bookings
      </h3>
      <div
        className={`bookingsDisplay booking-form ${
          darkMode ? "dark-mode" : ""
        }`}
      >
        {bookings &&
          bookings?.map((booking, index) => (
            <div className="bookings manage" key={index}>
              <div className="booking-details">
                <p>Booked By: {booking.bookedBy}</p>
                <p>Booked Slots: {booking.timeSlotNames}</p>
                <p>Amount Paid: {booking.totalCost}</p>
                <p>
                  Booked Date:{" "}
                  {new Date(booking.bookingDate).toLocaleDateString()}
                </p>
              </div>
              <div className="manage-btns">
                <FaCircleCheck size={20} color="#4E9F3D" onClick={() => handleConfirmation(booking)} />
                <IoIosCloseCircle size={23} color="#ED2B2A" onClick={() => handleCancellation(booking, index)} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ManageBookings;
