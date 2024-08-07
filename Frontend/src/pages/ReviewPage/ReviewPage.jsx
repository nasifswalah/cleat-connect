// Import with ReviewPage.css for styles
import "./ReviewPage.css";

// Import the neccessary hooks and components
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

// Import axios for making HTTP requests
import axios from "axios";

// import setLoader action creator from user slice 
import { setLoader } from "../../redux/generalSlice.js";

// Import ErrorToast and successToast to manage notifications 
import { ErrorToast, successToast } from "../../constants/toast";

// Import neccessary icons from react-icons
import { FaStar } from "react-icons/fa";



const ReviewPage = () => {

  // Get the params function from useParams hook
  const params = useParams();

  // Initializing a variable for turf id from params
  const turfId = params.turfId;

  // Get the dispatch function from useDispatch hook
  const dispatch = useDispatch();

  // Destructuring darkMode and currentUser from the user slice of Redux state
  const { currentUser } = useSelector((state) => state.user);
  const {  darkMode } = useSelector((state) => state.general);

  //useState hook to manage changes whether rating
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);

  // useState hook to manage new review data
  const [newReview, setNewReview] = useState({
    review: "",
    rating: "",
    postedBy: "",
    postedFor: "",
  });

  // useState hook to manage existing reviews
  const [reviews, setReviews] = useState([]);

  // useEffect hook to fetch existing reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        dispatch(setLoader(true));
        const res = await axios.get(`/api/user/get-review/${turfId}`);
        const data = await res.data;
        if (data.success !== true) {
          dispatch(setLoader(false));
          ErrorToast(data.message);
          return;
        }
        setReviews(data.data);
        dispatch(setLoader(false));
      } catch (error) {
        dispatch(setLoader(false));
        ErrorToast(error.response.data.message);
      }
    };
    fetchReviews();
  }, []);

  // Function to handle changes whether posting a new review
  const handleReviewPostingChange = (e) => {
    setNewReview({
      ...newReview,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle review posting
  const handleReviewPosting = async (e) => {
    dispatch(setLoader(true));
    try {
      const res = await axios.post(`/api/user/post-review`, {
        ...newReview,
        rating: rating,
        postedBy: currentUser.data.name,
        postedFor: turfId,
      });
      const data = await res.data;
      if (data.success !== true) {
        dispatch(setLoader(false));
        ErrorToast("Posting failed");
        return;
      }
      dispatch(setLoader(false));
      successToast(data.message);
    } catch (error) {
      dispatch(setLoader(false));
      ErrorToast(error.response.data.message);
    }
  };

  return (
    <div className="listing-container">
      <h3 className={`listing-title ${darkMode ? "dark-mode-text" : ""}`}>Reviews & Ratings</h3>
      <form className={`review-form ${darkMode ? 'dark-mode' : ''}`} onSubmit={handleReviewPosting}>
        <input
          type="textarea"
          className="review-box"
          name="review"
          onChange={handleReviewPostingChange}
          required
        />
        <div >
          {[...Array(5)].map((star, index) => {
            let currentRating = index + 1;
            return (
              <label>
                <input
                  type="ratio"
                  name="rating"
                  value={currentRating}
                  onClick={() => setRating(currentRating)}
                />
                <FaStar
                  className="star"
                  size={20}
                  color={
                    currentRating <= (hover || rating) ? "#ffc107" : "#8b8b8b7a"
                  }
                  onMouseEnter={() => setHover(currentRating)}
                  onMouseLeave={() => setHover(null)}
                />
              </label>
            );
          })}
        </div>
        <input type="submit" className="btn" value="Post" />
      </form>

      <div className={`reviewsDisplay review-form ${darkMode ? 'dark-mode' : ''}`}>
        {reviews &&
          reviews.map((review, index) => (
            <div className="review" key={index}>
              <h5>{review.postedBy}</h5>
              <div >
          {[...Array(review.rating)].map((star, index) => {
            const currentRating = review.rating;
            return (
              <label>
                <input
                  type="ratio"
                  name="rating"
                  value={currentRating}
                />
                <FaStar
                  className="star"
                  size={20}
                  color="#ffc107" 
                />
              </label>
            );
          })}
        </div>
              <p>{review.review}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ReviewPage;
