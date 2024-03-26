import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <nav>
            <ul className="nav">
                {/* Linki można dostosować do potrzeb aplikacji */}
                <li className="nav-item"><Link to="/dashboard">Dashboard</Link></li>
                <li className="nav-item"><Link to="/settings">Settings</Link></li>
                <li className="nav-item"><Link to="/profile">Profile</Link></li>
            </ul>
        </nav>
    );
};

export default NavBar;