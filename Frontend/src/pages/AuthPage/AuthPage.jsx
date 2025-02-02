// Import with AuthPage.css for styles
import "./AuthPage.css";

// Import the neccessary hooks and components
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Import axios for making HTTP requests
import axios from 'axios'

// Import neccessary icons from assets folder
import userIcon from "../../assets/userIcon.svg";
import lockIcon from "../../assets/lockIcon.svg";
import emailIcon from "../../assets/emailIcon.svg";
import phoneIcon from "../../assets/phoneIcon.svg";
import football from "../../assets/football.svg";
import soccer from "../../assets/soccer.svg";

// import sign-in action creators from user slice 
import {
  signinSuccess,
} from "../../redux/userSlice";

// Import ErrorToast and successToast to manage notifications 
import { ErrorToast, successToast } from "../../constants/toast";


const AuthPage = () => {

  // Get the navigate function from useNavigate hook
  const navigate = useNavigate();

  // Get the dispatch function from useDispatch hook
  const dispatch = useDispatch();

  // Destructuring darkMode from the user slice of Redux state
  const { darkMode } = useSelector((state) => state.general);

  // useState hook to manage the changes in responsiveness of the page
  const [modeChanger, setModeChanger] = useState("");

  // useState hook to store and manage user details for sign-up 
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNumber: '',
    role: '',
  });

  // useState hook to store and manage user details for sign-in 
  const [signInData, setSignInData] = useState({
    email:'',
    password:'',
  });
  
  // Function to handle the changes in input fields of sign-up form
  const handleSignUpChange = (e) => {
    setSignUpData({
      ...signUpData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle the changes in input fields of sign-in form
  const handleSignInChange = (e) => {
    setSignInData({
      ...signInData,
      [e.target.name]: e.target.value,
    });
  };

  //Function to handle sign-up
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/register", {
        ...signUpData,
        role: 'user'
      });
      const data = await res.data;
      if (data.success === false) {
        ErrorToast('Try again later');
        return;
      }
      setModeChanger("sign-in-mode");
      successToast(data.message);
    } catch (error) {
      ErrorToast(error.response.data.message);
    }
  };

  ////Function to handle sign-in
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", signInData);
      const data = await res.data;
      if (data.success === false) {
        ErrorToast('Try again later')
        return;
      }
      dispatch(signinSuccess(data));
      successToast(data.message);
      navigate("/homepage");
    } catch (error) {
      ErrorToast(error.response.data.message)
    }
  };
  
  return (
    <>
      <div className={`main-conatiner ${modeChanger} ${darkMode ? 'dark-mode' : ''}`}>
        <div className="form-conatiner">
          <div className="auth-container">
            <form onSubmit={handleSignIn} className="sign-in-form ">
              <h3 className={`auth-title ${darkMode ? 'dark-mode-text' : ''}`}>Sign in</h3>
              <div className="input-field">
                <img src={userIcon} alt="" />
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={signInData.email}
                  onChange={handleSignInChange}
                />
              </div>
              <div className="input-field">
                <img src={lockIcon} alt="" />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={signInData.password}
                  onChange={handleSignInChange}
                />
              </div>
              <input
                type="submit"
                className="btn"
                value="Login"
              />
            </form>

            <form onSubmit={handleSignUp} className="sign-up-form ">
              <h2 className={`auth-title ${darkMode ? 'dark-mode-text' : ''}`}>Sign up</h2>
              <div className="input-field">
                <img src={userIcon} alt="" />
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={signUpData.name}
                  onChange={handleSignUpChange}
                />
              </div>
              <div className="input-field">
                <img src={emailIcon} alt="" />
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={signUpData.email}
                  onChange={handleSignUpChange}
                />
              </div>
              <div className="input-field">
                <img src={phoneIcon} alt="" />
                <input
                  type="text"
                  placeholder="Contact Number"
                  name="contactNumber"
                  value={signUpData.contactNumber}
                  onChange={handleSignUpChange}
                />
              </div>
              <div className="input-field">
                <img src={lockIcon} alt="" />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={signUpData.password}
                  onChange={handleSignUpChange}
                />
              </div>
              <div className="input-field">
                <img src={lockIcon} alt="" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={signUpData.confirmPassword}
                  onChange={handleSignUpChange}
                />
              </div>
              <input
                type="submit"
                className="btn"
                value="Sign up"
              />
            </form>
          </div>
        </div>
        <div className="panel-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>New here ?</h3>
              <p>
              Join now to discover and book top sports turfs with ease
              </p>
              <button
                className="btn transparent"
                id="sign-up-btn"
                onClick={() => {
                  setModeChanger("sign-up-mode");
                }}
              >
                Sign up
              </button>
            </div>
            <img src={soccer} className="image" alt="" />
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>One of us ?</h3>
              <p>
              Access your account to explore and manage bookings effortlessly
              </p>
              <button
                className="btn transparent"
                id="sign-in-btn"
                onClick={() => {
                  setModeChanger("sign-in-mode");
                }}
              >
                Sign in
              </button>
            </div>
            <img src={football} className="image" alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
