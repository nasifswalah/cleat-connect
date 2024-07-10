import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AuthPage from './pages/AuthPage/AuthPage.jsx'
import LandingPage from './pages/LandingPage/LandingPage.jsx'
import HomePage from './pages/HomePage/HomePage.jsx'
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import Profile from './pages/ProfilePage/Profile.jsx'
import CourtDetails from './pages/CourtDetailsPage/CourtDetails.jsx'
import TurfCreation from './pages/TurfCreationPage/TurfCreation .jsx'
import TurfUpdation from './pages/TurfUpdationPage/TurfUpdation.jsx'
import CreateUser from './pages/AddUserPage/CreateUser.jsx'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchDisplay from './pages/SearchDisplay/SearchDisplay.jsx'
import AboutPage from './pages/AboutPage/AboutPage.jsx'
import AdminRoute from './components/PrivateRoutes/AdminRoute.jsx'
import UserRoute from './components/PrivateRoutes/UserRoute.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage/>
  },
  {
    path: '/auth',
      element: <AuthPage/>
  },
  {
    path: '/homepage',
    element: <HomePage/>
  },
  {
    element: <AdminRoute/>,
    children:[
      {
        path: '/create-new-turf',
        element: <TurfCreation/>
      },  
      {
        path: '/create-new-user',
        element: <CreateUser/>
      },
      {
        path: '/update-turf/:turfId',
        element: <TurfUpdation/>
      },
    ]
  },
  {
    element: <UserRoute/>,
    children:[
      {
        path: '/profile',
        element: <Profile/>
      },
      {
        path: '/turf-details/:turfId',
        element: <CourtDetails/>
      },
    ]
  },
  {
    path: '/search-display',
    element: <SearchDisplay/>
  },
  {
    path: '/aboutUs',
    element: <AboutPage/>
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <ToastContainer/>
    <RouterProvider router={router} />
    </PersistGate>
  </Provider>,
)
