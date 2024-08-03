import React, { useState } from "react";
import "./SearchDisplay.css";
import searchIcon from "../../assets/searchIcon.svg";
import axios from "axios";
import { ErrorToast } from "../../constants/toast";
import { Link } from "react-router-dom";
import { setLoader } from "../../redux/userSlice";
import { useDispatch } from "react-redux";

const SearchDisplay = () => {
  const dispatch = useDispatch();
  const [searchResult, setSearchResult] = useState([]);
  const [searchInput, setSearchInput] = useState();

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
      ErrorToast('Server error!');
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
                    <img src={turf.imageUrls[1]} alt="turf image" />
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
