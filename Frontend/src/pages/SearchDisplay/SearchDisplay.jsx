// Import with SearchDisplay.css for styles
import "./SearchDisplay.css";

// Import the neccessary hooks and components
import React, { useState } from "react";
import { useDispatch } from "react-redux";

// Import axios for making HTTP requests
import axios from "axios";

// Import Link component for navigation
import { Link } from "react-router-dom";

// import setLoader action creator from user slice
import { setLoader } from "../../redux/generalSlice.js";

// Import ErrorToast to manage notifications 
import { ErrorToast } from "../../constants/toast";

// Import neccessary icons from assets folder
import searchIcon from "../../assets/searchIcon.svg";


const SearchDisplay = () => {

  // Get the dispatch function from useDispatch hook
  const dispatch = useDispatch();
  
  // useState hook to manage search result
  const [searchResult, setSearchResult] = useState([]);

  // useState hook to manage search input
  const [searchInput, setSearchInput] = useState();

  // Function to handle search result
  const handleSearchResult = async () => {
    dispatch(setLoader(true));
    try {
      const res = await axios.get("/api/user/search-booking", {
        params: { searchTerm: searchInput },
      });
      const data = await res.data;
      if (data.success === false) {
        dispatch(setLoader(false));
        ErrorToast("No such data");
        return;
      }
      setSearchResult(data.data);
      dispatch(setLoader(false));
    } catch (error) {
      dispatch(setLoader(false));
      ErrorToast(error.response.data.message);
    }
  };

  return (
    <>
      <section>
        <div className="search-area-container">
          <div className="search-area">
            <div className="search-input">
              <input
                type="text"
                placeholder="Search.."
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
              />
              <img src={searchIcon} alt="search" onClick={handleSearchResult} />
            </div>
          </div>
        </div>
        <div className="search-display-container">
          <div className="courts-content">
            {searchResult &&
              searchResult.map((turf) => (
                <div className="court-content" key={turf._id}>
                  <Link to={`/turf-details/${turf._id}`}>
                    <img src={turf.imageUrls[0]} alt="turf image" />
                  </Link>
                  <h5>{turf.name}</h5>
                  <p>{turf.location}</p>
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default SearchDisplay;
