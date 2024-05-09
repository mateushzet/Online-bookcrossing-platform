import React from 'react';
import { Card, Container, Button } from 'react-bootstrap';

function Home() {
    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
            <Card className="shadow" style={{ width: '600px', border: 'none', borderRadius: '0.75rem', overflow: 'hidden' }}>
                <Card.Body className="d-flex flex-column align-items-center p-4">
                    <Card.Title as="h1" className="text-primary mb-3">Welcome to Online Book Crossing</Card.Title>
                    <Card.Img variant="top" src="https://source.unsplash.com/random/300x200?books" alt="Books" className="mb-3"/>
                    <Card.Text as="h2" className="text-secondary mb-2">A New Way to Exchange Books</Card.Text>
                    <Card.Text as="p" className="mb-2">
                        Discover new stories and share your own with our book exchange community. Whether you're looking to find new adventures, learn something new, or just make some space on your shelves, you've come to the right place.
                    </Card.Text>
                    <Card.Text as="p" className="mb-3">
                        Get started by browsing available exchanges or add your own books to swap with fellow readers.
                    </Card.Text>
                    <Button variant="primary" href="/exchangeOffers">Browse Exchanges</Button>
                    <Button variant="outline-primary" href="/bookExchange" className="mt-2">Create Exchange Offer</Button>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Home;