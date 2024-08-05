// Import with Navbar.css for styles
import "./Navbar.css";

// Import the necessary hooks and components from React and React Redux
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Import the Link and Outlet components from react-router-dom for navigation and nested routing
import { Link, Outlet } from "react-router-dom";

// Import the icons and logo from assets folder 
import logo from "../../assets/Cleat logo.png";
import bar from "../../assets/bar.svg";
import closeIcon from "../../assets/close.svg";
import { setDarkMode } from "../../redux/generalSlice.js";
import { FaRegMoon } from "react-icons/fa";

const Navbar = () => {

  // Get the dispatch function from the Redux store to dispatch actions
  const dispatch = useDispatch();

  // Destructuring currentUser and darkMode from the general slice of Redux state
  const { darkMode } = useSelector((state) => state.general);

  const { currentUser } = useSelector((state) => state.user);

  // useState hook to manage the changes in responsiveness of navigation bar
  const [modeChanger, setModeChanger] = useState(false);

  // useState hook to manage the changes in navbar whether scrolling 
  const [scrollEffect, setScrollEffect] = useState();

  // Method to handle the changes in navbar whether scrolling
  const handleScrollEffect = () => {
    if (window.scrollY >= 50) {
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
              <li onClick={() => setModeChanger(!modeChanger)}>
                <Link to="/homepage" className={`nav-link ${darkMode ? 'dark-mode-text' : ''}`}>
                  Home
                </Link>
              </li>
              <li onClick={() => setModeChanger(!modeChanger)}>
                <Link to="/aboutUs" className={`nav-link ${darkMode ? 'dark-mode-text' : ''}`}>
                  About
                </Link>
              </li>
              <li onClick={() => setModeChanger(!modeChanger)}>
                <Link to="/search-display" className={`nav-link ${darkMode ? 'dark-mode-text' : ''}`}>
                  Search
                </Link>
              </li>
              <li onClick={() => setModeChanger(!modeChanger)}>
                <Link
                  to={currentUser ? "/profile" : "/auth"}
                  className={`nav-link ${darkMode ? 'dark-mode-text' : ''}`}
                  id={currentUser ? "profile" : "btn"}
                >
                  {currentUser ? "Profile" : "Register"}
                </Link>
              </li>
              <li className={`darkener ${darkMode ? 'dark-mode-text' : ''}`} onClick={() => {dispatch(setDarkMode(!darkMode)); setModeChanger(!modeChanger);}}
              >
                  <FaRegMoon size={15}/>
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
