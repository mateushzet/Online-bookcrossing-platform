import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';

function SignUpPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);

    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];

    const handleSignup = async () => {
        if (!username || !email || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }

        if (!validateUsername(username)) {
            setError('Username must be 3-20 characters long and can only contain alphanumeric characters, dashes, or underscores.');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please provide a valid email address.');
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 8 || !/\d/.test(password) || !/[!@#$%^&*]/.test(password)) {
            setError("Password must be at least 8 characters long and include numbers and special characters.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/auth/signup', {
                username,
                email,
                password,
            });

            localStorage.setItem('token', response.data.jwt);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.jwt}`;
            setIsRegistered(true);  // Set registered to true to hide form and show message
        } catch (error) {
            console.error('Signup failed:', error.response ? error.response.data : error.message);
            setError(error.response.data);
        }
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    };

    const validateUsername = (username) => {
        const re = /^[a-zA-Z0-9_-]{3,20}$/;
        return re.test(username);
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Card style={{ width: '22rem' }}>
                <Card.Body>
                    {isRegistered ? (
                        <Alert variant="success">Confirm registration on your email.</Alert>
                    ) : (
                        <>
                            <Card.Title className="text-center mb-4">Sign Up</Card.Title>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form>
                                <Form.Group className="mb-3" controlId="username">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="confirmPassword">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </Form.Group>
                                <Button variant="primary" onClick={handleSignup} className="w-100">
                                    Sign Up
                                </Button>
                            </Form>
                        </>
                    )}
                    <div className="text-center mt-3">
                        <p>Already registered? <a href="/login">Login</a></p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default SignUpPage;