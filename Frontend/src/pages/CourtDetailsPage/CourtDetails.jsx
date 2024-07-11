import React, { useEffect, useState } from "react";
import "./CourtDetails.css";
import facebookIcon from "../../assets/facebook.svg";
import instagramIcon from "../../assets/instagram.svg";
import Navbar from "../../components/Navbar/Navbar";
import { ErrorToast, successToast } from "../../constants/toast";
import { useNavigate, useParams } from "react-router-dom";
import { TIMINGS } from "../../constants/timings.js";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../redux/userSlice.js";

const CourtDetails = () => {
  const params = useParams();
  const dispatch = useDispatch()
  const today = new Date().toISOString().split("T")[0];

  const { currentUser } = useSelector((state) => state.user);

  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [openSlotModal, setOpenSlotModal] = useState(false);
  const [selectedTurfData, setSelectedTurfData] = useState({});
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [timings, setTimings] = useState(TIMINGS);
  const [openSlotList, setOpenSlotList] = useState(false);
  const [openMessageModal, setOpenMessageModal] = useState(false);
  const [slotData, setSlotData] = useState({
    startDate: "",
    endDate: "",
    cost: "",
    turfId: "",
    selectedSlots: "",
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingDate, setBookingDate] = useState(today);
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    const fetchUpdates = async () => {
      dispatch(setLoader(true))
      const turfId = params.turfId;
      try {
        const res = await axios.get(`/api/user/get-turf/${turfId}`);
        const data = await res.data;
        if (data.success === false) {
          dispatch(setLoader(false))
          ErrorToast('Failed to load details');
          return;
        }
        setSelectedTurfData(data.data);
        dispatch(setLoader(false))
      } catch (error) {
        dispatch(setLoader(false))
        ErrorToast('Server error!');
      }
    };
    fetchUpdates();
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await axios.get("/api/user/get-slots", {
          params: { turfId: params.turfId, date: bookingDate },
        });
        const data = await res.data;
        if (data.success === false) {
          ErrorToast('Slots are not listed yet');
          return;
        }
        setAvailableSlots(data.data);
      } catch (error) {
        ErrorToast('Server error!');
      }
    };
    fetchSlots();
  }, [bookingDate]);

  const handleSlotSelection = (e, slot) => {
    e.stopPropagation();
    setSelectedSlots([...selectedSlots, slot]);

    const newTimes = timings.filter((element) => element.id !== slot.id);
    setTimings(newTimes);
    setOpenSlotList(false);
    console.log(selectedSlots);
  };

  const handleSlotCreation = async (e) => {
    e.preventDefault();
    dispatch(setLoader(true))
    try {
      if (slotData.startDate === "" || slotData.endDate === "") {
        dispatch(setLoader(false));
        ErrorToast("Enter a valid date");
        return 
      } else if (slotData.cost === "") {
        dispatch(setLoader(false))
        ErrorToast("Enter the cost");
        return 
      } 
      const res = await axios.post("/api/manager/create-slot", {
        ...slotData,
        turfId: params.turfId,
        selectedSlots: selectedSlots,
      });
      const data = await res.data;
      if (data.success === false) {
        dispatch(setLoader(false))
        ErrorToast("Something went wrong!");
        return;
      }
      successToast(data.message);
      setOpenSlotModal(false);
    } catch (error) {
      dispatch(setLoader(false))
      ErrorToast("Sever error!");
    }
  };

  const handleChange = (e) => {
    setSlotData({
      ...slotData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSlotBooking = (slot) => {
    if (bookedSlots.find((ele) => ele._id === slot._id)) {
      const temp = bookedSlots.filter((ele) => ele._id !== slot._id);
      setBookedSlots(temp);
    } else {
      setBookedSlots([...bookedSlots, slot]);
    }
  };

  const handleBooking = async (e) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      ErrorToast("Razorpay SDK failed to load. Are you online?");
      return;
    }

    if (!bookedSlots){
      return ErrorToast('Select a slot');
    }
    // creating a new order
    const slotIds = bookedSlots.map((ele) => {
      return ele._id;
    });
    const result = await axios.post("/api/booking/book-slot", {
      turfId: params.turfId,
      timeSlotIds: slotIds,
    });

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    // Getting the order details back
    const { amount, id: order_id, currency, receipt } = result.data;

    const options = {
      key: import.meta.env.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: "Cleat Connect",
      description: "Test Transaction",
      image: null,
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          receipt,
          timeSlotIds: slotIds,
          turfId: params.turfId,
          bookingDate,
        };

        const result = await axios.post("/api/booking/verify-booking", data);
        setOpenBookingModal(false);
        setOpenMessageModal(true);

      },
      prefill: {
        name: "Soumya Dey",
        email: "SoumyaDey@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Soumya Dey Corporate Office",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  const handleConfirmationMail = async () => {
    dispatch(setLoader(true))
    try {
      const res = await axios.post('/api/booking/confirmation', {
        userName: currentUser.data.name,
        userEmail: currentUser.data.email,
        turfId: params.turfId,
        bookedSlots,
      });
      const data = await res.data;
      if (!data){
        dispatch(setLoader(false))
        ErrorToast('Try again later');
        return;
      }
      dispatch(setLoader(false))
      successToast('Check your mail for confirmation');
      setOpenMessageModal(false);
      location.reload();
    } catch (error) {
      dispatch(setLoader(false))
      ErrorToast('Server error!');
    }
  };

  const handleCancel = () => {
    setOpenSlotModal(false);
    location.reload();
  }

  return (
    <>
      <div className="main-wrapper">
        <Navbar />
        <header className="court-details-header">
          <h1 className="court-name">{selectedTurfData.name} </h1>
        </header>
        <div className="main-container">
          <div className="left-detail-container">
            <h3 className="court-detail-titles">Location</h3>
            <p className="court-detail-content">{selectedTurfData.location}</p>
            <h3 className="court-detail-titles">Contact Number</h3>
            <p className="court-detail-content">
              {selectedTurfData.contactNumber}
            </p>
            <h3 className="court-detail-titles">Type</h3>
            <p className="court-detail-content">{selectedTurfData.turfType}</p>
            <h3 className="court-detail-titles">Discription</h3>
            <p className="court-detail-content">
              {selectedTurfData.description}
            </p>

            <ul>
              <li>
                <img src={facebookIcon} alt="facebook" />
              </li>
              <li>
                <img src={instagramIcon} alt="instagram" />
              </li>
            </ul>

            <button
              className="btn"
              onClick={() => {
                setOpenBookingModal(true);
              }}
            >
              Book
            </button>
            {currentUser?.data?.role === "manager" && (
              <button
                className="btn add-slot"
                onClick={() => setOpenSlotModal(true)}
              >
                Add slot
              </button>
            )}
          </div>
          <div className="right-photos-container">
            <div className="court-photos">
              {selectedTurfData.imageUrls?.length > 0 &&
                selectedTurfData.imageUrls?.map((photo) => (
                  <img src={photo} key={photo} alt="photo" />
                ))}
            </div>
          </div>
        </div>
        {openBookingModal && (
          <div className="select-slot-modal">
            <div className="turf-creation-container slot-modal">
              <div className="turf-creation-form-container">
                <form>
                  <h3>Book slots</h3>
                  <input
                    type="date"
                    placeholder="Turf name"
                    name="name"
                    className="creation-box"
                    min={today}
                    value={bookingDate}
                    onChange={(e) => {
                      setBookingDate(e.target.value);
                    }}
                  />
                  <p>Select slots</p>
                  <div className="slot-display">
                    {availableSlots &&
                      availableSlots.map((slot) => (
                        <span
                          className={`${
                            bookedSlots.find((ele) => ele._id === slot._id)
                              ? "selection"
                              : slot.bookedBy
                              ? "booked-slot"
                              : "nonBooked-slot"
                          }`}
                          key={slot._id}
                          onClick={() =>
                            !slot.bookedBy && handleSlotBooking(slot)
                          }
                        >
                          {slot.slot.name} <br /> ₹{slot.cost}{" "}
                        </span>
                      ))}
                  </div>
                  <input
                    type="button"
                    className="btn"
                    value="Confirm"
                    onClick={handleBooking}
                  />
                  <input
                    type="button"
                    className="btn cancel"
                    onClick={() => setOpenBookingModal(false)}
                    value="Cancel"
                  />
                </form>
              </div>
            </div>
          </div>
        )}
        {openSlotModal && (
          <div className="select-slot-modal">
            <div className="turf-creation-container slot-modal">
              <div className="turf-creation-form-container">
                <form onSubmit={handleSlotCreation}>
                  <h3>Add slots</h3>
                  <p>From</p>
                  <input
                    type="date"
                    min={today}
                    placeholder="Start Date"
                    name="startDate"
                    className="creation-box"
                    value={slotData.startDate}
                    onChange={handleChange}
                  />
                  <p>To</p>
                  <input
                    type="date"
                    min={today}
                    placeholder="End Date"
                    name="endDate"
                    className="creation-box"
                    defaultValue="End date"
                    onChange={handleChange}
                  />
                  <p>Cost</p>
                  <input
                    type="number"
                    min={today}
                    placeholder="Turf name"
                    name="cost"
                    className="creation-box"
                    value={slotData.cost}
                    onChange={handleChange}
                  />
                  <p
                    onClick={() => setOpenSlotList(true)}
                    className="slot-selector"
                  >
                    Select slots
                  </p>
                  {openSlotList && (
                    <ul className="creation-box creation-list">
                      {timings.map((slot) => (
                        <li onClick={(e) => handleSlotSelection(e, slot)}>
                          {slot.name}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="slot-display">
                    {selectedSlots.map((slot) => (
                      <span className="slot-span">{slot.name}</span>
                    ))}
                  </div>
                  <input type="submit" className="btn" value="Create" />

                  <input
                    type="button"
                    className="btn cancel"
                    onClick={handleCancel}
                    value="Cancel"
                  />
                </form>
              </div>
            </div>
          </div>
        )}
        {openMessageModal && (
          <div className="select-slot-modal">
            <div className="turf-creation-container slot-modal">
              <div className="turf-creation-form-container">
                <form>
                <div>Your booking completed successfully, You will get an email including booking details</div>
                <input type="button" value='Ok' className="btn" onClick={handleConfirmationMail}/>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CourtDetails;
