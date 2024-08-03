import React from "react";
import { useSelector } from "react-redux";
import Loader from "./components/Loader/Loader";
import LandingPage from "./pages/LandingPage/LandingPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import HomePage from "./pages/HomePage/HomePage";
import AdminRoute from "./components/PrivateRoutes/AdminRoute";
import TurfCreation from "./pages/TurfCreationPage/TurfCreation ";
import CreateUser from "./pages/AddUserPage/CreateUser";
import TurfUpdation from "./pages/TurfUpdationPage/TurfUpdation";
import UserRoute from "./components/PrivateRoutes/UserRoute";
import Profile from "./pages/ProfilePage/Profile";
import CourtDetails from "./pages/CourtDetailsPage/CourtDetails";
import SearchDisplay from "./pages/SearchDisplay/SearchDisplay";
import AboutPage from "./pages/AboutPage/AboutPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ReviewPage from "./pages/ReviewPage/ReviewPage";
import Navbar from "./components/Navbar/Navbar";

const router = createBrowserRouter([
  {
    element: <Navbar/>,
    children:[
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/auth",
        element: <AuthPage />,
      },
      {
        path: "/homepage",
        element: <HomePage />,
      },
      {
        element: <AdminRoute />,
        children: [
          {
            path: "/create-new-turf",
            element: <TurfCreation />,
          },
          {
            path: "/create-new-user",
            element: <CreateUser />,
          },
          {
            path: "/update-turf/:turfId",
            element: <TurfUpdation />,
          },
        ],
      },
      {
        element: <UserRoute />,
        children: [
          {
            path: "/profile",
            element: <Profile />,
          },
          {
            path: "/turf-details/:turfId",
            element: <CourtDetails />,
          },
          {
            path: "/turf-details/:turfId/review",
            element: <ReviewPage />,
          },
        ],
      },
      {
        path: "/search-display",
        element: <SearchDisplay />,
      },
      {
        path: "/aboutUs",
        element: <AboutPage />,
      },
    ]
  }
  
]);

const App = () => {
  const { loading, darkMode } = useSelector((state) => state.user);
  const body = document.getElementById('body');

if(darkMode === true) {
  body.classList.add('dark-mode')
} else {
  body.classList.remove('dark-mode')
}
  return (
    <>
      <ToastContainer />
      {loading && <Loader/>}
      <RouterProvider router={router} />
    </>
  );
};

export default App;
