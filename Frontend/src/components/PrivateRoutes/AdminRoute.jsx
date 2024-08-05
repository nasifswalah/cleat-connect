import React from 'react'

// Import the useSelector hook from react-redux to access the Redux store's state
import { useSelector } from 'react-redux'

// Import the Navigate and Outlet components for navigation and nested routing
import { Outlet, Navigate } from 'react-router-dom'

const AdminRoute = () => {

  // Destructuring the currentUser from user slice
  const { currentUser } = useSelector((state) => state.user);
  return currentUser.data.role === 'admin' ? <Outlet/> : <Navigate to='/homepage'/>
}

export default AdminRoute
