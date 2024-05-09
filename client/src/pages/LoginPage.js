import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];

    const handleLogin = async () => {
        try {
            if (!username || !password) {
                setError('Please enter both username and password.');
                return;
            }

            const response = await axios.post('http://localhost:8080/auth/signin', { username, password });

            console.log('Login successful:', response.data);
            localStorage.setItem('token', response.data.jwt);
            if (response.data.jwt) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.jwt}`;
            }
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 401) {
                setError('Account is not active. Please check your email box.');
            } else {
                setError('Invalid username or password.');
            }
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Card style={{ width: '22rem' }}>
                <Card.Body>
                    <Card.Title className="text-center mb-4">Login</Card.Title>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
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
                        <Button variant="primary" type="button" onClick={handleLogin} className="w-100">
                            Sign In
                        </Button>
                    </Form>
                    <div className="mt-3 text-center">
                        <p>Not a member? <a href="/signup">Register now</a></p>
                    </div>
                    <div className="mt-3 text-center">
                        <p>Forgot password? <a href="/forgotPassword">Reset password</a></p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default LoginPage;