import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

const AdminRoute = () => {
    const { currentUser } = useSelector((state) => state.user);
  return currentUser.data.role === 'admin' ? <Outlet/> : <Navigate to='/homepage'/>
}

export default AdminRoute
