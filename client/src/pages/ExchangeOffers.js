import React, { useState, useEffect } from 'react';
import { Card, Container } from 'react-bootstrap';
import axios from 'axios';

function ExchangeOffers() {
    const [offers, setOffers] = useState([]);


    useEffect(() => {
        axios.get(`http://localhost:8080/api/user/fetchExchanges`)
            .then(response => {
                setOffers(response.data);
            })
            .catch(error => console.error('Error fetching offers:', error));
    }, []);

    return (
        <Container className="d-flex flex-wrap justify-content-center align-items-center" style={{ minHeight: "80vh", backgroundColor: "#eef2f7" }}>
            {offers.map((offer, index) => (
                <Card key={index} className="shadow m-3" style={{ width: '300px', border: 'none', borderRadius: '0.75rem', overflow: 'hidden' }}>
                    <Card.Body className="d-flex flex-column align-items-center p-4">
                        <Card.Title as="h5">{offer.title}</Card.Title>
                        <Card.Text as="h6">{offer.author}</Card.Text>
                        <Card.Text>{offer.genre}</Card.Text>
                        <div className="mb-3">
                            <strong>Stan książki:</strong> {offer.bookCondition}
                        </div>
                        <div className="mb-3">
                            <strong>Preferowane książki:</strong> {offer.exchangeDescription}
                        </div>
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
}

export default ExchangeOffers;