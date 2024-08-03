import axios from "axios";
import "./ReviewPage.css";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setLoader } from "../../redux/userSlice.js";
import { ErrorToast, successToast } from "../../constants/toast";

const ReviewPage = () => {
  const params = useParams();
  const turfId = params.turfId;
  const dispatch = useDispatch();
  const { currentUser, darkMode } = useSelector((state) => state.user);
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [newReview, setNewReview] = useState({
    review: "",
    rating: "",
    postedBy: "",
    postedFor: "",
  });
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
        console.log('working')
        console.log(turfId)
      dispatch(setLoader(true));
      try {
        console.log(turfId)
        const res = await axios.get(`/api/user/get-review/${turfId}`);
        const data = await res.data;
        if (data.success !== true) {
          dispatch(setLoader(false));
          ErrorToast(data.message);
          return;
        }
        dispatch(setLoader(false));
        setReviews(data.data);
      } catch (error) {
        dispatch(setLoader(false));
        ErrorToast(error);
      }
    };
    fetchReviews();
  }, []);

  const handleReviewPostingChange = (e) => {
    setNewReview({
      ...newReview,
      [e.target.name]: e.target.value,
    });
  };

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
      ErrorToast(error);
    }
  };

  return (
    <div className="review-container">
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
            const currentRating = index + 1;
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
                  onMouseEnter={() => setHover(currentRating)}
                  onMouseLeave={() => setHover(null)}
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
