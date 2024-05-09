import React from 'react';
import { Card, Container } from 'react-bootstrap';

function AddBook() {
    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh", backgroundColor: "#eef2f7" }}>
            <Card className="shadow" style={{ width: '500px', border: 'none', borderRadius: '0.75rem', overflow: 'hidden' }}>
                <Card.Body className="d-flex flex-column align-items-center p-5">
                    <Card.Title as="h1" className="text-primary mb-4">Welcome Home</Card.Title>
                    <Card.Text as="h2" className="text-secondary mb-3">Hello! You are logged in successfully.</Card.Text>
                    <Card.Text as="p" className="text-accent">Enjoy exploring the app!</Card.Text>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default AddBook;