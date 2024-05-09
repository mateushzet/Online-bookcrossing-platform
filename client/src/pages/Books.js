import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Pagination, Modal, Button, Form } from 'react-bootstrap';

function Books() {
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [inputPage, setInputPage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get('http://localhost:8080/api/user/bookTable');
                setBooks(response.data);
            } catch (error) {
                console.error("Failed to fetch books:", error);
                setError('Failed to fetch books. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const totalPages = Math.ceil(books.length / booksPerPage);

    const handlePageInput = () => {
        const pageNumber = Number(inputPage);
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
        setShowModal(false);
        setInputPage('');
    };

    const handleEllipsisClick = () => {
        setShowModal(true);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => prev < totalPages ? prev + 1 : prev);
    const prevPage = () => setCurrentPage(prev => prev > 1 ? prev - 1 : prev);

    const renderPaginationItems = () => {
        let items = [];
        if (totalPages <= 5) {
            for (let number = 1; number <= totalPages; number++) {
                items.push(
                    <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
                        {number}
                    </Pagination.Item>
                );
            }
        } else {
            items.push(
                <Pagination.Item key={1} active={currentPage === 1} onClick={() => paginate(1)}>
                    1
                </Pagination.Item>
            );

            let startPage = Math.max(2, currentPage - 2);
            let endPage = Math.min(totalPages - 1, currentPage + 2);

            if (startPage > 2) {
                items.push(<Pagination.Ellipsis key="ellipsis-1" onClick={handleEllipsisClick} />);
            }

            for (let number = startPage; number <= endPage; number++) {
                items.push(
                    <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
                        {number}
                    </Pagination.Item>
                );
            }

            if (endPage < totalPages - 1) {
                items.push(<Pagination.Ellipsis key="ellipsis-2" onClick={handleEllipsisClick} />);
            }

            items.push(
                <Pagination.Item key={totalPages} active={currentPage === totalPages} onClick={() => paginate(totalPages)}>
                    {totalPages}
                </Pagination.Item>
            );
        }

        return items;
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Go to Page</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Enter page number</Form.Label>
                            <Form.Control
                                type="number"
                                value={inputPage}
                                onChange={e => setInputPage(e.target.value)}
                                min="1"
                                max={totalPages}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handlePageInput}>Go</Button>
                </Modal.Footer>
            </Modal>
            <Container className="my-5 shadow rounded bg-white p-4">
                <h2 className="text-primary mb-4 text-center">Manage Books</h2>
                {isLoading ? (
                    <p className="text-center">Loading...</p>
                ) : error ? (
                    <p className="text-center text-danger">{error}</p>
                ) : (
                    <>
                        <Table striped bordered hover className="text-center">
                            <thead>
                            <tr>
                                <th>Book ID</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Description</th>
                                <th>Genre</th>
                                <th>ISBN</th>
                            </tr>
                            </thead>
                            <tbody>
                            {books.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage).map((book) => (
                                <tr key={book.bookId}>
                                    <td>{book.bookId}</td>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{book.description}</td>
                                    <td>{book.genre}</td>
                                    <td>{book.isbn}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                        <Pagination className="justify-content-center">
                            <Pagination.Prev onClick={prevPage} disabled={currentPage === 1} />
                            {renderPaginationItems()}
                            <Pagination.Next onClick={nextPage} disabled={currentPage === totalPages} />
                        </Pagination>
                    </>
                )}
            </Container>
        </Container>
    );
}

export default Books;