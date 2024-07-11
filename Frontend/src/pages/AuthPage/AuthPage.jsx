import userIcon from "../../assets/userIcon.svg";
import lockIcon from "../../assets/lockIcon.svg";
import emailIcon from "../../assets/emailIcon.svg";
import phoneIcon from "../../assets/phoneIcon.svg";
import football from "../../assets/football.svg";
import soccer from "../../assets/soccer.svg";
import "./AuthPage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  signinStart,
  signinSuccess,
  signinFailure,
} from "../../redux/userSlice";
import { ErrorToast, successToast } from "../../constants/toast";
import axios from 'axios'
import Navbar from "../../components/Navbar/Navbar";

const AuthPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [modeChanger, setModeChanger] = useState("");
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNumber: '',
    role: '',
  });
  const [signInData, setSignInData] = useState({
    email:'',
    password:'',
  });
  

  const handleSignUpChange = (e) => {
    setSignUpData({
      ...signUpData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignInChange = (e) => {
    setSignInData({
      ...signInData,
      [e.target.name]: e.target.value,
    });
  };

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
      ErrorToast('Server error!');
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    dispatch(signinStart());
    try {
      const res = await axios.post("/api/auth/login", signInData);
      const data = await res.data;
      if (data.success === false) {
        dispatch(signinFailure());
        ErrorToast('Try again later')
        return;
      }
      dispatch(signinSuccess(data));
      successToast(data.message);
      navigate("/homepage");
    } catch (error) {
      dispatch(signinFailure());
      ErrorToast('Server error!')
    }
  };
  return (
    <>
    <Navbar/>
      <div className={`main-conatiner ${modeChanger}`}>
        <div className="form-conatiner">
          <div className="auth-container">
            <form onSubmit={handleSignIn} className="sign-in-form ">
              <h3 className="auth-title">Sign in</h3>
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
              <h2 className="auth-title">Sign up</h2>
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
