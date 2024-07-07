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
            setError('Wypełnij wszystkie pola.');
            return;
        }

        if (!validateUsername(username)) {
            setError('Nazwa użytkownika musi mieć od 3 do 20 znaków i może zawierać tylko znaki alfanumeryczne, myślniki i podkreślenia.');
            return;
        }

        if (!validateEmail(email)) {
            setError('Wprowadź poprawny adres e-mail.');
            return;
        }

        if (password !== confirmPassword) {
            setError("Hasła nie pasują do siebie.");
            return;
        }

        if (password.length < 8 || !/\d/.test(password) || !/[!@#$%^&*]/.test(password)) {
            setError("Hasło musi mieć co najmniej 8 znaków i zawierać cyfry oraz znaki specjalne.");
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
            setIsRegistered(true);
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
                        <Alert variant="success">Potwierdź swoją rejestrację klikając w link wysłany na Twój adres e-mail</Alert>
                    ) : (
                        <>
                            <Card.Title className="text-center mb-4">Zarejestruj</Card.Title>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form>
                                <Form.Group className="mb-3" controlId="username">
                                    <Form.Label>Nazwa użytkownika</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Wprowadź nazwę użytkownika"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label>Adres email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Wprowadź adres email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Label>Hasło</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Hasło"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="confirmPassword">
                                    <Form.Label>Potwierdź hasło</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Potwierdź hasło"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </Form.Group>
                                <Button variant="primary" onClick={handleSignup} className="w-100">
                                    Zarejestruj
                                </Button>
                            </Form>
                        </>
                    )}
                    <div className="text-center mt-3">
                        <p>Posiadasz już konto? <a href="/login">Zaloguj</a></p>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default SignUpPage;