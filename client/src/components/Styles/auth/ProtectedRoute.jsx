import React from 'react'

import { Navigate, Outlet, redirect } from 'react-router-dom'

const ProtectedRoute = ({children,user,redirectPath="/login"}) => {
 

    if(!user) return <Navigate to={redirectPath}/>;

    return children ? children :<Outlet/> ;
    
  
}


export const AdminProtectedRoute = ({children,isAdmin,redirectPath="/admin/login"}) => {

 

    if(!isAdmin) return <Navigate to={redirectPath}/>;

    return children ? children :<Outlet/> ;
    
  
}


export default ProtectedRoute