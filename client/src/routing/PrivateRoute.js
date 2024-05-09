import React from 'react';
import { Navigate } from 'react-router-dom';
import isAdminRole from "../utils/IsAdminRole";
import isUserRole from "../utils/IsUserRole";


const PrivateRoute = ({ children, isAdminRoute }) => {

    if (isAdminRoute) {
        return isAdminRole() ? children : (isUserRole() ? <Navigate to="/"/> : <Navigate to="/login"/>);
    } else {
        return isUserRole() || isAdminRole() ? children : <Navigate to="/login"/>;
    }

};

export default PrivateRoute;