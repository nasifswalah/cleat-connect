// Import the neccessary hooks and components
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Import axios for making HTTP requests
import axios from "axios";

// Import ErrorToast and successToast to manage notifications 
import { ErrorToast, successToast } from "../../constants/toast.js";

// import setLoader action creator from user slice 
import { setLoader } from "../../redux/userSlice.js";

const CreateUser = () => {

  // Get the dispatch function from useDispatch hook
  const dispatch = useDispatch();

  // Get the navigate function from useNavigate hook
  const navigate = useNavigate();

  // Destructuring darkMode from the user slice of Redux state
  const { darkMode } = useSelector((state) => state.user);

  // useState hook to manage user details
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    role: "",
  });

  // Function to handle the changes in input fields
  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle the user creation
  const handleUserCreation = async (e) => {
    e.preventDefault();
    dispatch(setLoader(true));
    try {
      const res = await axios.post("/api/admin/create-user", userData);
      const data = await res.data;
      if (data.success === false) {
        dispatch(setLoader(false));
        ErrorToast("Try again later");
        return;
      }
      dispatch(setLoader(false));
      successToast(data.message);
      navigate("/profile");
    } catch (error) {
      dispatch(setLoader(false));
      ErrorToast(error.response.data.message);
    }
  };

  return (
    <>
      <div className='turf-creation-container'>
        <div className='turf-creation-form-container'>
          <form className={`${darkMode ? 'dark-mode' : ''}`}>
            <h3 className={`${darkMode ? 'dark-mode-text' : ''}`}>Add New User</h3>
            <input
              type="text"
              placeholder="Name"
              name="name"
              className="creation-box"
              value={userData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              className="creation-box"
              value={userData.email}
              onChange={handleChange}
            />
            <input
              type="number"
              placeholder="Contact Number"
              name="contactNumber"
              className="creation-box"
              value={userData.contactNumber}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              className="creation-box"
              value={userData.password}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              className="creation-box"
              value={userData.confirmPassword}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Role"
              name="role"
              className="creation-box"
              value={userData.role}
              onChange={handleChange}
            />
            <input
              type="submit"
              className="btn create"
              value="Create"
              onClick={handleUserCreation}
            />
            <input
              type="button"
              className="btn cancel"
              value="Cancel"
              onClick={() => navigate("/profile")}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateUser;
