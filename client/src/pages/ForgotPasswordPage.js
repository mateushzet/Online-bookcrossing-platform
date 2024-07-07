import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const handleForgotPassword = async () => {
        try {
            if (!email) {
                setError('Please enter your email address.');
                return;
            }
            const response = await axios.post('http://localhost:8080/auth/forgotPassword', null, { params: { email } });
            console.log('Password reset email sent:', response.data);
            setMessage('An email with a password reset link has been sent to your email address.');
        } catch (error) {
            console.error('Password reset failed:', error.response ? error.response.data : error.message);
            setError('Failed to send password reset email. Please try again.');
        }
    };
    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Card style={{ width: '22rem' }}>
                <Card.Body>
                    <Card.Title className="text-center mb-4">Resetowanie hasła</Card.Title>
                    {message && <Alert variant="success">{message}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Adres e-mail</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Wprowadź e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="button" onClick={handleForgotPassword} className="w-100">
                            Wyślij link resetujący
                        </Button>
                    </Form>
                    <div className="mt-3 text-center">
                        <p>Pamiętasz swoje hasło? <a href="/login">Zaloguj sie</a></p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}
export default ForgotPassword;
 