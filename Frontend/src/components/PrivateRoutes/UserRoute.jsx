import React from 'react'

// Import the useSelector hook from react-redux to access the Redux store's state
import { useSelector } from 'react-redux';

// Import the Navigate and Outlet components for navigation and nested routing
import { Navigate, Outlet } from 'react-router-dom';

const UserRoute = () => {
    
    // Destructuring the currentUser from user slice
    const { currentUser } = useSelector((state) => state.user);
    
    return currentUser ? <Outlet/> : <Navigate to='/auth'/>
}

export default UserRoute

