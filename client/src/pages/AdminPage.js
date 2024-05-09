import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Card } from 'react-bootstrap';

function AdminPage() {
    const navigate = useNavigate();

    const handleManageUsers = () => {
        navigate('/manageUsers');
    };

    const handleManageBooks = () => {
        navigate('/manageBooks');
    };

    const handleSettings = () => {
        navigate('/settings');
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <Card className="shadow-lg p-5" style={{ minWidth: '400px' }}>
                <Card.Header className="bg-primary text-white text-center">
                    <h2>Admin Panel</h2>
                </Card.Header>
                <Card.Body className="d-flex flex-column align-items-stretch">
                    <Button variant="info" className="my-2" onClick={handleManageUsers}>Manage Users</Button>
                    <Button variant="warning" className="my-2" onClick={handleManageBooks}>Manage Books</Button>
                    <Button variant="secondary" className="my-2" onClick={handleSettings}>Settings</Button>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default AdminPage;