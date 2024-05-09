import React, { useEffect, useState } from 'react';
import { Container, Card, Button, ListGroup, Form, Alert, Modal } from 'react-bootstrap';
import profileImage from '../assets/icons/user-profile.png';
import axios from "axios";

function UserProfile({ show, onHide }) {  // Ensure show and onHide are included in the component's parameters
    const [user, setUser] = useState({ username: '', email: '', phone: '', emailNotifications: false });
    const [editMode, setEditMode] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/user/getUser');
                setUser(response.data);
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

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Profile Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="text-center mb-3">
                    <img src={profileImage} alt="User" style={{ width: '100px' }} />
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
                </ListGroup>
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