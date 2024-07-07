import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  overflow: hidden;
`;

const CardHeader = styled.div`
  background-color: #627254;
  color: #fff;
  text-align: center;
  padding: 20px;
`;

const CardBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.button`
  width: 75%;
  margin: 15px 0;
  padding: 10px 20px;
  font-size: 1.25rem;
  color: #fff;
  background-color: #6c757d;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5a6268;
  }
`;

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
        <Container>
            <Card>
                <CardHeader>
                    <h2>Admin Panel</h2>
                </CardHeader>
                <CardBody>
                    <Button onClick={handleManageUsers}>
                        Zarządzanie użytkownikami
                    </Button>
                    <Button onClick={handleManageBooks}>
                        Zarządzanie książkami
                    </Button>
                </CardBody>
            </Card>
        </Container>
    );
}

export default AdminPage;