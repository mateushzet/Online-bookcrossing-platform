import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import isAdminRole from "../utils/IsAdminRole";
import logoImage from '../assets/icons/logo192.png';

const NavBar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <Navbar bg="primary" variant="dark" expand="lg" className="navbar-custom">
            <Navbar.Brand href="/">
                <img
                    src={logoImage}
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                    alt="Logo"
                />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="/exchangeOffers">Dostępne wymiany</Nav.Link>
                    <Nav.Link as={Link} to="/bookExchange">Utwórz wymianę</Nav.Link>
                    <Nav.Link as={Link} to="/books">Books</Nav.Link>
                    {isAdminRole() && (
                        <Nav.Link as={Link} to="/adminPage">Admin Panel</Nav.Link>
                    )}
                </Nav>
                <Nav className="ml-auto">
                    <Nav.Link as={Link} to="/userProfile">My Profile</Nav.Link>
                    <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavBar;