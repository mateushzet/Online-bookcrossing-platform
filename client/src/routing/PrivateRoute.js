import React from 'react';
import { Navigate } from 'react-router-dom';
import isAdminRole from "../utils/IsAdminRole";
import isUserRole from "../utils/IsUserRole";

const PrivateRoute = ({ children, isAdminRoute }) => {
    const isAdmin = isAdminRole();
    const isUser = isUserRole();

    if (isAdminRoute) {
        if (isAdmin) {
            return children;
        } else if (isUser) {
            return <Navigate to="/" />;
        } else {
            return <Navigate to="/login" />;
        }
    } else {
        if (isAdmin || isUser) {
            return children;
        } else {
            return <Navigate to="/login" />;
        }
    }
};

export default PrivateRoute;