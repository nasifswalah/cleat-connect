import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const UserRoute = () => {
    const { currentUser } = useSelector((state) => state.user);
    return currentUser ? <Outlet/> : <Navigate to='/auth'/>
}

export default UserRoute

