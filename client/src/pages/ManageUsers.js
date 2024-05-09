import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button, Pagination, Form, Alert } from 'react-bootstrap';

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
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const handleFieldChange = (userId, field, value) => {
        setUsers(users.map(user => user.userId === userId ? { ...user, [field]: value } : user));
    };

    const modifyUser = (user) => {
        console.log('Modifying user:', user);
        axios.put('http://localhost:8080/api/admin/modifyUser', user)
            .then(response => {
                console.log(response.data);
                setStatusMessage('User has been modified successfully.');
            })
            .catch(error => {
                console.error('Error modifying user:', error);
                setStatusMessage('An error occurred while modifying the user.');
            });
    };

    const deleteUser = (userId) => {
        axios.delete('http://localhost:8080/api/admin/deleteUser', { params: { userId } })
            .then(response => {
                console.log(response.data);
                setUsers(users.filter(user => user.userId !== userId));
                setStatusMessage('User has been deleted successfully.');
            })
            .catch(error => {
                console.error("Failed to delete user:", error);
                setStatusMessage('An error occurred while deleting the user.');
            });
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => prev < Math.ceil(users.length / usersPerPage) ? prev + 1 : prev);
    const prevPage = () => setCurrentPage(prev => prev > 1 ? prev - 1 : prev);

    const renderPaginationItems = (currentPage, totalPages) => {
        let items = [];
        let startPage, endPage;

        if (totalPages <= 5) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 3) {
                startPage = 1;
                endPage = 5;
            } else if (currentPage + 2 >= totalPages) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }
        }

        if (startPage > 1) {
            items.push(<Pagination.First key="first" onClick={() => paginate(1)} />);
            items.push(<Pagination.Ellipsis key="ellipsis-1" />);
        }

        for (let number = startPage; number <= endPage; number++) {
            items.push(
                <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
                    {number}
                </Pagination.Item>,
            );
        }

        if (endPage < totalPages) {
            items.push(<Pagination.Ellipsis key="ellipsis-2" />);
            items.push(<Pagination.Last key="last" onClick={() => paginate(totalPages)} />);
        }

        return items;
    };

    const paginationItems = renderPaginationItems(currentPage, Math.ceil(users.length / usersPerPage));

    return (
        <Container className="my-4">
            <h2 className="text-center mb-4">Manage Users</h2>
            {statusMessage && <Alert variant="info">{statusMessage}</Alert>}
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <Table striped bordered hover className="shadow">
                        <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentUsers.map((user) => (
                            <tr key={user.userId}>
                                <td>
                                    <Form.Control
                                        type="text"
                                        value={user.username}
                                        onChange={(e) => handleFieldChange(user.userId, 'username', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <Form.Control
                                        type="email"
                                        value={user.email}
                                        onChange={(e) => handleFieldChange(user.userId, 'email', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <Form.Select
                                        value={user.role}
                                        onChange={(e) => handleFieldChange(user.userId, 'role', e.target.value)}
                                    >
                                        <option value="ROLE_USER">User</option>
                                        <option value="ROLE_ADMIN">Admin</option>
                                    </Form.Select>
                                </td>
                                <td>
                                    <Button variant="primary" size="sm" className="me-2" onClick={() => modifyUser(user)}>Modify</Button>
                                    <Button variant="danger" size="sm" onClick={() => deleteUser(user.userId)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    <Pagination className="justify-content-center">
                        <Pagination.Prev onClick={prevPage} disabled={currentPage === 1} />
                        {paginationItems}
                        <Pagination.Next onClick={nextPage} disabled={currentPage === Math.ceil(users.length / usersPerPage)} />
                    </Pagination>
                </>
            )}
        </Container>
    );
}

export default ManageUsers;