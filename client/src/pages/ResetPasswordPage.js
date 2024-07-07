import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const getQueryParams = () => {
        return new URLSearchParams(location.search);
    };

    const handleResetPassword = async () => {
        try {
            if (!password || !confirmPassword) {
                setError('Proszę wpisać wszystkie wymagane pola.');
                return;
            }

            if (password !== confirmPassword) {
                setError('Hasła nie pasują do siebie.');
                return;
            }

            if (password.length < 8 || !/\d/.test(password) || !/[!@#$%^&*]/.test(password)) {
                setError("Hasło musi mieć co najmniej 8 znaków i zawierać cyfry oraz znaki specjalne.");
                return;
            }

            let queryParams = getQueryParams();
            const token = queryParams.get('token');

            if (!token) {
                setError('Brak tokenu uwierzytelniającego. Upewnij się, że używasz prawidłowego łącza do resetowania hasła.');
                return;
            }

            const response = await axios.post('http://localhost:8080/auth/resetPassword', null, {
                params: {
                    token: token,
                    newPassword: password
                }
            });

            console.log('Password reset successful:', response.data);
            setMessage('Twoje hasło zostało pomyślnie zresetowane.');
        } catch (error) {
            console.error('Password reset failed:', error.response ? error.response.data : error.message);
            setError('Nie udało się zresetować hasła. Token może być nieprawidłowy lub wygasł.');
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Card style={{ width: '22rem' }}>
                <Card.Body>
                    <Card.Title className="text-center mb-4">Zresetuj hasło</Card.Title>
                    {message && <Alert variant="success">{message}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form>
                        <Form.Group className="mb-3" controlId="newPassword">
                            <Form.Label>Nowe hasło</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="confirmPassword">
                            <Form.Label>Potwierdź nowe hasło</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="button" onClick={handleResetPassword} className="w-100 mb-2">
                            Zresetuj hasło
                        </Button>
                        <Button variant="secondary" type="button" onClick={handleBackToLogin} className="w-100">
                            Powrót do logowania
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default ResetPasswordPage;