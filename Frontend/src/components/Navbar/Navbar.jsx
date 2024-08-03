import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import logo from "../../assets/Cleat logo.png";
import "./Navbar.css";
import bar from "../../assets/bar.svg";
import closeIcon from "../../assets/close.svg";
import { useDispatch, useSelector } from "react-redux";
import { setDarkMode } from "../../redux/userSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { currentUser, darkMode } = useSelector((state) => state.user);
  const [modeChanger, setModeChanger] = useState(false);
  const [scrollEffect, setScrollEffect] = useState();

  const handleScrollEffect = () => {
    if (window.scrollY >= 70) {
      if( darkMode === true){
        setScrollEffect('darkScrollEffect');
      } else {
        setScrollEffect('scrollEffect');
      }
    } else {
      setScrollEffect('');
    }
  };
  window.addEventListener("scroll", handleScrollEffect);

  return (
    <>
      <header>
        <div
          className={`container ${
            modeChanger
              ? "active"
              : '' 
          } ${scrollEffect}`}
        >
          <div className="logo">
            <img src={logo} alt="" />
            <h3 className={`${darkMode ? 'dark-mode-text' : ''}`}>Cleat Connect</h3>
          </div>

          <div className="links">
            <ul>
              <li onClick={() => {dispatch(setDarkMode(!darkMode))}}
              >
                <Link to="#" className={`nav-link ${darkMode ? 'dark-mode-text' : ''}`}>
                  Dark mode
                </Link>
              </li>
              <li>
                <Link to="/homepage" className={`nav-link ${darkMode ? 'dark-mode-text' : ''}`}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/aboutUs" className={`nav-link ${darkMode ? 'dark-mode-text' : ''}`}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/search-display" className={`nav-link ${darkMode ? 'dark-mode-text' : ''}`}>
                  Search
                </Link>
              </li>
              <li>
                <Link
                  to={currentUser ? "/profile" : "/auth"}
                  className={`nav-link ${darkMode ? 'dark-mode-text' : ''}`}
                  id={currentUser ? "profile" : "btn"}
                >
                  {currentUser ? "Profile" : "Register"}
                </Link>
              </li>
            </ul>
          </div>
          <div className="overlay"></div>
          <div
            className="humburger-menu"
            onClick={() => {
              setModeChanger(!modeChanger);
            }}
          >
            <img src={modeChanger ? closeIcon : bar} alt="menubar" />
          </div>
        </div>
      </header>
      <Outlet />
    </>
  );
};
export default Navbar;
