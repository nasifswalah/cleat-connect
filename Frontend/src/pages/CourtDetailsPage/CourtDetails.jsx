// Import with CourtDetails.css for styles
import "./CourtDetails.css";

// Import the neccessary hooks and components
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Import axios for making HTTP requests
import axios from "axios";

// Import ErrorToast and successToast to manage notifications 
import { ErrorToast, successToast } from "../../constants/toast";

// Import the timing data
import { TIMINGS } from "../../constants/timings.js";

// import setLoader action creator from user slice 
import { setLoader } from "../../redux/generalSlice.js";

const CourtDetails = () => {

  // Get the params function from useParams hook
  const params = useParams();

  // Get the dispatch function from useDispatch hook
  const dispatch = useDispatch()

  // Get the navigate function from useNavigate hook
  const navigate = useNavigate();

  // Initializing variable with current date
  const today = new Date().toISOString().split("T")[0];

  // Destructuring darkMode and currentUser from the user slice of Redux state
  const { currentUser } = useSelector((state) => state.user);

  const { darkMode } = useSelector((state) => state.general);

  // useState hook to manage the opening and closing of booking modal
  const [openBookingModal, setOpenBookingModal] = useState(false);

  // useState hook to manage the opening and closing of slot modal
  const [openSlotModal, setOpenSlotModal] = useState(false);

  // useState hook to manage the opening and closing of message modal
  const [openMessageModal, setOpenMessageModal] = useState(false);

  // useState hook to store and manage the selected turf data
  const [selectedTurfData, setSelectedTurfData] = useState({});

  // useState hook to store and manage the slected slots data
  const [selectedSlots, setSelectedSlots] = useState([]);

  // useState hook to store and manage the constant timings
  const [timings, setTimings] = useState(TIMINGS);

  // useState hook to manage the opening and closing of slot selection list
  const [openSlotList, setOpenSlotList] = useState(false);
  
  // useState hook to store and manage the slot booking data
  const [slotData, setSlotData] = useState({
    startDate: "",
    endDate: "",
    cost: "",
    turfId: "",
    selectedSlots: "",
  });

  // useState hook to store and manage available slots data
  const [availableSlots, setAvailableSlots] = useState([]);

  // useState hook to manage the date in calender
  const [bookingDate, setBookingDate] = useState(today);

  // useState hook to manage booked slots 
  const [bookedSlots, setBookedSlots] = useState([]);

  // useEffect hook to retrive the selected turf data
  useEffect(() => {
    const fetchUpdates = async () => {
      const turfId = params.turfId;
      try {
        dispatch(setLoader(true));
        const res = await axios.get(`/api/user/get-turf/${turfId}`);
        const data = await res.data;
        if (data.success === false) {
          dispatch(setLoader(false));
          ErrorToast('Failed to load details');
          return;
        }
        setSelectedTurfData(data.data);
        dispatch(setLoader(false));
      } catch (error) {
        dispatch(setLoader(false));
        ErrorToast(error.response.data.message);
      }
    };
    fetchUpdates();
  }, []);

  // useEffect hook to retrive available slots
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
        ErrorToast(error.response.data.message);
      }
    };
    fetchSlots();
  }, [bookingDate]);

  // Function to handle slot selection whether adding new slot
  const handleSlotSelection = (e, slot) => {
    e.stopPropagation();
    setSelectedSlots([...selectedSlots, slot]);

    const newTimes = timings.filter((element) => element.id !== slot.id);
    setTimings(newTimes);
    setOpenSlotList(false);
  };

  // function to handle new slot creation
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
      dispatch(setLoader(false))
      successToast(data.message);
      setSlotData({
        startDate: "",
        endDate: "",
        cost: "",
        turfId: "",
        selectedSlots: "",
      });
      setSelectedSlots([]);
      setOpenSlotList(false);
      setOpenSlotModal(false);
    } catch (error) {
      dispatch(setLoader(false))
      ErrorToast(error.response.data.message);
      console.log(error);
      
    }
  };

  // Function to handle changes in slot creation
  const handleChange = (e) => {
    setSlotData({
      ...slotData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle slot selection whether booking a new slot
  const handleSlotBooking = (slot) => {
    if (bookedSlots.find((ele) => ele._id === slot._id)) {
      const temp = bookedSlots.filter((ele) => ele._id !== slot._id);
      setBookedSlots(temp);
    } else {
      setBookedSlots([...bookedSlots, slot]);
    }
  };

  // Function to handle slot booking
  const handleBooking = async (e) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      ErrorToast("Razorpay SDK failed to load. Are you online?");
      return;
    }

    if (bookedSlots.length === 0){
      return ErrorToast('Select a slot');
    }

    const slotIds = bookedSlots.map((ele) => {
      return ele._id;
    });
    
    const slotNames = bookedSlots.map((ele) => {
      return ele.slot.name;
    });

    const turfName = selectedTurfData.name;
  
    const result = await axios.post("/api/booking/book-slot", {
      turfId: params.turfId,
      timeSlotIds: slotIds,
      timeSlotNames: slotNames,
      turfName: turfName,
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
          turfName: turfName,
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

  // Function to handle the cancellation of slot creation
  const handleSlotCreationCancellation = () => {
    setOpenSlotModal(false);
    setSelectedSlots([]);
    setOpenSlotList(false);
    setTimings(TIMINGS);
  }

  // Function to handle the cancellation of slot booking
  const handleBookingCancellation = () => {
    setOpenBookingModal(false);
    setBookedSlots([]);
    setBookingDate(today);
  }

  return (
    <>
      <div className="main-wrapper">
        <header className="court-details-header">
          <h1 className="court-name">{selectedTurfData.name} </h1>
        </header>
        <div className="main-container">
          <div className="left-detail-container">
            <h3 className={`court-detail-titles ${darkMode ? 'dark-mode-text' : ''}`}>Location</h3>
            <p className="court-detail-content">{selectedTurfData.location}</p>
            <h3 className={`court-detail-titles ${darkMode ? 'dark-mode-text' : ''}`}>Contact Number</h3>
            <p className="court-detail-content">
              {selectedTurfData.contactNumber}
            </p>
            <h3 className={`court-detail-titles ${darkMode ? 'dark-mode-text' : ''}`}>Type</h3>
            <p className="court-detail-content">{selectedTurfData.turfType}</p>
            <h3 className={`court-detail-titles ${darkMode ? 'dark-mode-text' : ''}`}>Discription</h3>
            <p className="court-detail-content">
              {selectedTurfData.description}
            </p>

            <span className={`${darkMode ? 'dark-mode-text' : ''}`} onClick={() => navigate(`/turf-details/${params.turfId}/review`)}>
              Reviews & Ratings
            </span>

            <button
              className="btn"
              onClick={() => {
                setOpenBookingModal(true);
              }}
            >
              Book
            </button>
            {currentUser?.data?.email === selectedTurfData.manager && (
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
                <form className={`${darkMode ? 'dark-mode' : ''}`}>
                  <h3 className={`${darkMode ? 'dark-mode-text' : ''}`}>Book slots</h3>
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
                    className="btn create"
                    value="Confirm"
                    onClick={handleBooking}
                  />
                  <input
                    type="button"
                    className="btn cancel"
                    onClick={handleBookingCancellation}
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
                <form className={`${darkMode ? 'dark-mode' : ''}`} onSubmit={handleSlotCreation}>
                  <h3 className={`${darkMode ? 'dark-mode-text' : ''}`}>Add slots</h3>
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
                    placeholder="Cost"
                    name="cost"
                    className="creation-box"
                    value={slotData.cost}
                    onChange={handleChange}
                  />
                  <p
                    onClick={() => setOpenSlotList(!openSlotList)}
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
                      <span className="slot-span" onClick={(e) => {setSelectedSlots((prev) => prev.filter((listing) => listing.id !== slot.id))}}>{slot.name}</span>
                    ))}
                  </div>
                  <input type="submit" className="btn create" value="Create" />

                  <input
                    type="button"
                    className="btn cancel"
                    onClick={handleSlotCreationCancellation}
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
                <form className={`${darkMode ? 'dark-mode' : ''}`}>
                <div>Your booking completed successfully, You will get an email including booking details</div>
                <input type="button" value='Ok' className="btn" onClick={() => setOpenMessageModal(false)}/>
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
