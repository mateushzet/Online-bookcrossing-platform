import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import { Container } from 'react-bootstrap';

const Layout = ({ children }) => {
    return (
        <>
            <NavBar />
            <Container style={{ padding: '20px 0' }}>
                {children}
            </Container>
            <Footer />
        </>
    );
};

export default Layout;