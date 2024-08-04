import React from "react";
import "./Profile.css";
import addUserIcon from "../../assets/addUserIcon.svg"
import addNewCourtIcon from "../../assets/addNewCourt.svg"
import bookingsIcon from "../../assets/bookings.svg"
import manageIcon from "../../assets/manageIcon.svg"
import logoutIcon from "../../assets/logoutIcon.svg"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {signOutUserStart, signOutUserSuccess, signOutUserFailure} from '../../redux/userSlice.js'
import { ErrorToast, successToast } from "../../constants/toast";
import axios from "axios";

const Profile = () => {

  const { currentUser, darkMode } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await axios.get("/api/auth/logout");
      const data = await res.data;
      if (data.success === false) {
        dispatch(signOutUserFailure());
        ErrorToast("Something went wrong!");
        return;
      }
      dispatch(signOutUserSuccess());
      successToast(data.message);
      navigate('/homepage');
    } catch (error) {
      dispatch(signOutUserFailure());
      ErrorToast(error.response.data.message);
    }
  };

  return (
    <>
    <div className="card-container">
      <div className={`card ${darkMode ? 'dark-mode' : ''}`}>
        <div className="card-header">
          <div className="card-main">
            <div className="profile-image">
            </div>
            <h3 className="username">{currentUser.data.name}</h3>
            <p className="user-subname">{currentUser.data.role}</p>
          </div>
        </div>
        <div className="card-content">
          <div className="left-content">
            <div className="profile-container">
              <h3 className={`detail-title ${darkMode ? 'dark-mode-text' : ''}`}>Email</h3>
              <p className="detail-data">{currentUser.data.email}</p>
              <h3 className={`detail-title ${darkMode ? 'dark-mode-text' : ''}`}>Mobile Number</h3>
              <p className="detail-data">{currentUser.data.contactNumber}</p>
            </div>
            <div className="buttons-container">
              { currentUser.data.role === "admin" && <> <span className="icon"><img src={addUserIcon} alt="icon" onClick={()=>navigate('/create-new-user')}/></span>
              <span className="icon"><img src={addNewCourtIcon} alt="icon" onClick={()=>navigate('/create-new-turf')} /></span> </>}
              <span className="icon"><img src={bookingsIcon} alt="icon" onClick={()=>navigate('/view-bookings')} /></span>
              { currentUser.data.role === 'manager' && <span className="icon"><img src={manageIcon} alt="icon" onClick={()=>navigate('/manage-bookings')} /></span>}
              <span className="icon"><img src={logoutIcon} alt="icon" onClick={handleLogout} /></span>
              </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;
