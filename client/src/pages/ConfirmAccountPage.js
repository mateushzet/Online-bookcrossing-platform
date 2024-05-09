import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Alert, Button } from 'react-bootstrap';

function ConfirmAccount() {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get('token');

        if (!token) {
            setError('No token provided.');
            setLoading(false);
            return;
        }

        axios.post('http://localhost:8080/auth/confirmAccount', null, {
            params: { token }
        })
            .then(response => {
                setMessage('Account has been confirmed.');
                setLoading(false);
            })
            .catch(error => {
                setError(error.response ? error.response.data : 'Token invalid or expired.');
                setLoading(false);
            });
    }, [navigate]);

    return (
        <Container className="d-flex flex-column align-items-center" style={{ minHeight: "100vh", justifyContent: "center" }}>
            {loading ? (
                <Alert variant="info">Waiting for account confirmation...</Alert>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <Alert variant="success">{message}</Alert>
            )}
            <Button onClick={() => navigate('/login')} className="mt-3">Go to Login</Button>
        </Container>
    );
}

export default ConfirmAccount;