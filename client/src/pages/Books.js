import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

const Container = styled.div`
  margin: auto;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  color: black;
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
    min-width: 300px;
  }

  tbody tr:nth-child(even) {
    background-color: #f2f2f2;
    min-width: 300px;
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

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 500px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h5`
  margin: 0;
  color: #627254;
`;

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #627254;
`;

const ModalBody = styled.div`
  margin-bottom: 1rem;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button`
  background: ${({ variant }) => (variant === 'primary' ? '#627254' : '#6c757d')};
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  &:hover {
    background: ${({ variant }) => (variant === 'primary' ? '#41542b' : '#5a6268')};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
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

function Books() {
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [inputPage, setInputPage] = useState('');
    const [filters, setFilters] = useState({
        title: '',
        author: '',
        genre: '',
        isbn: '',
        physicalDescription: '',
        subjectHeadings: '',
        corporateNames: '',
        personalNames: '',
        seriesStatements: '',
        generalNotes: '',
        summary: '',
        tableOfContents: '',
        languageCode: '',
        originalLanguage: '',
        publicationYear: ''
    });

    const location = useLocation();

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

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const title = queryParams.get('title') || '';
        const author = queryParams.get('author') || '';
        const genre = queryParams.get('genre') || '';
        const isbn = queryParams.get('isbn') || '';

        setFilters((prevFilters) => ({
            ...prevFilters,
            title,
            author,
            genre,
            isbn,
        }));
    }, [location.search]);

    const handleFilterChange = (field, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [field]: value,
        }));
        setCurrentPage(1);
    };

    const filteredBooks = books.filter((book) => {
        return Object.keys(filters).every((key) => {
            if (!filters[key]) return true;
            return book[key]?.toString().toLowerCase().includes(filters[key].toLowerCase());
        });
    });

    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

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
    const nextPage = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
    const prevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));

    const renderPaginationItems = () => {
        let items = [];
        if (totalPages <= 5) {
            for (let number = 1; number <= totalPages; number++) {
                items.push(
                    <PaginationButton key={number} active={number === currentPage} onClick={() => paginate(number)}>
                        {number}
                    </PaginationButton>
                );
            }
        } else {
            items.push(
                <PaginationButton key={1} active={currentPage === 1} onClick={() => paginate(1)}>
                    1
                </PaginationButton>
            );

            let startPage = Math.max(2, currentPage - 2);
            let endPage = Math.min(totalPages - 1, currentPage + 2);

            if (startPage > 2) {
                items.push(<PaginationButton key="ellipsis-1" onClick={handleEllipsisClick}>...</PaginationButton>);
            }

            for (let number = startPage; number <= endPage; number++) {
                items.push(
                    <PaginationButton key={number} active={number === currentPage} onClick={() => paginate(number)}>
                        {number}
                    </PaginationButton>
                );
            }

            if (endPage < totalPages - 1) {
                items.push(<PaginationButton key="ellipsis-2" onClick={handleEllipsisClick}>...</PaginationButton>);
            }

            items.push(
                <PaginationButton key={totalPages} active={currentPage === totalPages} onClick={() => paginate(totalPages)}>
                    {totalPages}
                </PaginationButton>
            );
        }

        return items;
    };

    return (
        <Container>
            <Header>
                <HeaderTitle>Baza książek</HeaderTitle>
            </Header>
            {showModal && (
                <ModalBackground>
                    <ModalContainer>
                        <ModalHeader>
                            <ModalTitle>Go to Page</ModalTitle>
                            <ModalCloseButton onClick={() => setShowModal(false)}>&times;</ModalCloseButton>
                        </ModalHeader>
                        <ModalBody>
                            <label>Enter page number</label>
                            <Input
                                type="number"
                                value={inputPage}
                                onChange={(e) => setInputPage(e.target.value)}
                                min="1"
                                max={totalPages}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                            <Button variant="primary" onClick={handlePageInput}>Go</Button>
                        </ModalFooter>
                    </ModalContainer>
                </ModalBackground>
            )}
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Spinner />
                </div>
            ) : error ? (
                <p style={{ color: '#dc3545' }}>{error}</p>
            ) : (
                <>
                    <TableContainer>
                        <Table>
                            <thead>
                            <tr>
                                <th>ID Książki</th>
                                <th>
                                    Tytuł
                                    <Input
                                        type="text"
                                        value={filters.title}
                                        onChange={(e) => handleFilterChange('title', e.target.value)}
                                    />
                                </th>
                                <th>
                                    Autor
                                    <Input
                                        type="text"
                                        value={filters.author}
                                        onChange={(e) => handleFilterChange('author', e.target.value)}
                                    />
                                </th>
                                <th>
                                    Gatunek
                                    <Input
                                        type="text"
                                        value={filters.genre}
                                        onChange={(e) => handleFilterChange('genre', e.target.value)}
                                    />
                                </th>
                                <th>
                                    ISBN
                                    <Input
                                        type="text"
                                        value={filters.isbn}
                                        onChange={(e) => handleFilterChange('isbn', e.target.value)}
                                    />
                                </th>
                                <th>
                                    Rok publikacji
                                    <Input
                                        type="text"
                                        value={filters.publicationYear}
                                        onChange={e => handleFilterChange('publicationYear', e.target.value)}
                                    />
                                </th>
                                <th>
                                    Opis fizyczny
                                    <Input
                                        type="text"
                                        value={filters.physicalDescription}
                                        onChange={(e) => handleFilterChange('physicalDescription', e.target.value)}
                                    />
                                </th>
                                <th>
                                    Tematyka
                                    <Input
                                        type="text"
                                        value={filters.subjectHeadings}
                                        onChange={(e) => handleFilterChange('subjectHeadings', e.target.value)}
                                    />
                                </th>
                                <th>
                                    Wydawnictwo
                                    <Input
                                        type="text"
                                        value={filters.corporateNames}
                                        onChange={(e) => handleFilterChange('corporateNames', e.target.value)}
                                    />
                                </th>
                                <th>
                                    Współtwórcy
                                    <Input
                                        type="text"
                                        value={filters.personalNames}
                                        onChange={(e) => handleFilterChange('personalNames', e.target.value)}
                                    />
                                </th>
                                <th>
                                    Seria
                                    <Input
                                        type="text"
                                        value={filters.seriesStatements}
                                        onChange={(e) => handleFilterChange('seriesStatements', e.target.value)}
                                    />
                                </th>
                                <th>
                                    Dodatkowe uwagi dot. książki
                                    <Input
                                        type="text"
                                        value={filters.generalNotes}
                                        onChange={(e) => handleFilterChange('generalNotes', e.target.value)}
                                    />
                                </th>
                                <th>
                                    Streszczenie
                                    <Input
                                        type="text"
                                        value={filters.summary}
                                        onChange={(e) => handleFilterChange('summary', e.target.value)}
                                    />
                                </th>
                                <th>
                                    Spis treści
                                    <Input
                                        type="text"
                                        value={filters.tableOfContents}
                                        onChange={(e) => handleFilterChange('tableOfContents', e.target.value)}
                                    />
                                </th>
                                <th>
                                    Kod języka
                                    <Input
                                        type="text"
                                        value={filters.languageCode}
                                        onChange={(e) => handleFilterChange('languageCode', e.target.value)}
                                    />
                                </th>
                                <th>
                                    Język oryginalny
                                    <Input
                                        type="text"
                                        value={filters.originalLanguage}
                                        onChange={(e) => handleFilterChange('originalLanguage', e.target.value)}
                                    />
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredBooks.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage).map((book) => (
                                <tr key={book.bookId}>
                                    <td>{book.bookId}</td>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{book.genre}</td>
                                    <td>{book.isbn}</td>
                                    <td>{book.publicationYear}</td>
                                    <td>{book.physicalDescription}</td>
                                    <td>{book.subjectHeadings}</td>
                                    <td>{book.corporateNames}</td>
                                    <td>{book.personalNames}</td>
                                    <td>{book.seriesStatements}</td>
                                    <td>{book.generalNotes}</td>
                                    <td>{book.summary}</td>
                                    <td>{book.tableOfContents}</td>
                                    <td>{book.languageCode}</td>
                                    <td>{book.originalLanguage}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </TableContainer>
                    <PaginationContainer>
                        <PaginationButton onClick={prevPage} disabled={currentPage === 1}>Previous</PaginationButton>
                        {renderPaginationItems()}
                        <PaginationButton onClick={nextPage} disabled={currentPage === totalPages}>Next</PaginationButton>
                    </PaginationContainer>
                </>
            )}
        </Container>
    );
}

export default Books;