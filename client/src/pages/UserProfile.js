import React, { useEffect, useState } from 'react';
import { Container, Card, Button, ListGroup, Form, Alert, Modal } from 'react-bootstrap';
import { Rating } from '@mui/material';
import axios from "axios";
import UserProfileAvatarComponent from '../components/UserProfileAvatarComponent';

function UserProfile({ show, onHide }) {
    const [user, setUser] = useState({ username: '', email: '', phone: '', emailNotifications: false });
    const [editMode, setEditMode] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [validationError, setValidationError] = useState('');
    const [rating, setRating] = useState(0);
    const [ratingValue, setRatingValue] = useState(0);
    const [avatarUpdated, setAvatarUpdated] = useState(false); // To force avatar reload

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get('http://localhost:8080/api/user/getUser');
                setUser(userResponse.data);

                const ratingResponse = await axios.get('http://localhost:8080/api/user/getUserRating');
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
    }, []);

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setUser(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (name === 'phone') setValidationError('');
    };

    const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
        return phoneRegex.test(phoneNumber);
    };

    const handleSave = async () => {
        if (user.phone && !validatePhoneNumber(user.phone)) {
            setValidationError('Invalid phone number format.');
            return;
        }

        try {
            const response = await axios.put('http://localhost:8080/api/user/modifyUserDetails', user);
            setStatusMessage('Profile updated successfully.');
            setEditMode(false);
        } catch (error) {
            console.error("Failed to update user profile:", error);
            setStatusMessage('Error updating profile.');
        }
    };

    const handleAvatarChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('userId', user.userId);
            formData.append('file', file);

            try {
                await axios.post('http://localhost:8080/api/user/uploadAvatar', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setAvatarUpdated(true);
                setStatusMessage('Avatar updated successfully.');
            } catch (error) {
                console.error('Error uploading avatar:', error);
                setStatusMessage('Failed to update avatar.');
            }
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Profile Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="text-center mb-3">
                    <UserProfileAvatarComponent userId={user.userId} key={avatarUpdated} />
                    {editMode && (
                        <Form.Group>
                            <Form.Label>Change Avatar</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={handleAvatarChange} />
                        </Form.Group>
                    )}
                </div>
                <ListGroup>
                    <ListGroup.Item>Username: {user.username}</ListGroup.Item>
                    <ListGroup.Item>
                        Email: {editMode ? (
                        <Form.Control
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleInputChange}
                            required
                        />
                    ) : user.email}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        Phone: {editMode ? (
                        <Form.Control
                            type="tel"
                            name="phone"
                            placeholder="Add number"
                            value={user.phone}
                            onChange={handleInputChange}
                        />
                    ) : (user.phone || 'Add number')}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        Wysyłanie powiadomień email: {editMode ? (
                        <Form.Check
                            type="checkbox"
                            name="emailNotifications"
                            checked={user.emailNotifications}
                            onChange={handleInputChange}
                        />
                    ) : (user.emailNotifications ? 'Tak' : 'Nie')}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        Ocena profilu:
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Rating name="read-only" value={rating} precision={0.1} readOnly />
                            <span style={{ marginLeft: '10px' }}>{ratingValue.toFixed(2)}</span>
                        </div>
                    </ListGroup.Item>
                </ListGroup>
                {validationError && <Alert variant="danger">{validationError}</Alert>}
                {statusMessage && <Alert variant="success">{statusMessage}</Alert>}
            </Modal.Body>
            <Modal.Footer>
                {editMode ? (
                    <>
                        <Button variant="primary" onClick={handleSave}>Save</Button>
                        <Button variant="secondary" onClick={() => setEditMode(false)}>Cancel</Button>
                    </>
                ) : (
                    <Button variant="secondary" onClick={() => setEditMode(true)}>Edit</Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}

export default UserProfile;
