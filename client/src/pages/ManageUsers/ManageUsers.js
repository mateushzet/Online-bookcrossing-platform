import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(6); // Ustawienie liczby użytkowników na stronę
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

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

    const updateUserField = (userId, field, value) => {
        setUsers(users.map(user => {
            if (user.userId === userId) {
                return { ...user, [field]: value };
            }
            return user;
        }));
    };

    const modifyUser = (user) => {
        console.log('Modifying user:', user);
        axios.put('http://localhost:8080/api/admin/modifyUser', user)
            .then(response => {
                console.log(response.data);
                setUsers(users);
            })
            .catch(error => {
                console.error('Error modifying user:', error);
            });
    };

    const deleteUser = (userId) => {
        axios.delete('http://localhost:8080/api/admin/deleteUser', { params: { userId } })
            .then(response => {
                console.log(response.data);
                setUsers(users.filter(user => user.userId !== userId));
            })
            .catch(error => {
                console.error("Failed to delete user:", error);
            });
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => prev < Math.ceil(users.length / usersPerPage) ? prev + 1 : prev);
    const prevPage = () => setCurrentPage(prev => prev > 1 ? prev - 1 : 1);

    // Funkcja renderująca przyciski paginacji z wykropkowaniem
    const renderPageNumbers = (totalPages) => {
        const pageNumbers = [];
        let items = [];
        let leftSide = currentPage - 2;
        if (leftSide <= 2) leftSide = 1;
        let rightSide = currentPage + 2;
        if (rightSide >= totalPages - 1) rightSide = totalPages;

        for (let number = leftSide; number <= rightSide; number++) {
            pageNumbers.push(number);
        }

        if (leftSide > 1) {
            items.push(<button key="1" onClick={() => paginate(1)}>1</button>);
            if (leftSide > 2) {
                items.push(<span key="leftEllipsis">...</span>);
            }
        }

        pageNumbers.forEach((number) =>
            items.push(
                <button key={number} onClick={() => paginate(number)} disabled={currentPage === number}>
                    {number}
                </button>
            )
        );

        if (rightSide < totalPages) {
            if (rightSide < totalPages - 1) {
                items.push(<span key="rightEllipsis">...</span>);
            }
            items.push(<button key={totalPages} onClick={() => paginate(totalPages)}>{totalPages}</button>);
        }

        return items;
    };

    return (
        <div className="main-content">

            <div className="border rounded-lg p-4">
                <h2 className="mb-4 text-center">Manage Users</h2>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <table className="table">
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
                                        <input
                                            type="text"
                                            defaultValue={user.username}
                                            onBlur={(e) => updateUserField(user.userId, 'username', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="email"
                                            defaultValue={user.email}
                                            onBlur={(e) => updateUserField(user.userId, 'email', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <select
                                            className="select-role"
                                            value={user.role}
                                            onChange={(e) => updateUserField(user.userId, 'role', e.target.value)}
                                        >
                                            <option value="ROLE_USER">User</option>
                                            <option value="ROLE_ADMIN">Admin</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="modify" onClick={() => modifyUser(user)}>Modify</button>
                                            <button className="delete" onClick={() => deleteUser(user.userId)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                            {renderPageNumbers(Math.ceil(users.length / usersPerPage))}
                            <button onClick={nextPage} disabled={currentPage === Math.ceil(users.length / usersPerPage)}>Next</button>
                        </div>
                    </>
                )}
            </div>

        </div>
    );
}

export default ManageUsers;