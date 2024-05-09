import React, { useEffect, useState } from 'react';
import { Container, Card, Button, ListGroup, Form, Alert } from 'react-bootstrap';
import logoImage from '../assets/icons/logo192.png';
import axios from "axios";

function UserProfile() {
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
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <Card className="my-5 shadow-lg" style={{ width: '18rem' }}>
                <Card.Img variant="top" src={logoImage} alt="User Image" />
                <Card.Body>
                    <Card.Title>Profile Details</Card.Title>
                    {statusMessage && <Alert variant="info">{statusMessage}</Alert>}
                    {validationError && <Alert variant="danger">{validationError}</Alert>}
                </Card.Body>
                <ListGroup className="list-group-flush">
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
                <Card.Body>
                    {editMode ? (
                        <>
                            <Button variant="primary" onClick={handleSave}>Save</Button>
                            <Button variant="secondary" onClick={() => setEditMode(false)} className="ml-2">Cancel</Button>
                        </>
                    ) : (
                        <Button variant="secondary" onClick={() => setEditMode(true)}>Edit</Button>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default UserProfile;