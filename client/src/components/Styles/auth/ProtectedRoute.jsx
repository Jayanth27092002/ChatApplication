import React from 'react'
import { Navigate, Outlet, redirect } from 'react-router-dom'

const ProtectedRoute = ({children,user,redirectPath="/login"}) => {
 

    if(!user) return <Navigate to={redirectPath}/>;

    return children ? children :<Outlet/> ;
    
  
}

export default ProtectedRoute