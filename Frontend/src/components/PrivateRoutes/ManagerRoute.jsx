import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ManagerRoute = () => {
    const { currentUser } = useSelector((state) => state.user);
    return currentUser.data.role === 'manager' ? <Outlet/> : <Navigate to='/auth'/>
}

export default ManagerRoute;

