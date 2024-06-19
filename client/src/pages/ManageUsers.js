import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  margin: auto;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  color: black;
  max-width: 1200px;
`;

const Header = styled.div`
  background-color: #627254;
  height: 10%;
  color: #fff;
  padding: 1rem;
  border-radius: 1rem 1rem 0 0;
  text-align: center;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  height: 80%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 0;

  thead {
    background-color: #627254;
    color: white;
  }

  th, td {
    padding: 1rem;
    border: 1px solid #dee2e6;
  }

  tbody tr:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10%;
`;

const PaginationButton = styled.button`
  background: ${({ active }) => (active ? '#627254' : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#627254')};
  border: 1px solid #627254;
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  &:hover:enabled {
    background-color: #41542b;
    color: #fff;
  }
`;

const Alert = styled.div`
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: #d1ecf1;
  color: #0c5460;
  border-color: #bee5eb;
`;

const Spinner = styled.div`
  display: inline-block;
  width: 80px;
  height: 80px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Button = styled.button`
  background: ${({ variant }) => (
      variant === 'outline-primary' ? '#007bff' : 
      variant === 'outline-danger' ? '#dc3545' :
      variant === 'outline-warning' ? '#ffc107' :
      '#6c757d')};
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  margin-right: 10px;
  cursor: pointer;
  &:hover {
    background: ${({ variant }) => (variant === 'outline-primary' ? '#0056b3' :
    variant === 'outline-danger' ? '#c82333' :
    variant === 'outline-warning' ? '#ffc107' :
    '#5a6268')};
  }
`;

const FormControl = styled.input`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('http://localhost:8080/api/admin/usersTable');
                setUsers(response.data);
                setStatusMessage('');
            } catch (error) {
                console.error("Failed to fetch users:", error);
                setStatusMessage('Błąd pobierania użytkowników.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleFieldChange = (userId, field, value) => {
        setUsers(users.map(user => user.userId === userId ? { ...user, [field]: value } : user));
    };

    const modifyUser = (user) => {
        axios.put('http://localhost:8080/api/admin/modifyUser', user)
            .then(response => {
                setStatusMessage('User has been modified successfully.');
                setUsers(prev => prev.map(u => u.userId === user.userId ? {...u, ...response.data} : u));
            })
            .catch(error => {
                console.error('Error modifying user:', error);
                setStatusMessage('An error occurred while modifying the user.');
            });
    };

    const deleteUser = (userId) => {
        axios.delete('http://localhost:8080/api/admin/deleteUser', { params: { userId } })
            .then(() => {
                setUsers(users.filter(user => user.userId !== userId));
                setStatusMessage('User has been deleted successfully.');
            })
            .catch(error => {
                console.error("Failed to delete user:", error);
                setStatusMessage('An error occurred while deleting the user.');
            });
    };

    const banUser = (userId) => {
        axios.delete('http://localhost:8080/api/admin/banUser', { params: { userId } })
            .then(() => {
                setUsers(users.map(user => user.userId === userId ? { ...user, active: false } : user));
                setStatusMessage('Użytkownik został zablokowany.');
            })
            .catch(error => {
                console.error("Failed to ban user:", error);
                setStatusMessage('Błąd podczas blokowania użytkownika.');
            });
    };

    const unbanUser = (userId) => {
        axios.delete('http://localhost:8080/api/admin/unbanUser', { params: { userId } })
            .then(() => {
                setUsers(users.map(user => user.userId === userId ? { ...user, active: true } : user));
                setStatusMessage('Użytkownik został odblokowany.');
            })
            .catch(error => {
                console.error("Failed to unban user:", error);
                setStatusMessage('Błąd podczas odblokowywania użytkownika.');
            });
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => prev < Math.ceil(users.length / usersPerPage) ? prev + 1 : prev);
    const prevPage = () => setCurrentPage(prev => prev > 1 ? prev - 1 : prev);

    const renderPaginationItems = (currentPage, totalPages) => {
        let items = [];
        const pageLimit = 5;
        let startPage = currentPage - Math.floor(pageLimit / 2);
        let endPage = currentPage + Math.floor(pageLimit / 2);

        if (startPage < 1) {
            startPage = 1;
            endPage = Math.min(pageLimit, totalPages);
        }

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, totalPages - pageLimit + 1);
        }

        for (let number = startPage; number <= endPage; number++) {
            items.push(
                <PaginationButton key={number} active={number === currentPage} onClick={() => paginate(number)}>
                    {number}
                </PaginationButton>,
            );
        }

        return items;
    };

    const paginationItems = renderPaginationItems(currentPage, Math.ceil(users.length / usersPerPage));

    return (
        <Container>
            <Header>
                <HeaderTitle>Zarządzanie użytkownikami</HeaderTitle>
            </Header>
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Spinner />
                </div>
            ) : (
                <>
                    <TableContainer>
                        <Table>
                            <thead>
                            <tr>
                                <th>Login</th>
                                <th>Email</th>
                                <th>Rola</th>
                                <th>Akcje</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.slice((currentPage-1) * usersPerPage, currentPage * usersPerPage).map((user) => (
                                <tr key={user.userId}>
                                    <td>
                                        <FormControl
                                            type="text"
                                            value={user.username}
                                            onChange={(e) => handleFieldChange(user.userId, 'username', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <FormControl
                                            type="email"
                                            value={user.email}
                                            onChange={(e) => handleFieldChange(user.userId, 'email', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <Select
                                            value={user.role}
                                            onChange={(e) => handleFieldChange(user.userId, 'role', e.target.value)}
                                        >
                                            <option value="ROLE_USER">Użytkownik</option>
                                            <option value="ROLE_ADMIN">Admin</option>
                                        </Select>
                                    </td>
                                    <td>
                                        <Button variant="outline-primary" onClick={() => modifyUser(user)}>Modyfikuj</Button>
                                        <Button variant="outline-danger" onClick={() => deleteUser(user.userId)}>Usuń</Button>
                                        {user.active ? (
                                        <Button variant="outline-danger" onClick={() => banUser(user.userId)}>Zablokuj</Button>
                                        ) : (
                                        <Button variant="outline-warning" onClick={() => unbanUser(user.userId)}>Odblokuj</Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                        {statusMessage && <Alert>{statusMessage}</Alert>}
                    </TableContainer>
                    <PaginationContainer>
                        <PaginationButton onClick={prevPage} disabled={currentPage === 1}>Poprzednia</PaginationButton>
                        {paginationItems}
                        <PaginationButton onClick={nextPage} disabled={currentPage === Math.ceil(users.length / usersPerPage)}>Następna</PaginationButton>
                    </PaginationContainer>
                </>
            )}
        </Container>
    );
}

export default ManageUsers;