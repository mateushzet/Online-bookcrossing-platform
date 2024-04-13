// NavBar.js
import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import isAdminRole from "../../utils/IsAdminRole";

const NavBar = () => {
    const history = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        history('/login');
    };

    return (
        <nav>
            <ul className="nav">
                {/* Linki można dostosować do potrzeb aplikacji */}
                <li className="nav-item"><Link to="/">Home</Link></li>
                <li className="nav-item"><Link to="/settings">Settings</Link></li>
                <li className="nav-item"><Link to="/profile">Profile</Link></li>
                {isAdminRole() && (
                    <li className="nav-item"><Link to="/adminPage">Admin Panel</Link></li>
                )}
            </ul>
            <div className="logout-container">
                <button type="button" className="btn btn-primary mt-3" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
};

export default NavBar;