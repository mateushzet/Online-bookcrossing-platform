import React, { useEffect, useState } from 'react';
import { Modal, ListGroup, Form, Button, Alert } from 'react-bootstrap';
import { Rating } from '@mui/material';
import axios from 'axios';

function UserProfileModal({ userId, show, onHide }) {
    const [user, setUser] = useState({ username: '', email: '', phone: '', emailNotifications: false });
    const [statusMessage, setStatusMessage] = useState('');
    const [rating, setRating] = useState(0);
    const [ratingValue, setRatingValue] = useState(0);

    useEffect(() => {
        if (show && userId) {
            const fetchData = async () => {
                try {
                    const userResponse = await axios.get(`http://localhost:8080/api/user/getUserById`, { params: { userId } });
                    setUser(userResponse.data);

                    const ratingResponse = await axios.get(`http://localhost:8080/api/user/getUserRatingById`, { params: { userId } });
                    const averageRating = ratingResponse.data;
                    const roundedRating = Math.round(averageRating * 2) / 2;

                    setRating(roundedRating);
                    setRatingValue(averageRating);
                } catch (error) {
                    console.error("Failed to fetch user:", error);
                    setStatusMessage('Error fetching user data.');
                }
            };

            fetchData();
        }
    }, [show, userId]);

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Dane użytkownika</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup>
                    <ListGroup.Item>Nazwa: {user.username}</ListGroup.Item>
                    <ListGroup.Item>
                        Ocena profilu:
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Rating name="read-only" value={rating} precision={0.1} readOnly />
                            <span style={{ marginLeft: '10px' }}>{ratingValue.toFixed(2)}</span>
                        </div>
                    </ListGroup.Item>
                </ListGroup>
                {statusMessage && <Alert variant="danger">{statusMessage}</Alert>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Zamknij</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UserProfileModal;