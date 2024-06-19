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
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  th {
    min-width: 300px;
  }

  td {
    min-width: 300px;
    width: auto;
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
  background: ${({ variant }) => (variant === 'outline-primary' ? '#007bff' : variant === 'outline-danger' ? '#dc3545' : '#6c757d')};
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  margin-right: 10px;
  cursor: pointer;
  &:hover {
    background: ${({ variant }) => (variant === 'outline-primary' ? '#0056b3' : variant === 'outline-danger' ? '#c82333' : '#5a6268')};
  }
`;

const ModalButton = styled.button`
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

const FormControl = styled.textarea`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ced4da;
  border-radius: 4px;
  resize: vertical;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;

function ManageBooks() {
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [inputPage, setInputPage] = useState('');
    const [filters, setFilters] = useState({
        title: '',
        author: '',
        isbn: '',
        genre: '',
        addedBy: '',
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

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('http://localhost:8080/api/user/bookTable');
                setBooks(response.data);
                setStatusMessage('');
            } catch (error) {
                console.error("Failed to fetch Books:", error);
                setStatusMessage('Błąd pobierania książek.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleFieldChange = (bookId, field, value) => {
        setBooks(books.map(book => book.bookId === bookId ? { ...book, [field]: value } : book));
    };

    const handleFilterChange = (field, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [field]: value,
        }));
        setCurrentPage(1);
    };

    const modifyBook = (book) => {
        axios.put('http://localhost:8080/api/admin/modifyBook', book)
            .then(response => {
                setStatusMessage('Książka została zmodyfikowana pomyślnie.');
                setBooks(prev => prev.map(u => u.bookId === book.bookId ? {...u, ...response.data} : u));
            })
            .catch(error => {
                console.error('Error modifying book:', error);
                setStatusMessage('Błąd podczas modyfikowania książki.');
            });
    };

    const deleteBook = (bookId) => {
        axios.delete('http://localhost:8080/api/admin/deleteBook', { params: { bookId } })
            .then(() => {
                setBooks(books.filter(book => book.bookId !== bookId));
                setStatusMessage('Książka została usunięta pomyślnie.');
            })
            .catch(error => {
                console.error("Failed to delete book:", error);
                setStatusMessage('Błąd podczas usuwania książki.');
            });
    };

    const handlePageInput = () => {
        const pageNumber = Number(inputPage);
        if (pageNumber >= 1 && pageNumber <= Math.ceil(filteredBooks.length / booksPerPage)) {
            setCurrentPage(pageNumber);
        }
        setShowModal(false);
        setInputPage('');
    };

    const handleEllipsisClick = () => {
        setShowModal(true);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => prev < Math.ceil(filteredBooks.length / booksPerPage) ? prev + 1 : prev);
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

        if (totalPages > pageLimit && endPage < totalPages - 1) {
            items.push(<PaginationButton key="ellipsis-2" onClick={handleEllipsisClick}>...</PaginationButton>);
            items.push(
                <PaginationButton key={totalPages} active={currentPage === totalPages} onClick={() => paginate(totalPages)}>
                    {totalPages}
                </PaginationButton>
            );
        }

        return items;
    };

    const filteredBooks = books.filter(book => {
        return Object.keys(filters).every(key => {
            if (!filters[key]) return true;
            return book[key]?.toString().toLowerCase().includes(filters[key].toLowerCase());
        });
    });

    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    return (
        <Container>
            <Header>
                <HeaderTitle>Zarządzanie książkami</HeaderTitle>
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
                                onChange={e => setInputPage(e.target.value)}
                                min="1"
                                max={totalPages}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <ModalButton variant="secondary" onClick={() => setShowModal(false)}>Close</ModalButton>
                            <ModalButton variant="primary" onClick={handlePageInput}>Go</ModalButton>
                        </ModalFooter>
                    </ModalContainer>
                </ModalBackground>
            )}
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
                                <th>Akcje</th>
                                <th>
                                    Tytuł
                                    <Input
                                        type="text"
                                        value={filters.title}
                                        onChange={e => handleFilterChange('title', e.target.value)}
                                    />
                                </th>
                                <th>
                                    Autor
                                    <Input
                                        type="text"
                                        value={filters.author}
                                        onChange={e => handleFilterChange('author', e.target.value)}
                                    />
                                </th>
                                <th>
                                    ISBN
                                    <Input
                                        type="text"
                                        value={filters.isbn}
                                        onChange={e => handleFilterChange('isbn', e.target.value)}
                                    />
                                </th>
                                <th>
                                    Gatunek
                                    <Input
                                        type="text"
                                        value={filters.genre}
                                        onChange={e => handleFilterChange('genre', e.target.value)}
                                    />
                                </th>
                                <th>
                                    Dodający
                                    <Input
                                        type="text"
                                        value={filters.addedBy}
                                        onChange={e => handleFilterChange('addedBy', e.target.value)}
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
                                    physicalDescription
                                    <Input
                                        type="text"
                                        value={filters.physicalDescription}
                                        onChange={e => handleFilterChange('physicalDescription', e.target.value)}
                                    />
                                </th>
                                <th>
                                    subjectHeadings
                                    <Input
                                        type="text"
                                        value={filters.subjectHeadings}
                                        onChange={e => handleFilterChange('subjectHeadings', e.target.value)}
                                    />
                                </th>
                                <th>
                                    corporateNames
                                    <Input
                                        type="text"
                                        value={filters.corporateNames}
                                        onChange={e => handleFilterChange('corporateNames', e.target.value)}
                                    />
                                </th>
                                <th>
                                    personalNames
                                    <Input
                                        type="text"
                                        value={filters.personalNames}
                                        onChange={e => handleFilterChange('personalNames', e.target.value)}
                                    />
                                </th>
                                <th>
                                    seriesStatements
                                    <Input
                                        type="text"
                                        value={filters.seriesStatements}
                                        onChange={e => handleFilterChange('seriesStatements', e.target.value)}
                                    />
                                </th>
                                <th>
                                    generalNotes
                                    <Input
                                        type="text"
                                        value={filters.generalNotes}
                                        onChange={e => handleFilterChange('generalNotes', e.target.value)}
                                    />
                                </th>
                                <th>
                                    summary
                                    <Input
                                        type="text"
                                        value={filters.summary}
                                        onChange={e => handleFilterChange('summary', e.target.value)}
                                    />
                                </th>
                                <th>
                                    tableOfContents
                                    <Input
                                        type="text"
                                        value={filters.tableOfContents}
                                        onChange={e => handleFilterChange('tableOfContents', e.target.value)}
                                    />
                                </th>
                                <th>
                                    Language Code
                                    <Input
                                        type="text"
                                        value={filters.languageCode}
                                        onChange={e => handleFilterChange('languageCode', e.target.value)}
                                    />
                                </th>
                                <th>
                                    Original Language
                                    <Input
                                        type="text"
                                        value={filters.originalLanguage}
                                        onChange={e => handleFilterChange('originalLanguage', e.target.value)}
                                    />
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredBooks.slice((currentPage-1) * booksPerPage, currentPage * booksPerPage).map((book) => (
                                <tr key={book.bookId}>
                                    <td>
                                        <Button variant="outline-primary" onClick={() => modifyBook(book)}>Modify</Button>
                                        <Button variant="outline-danger" onClick={() => deleteBook(book.bookId)}>Delete</Button>
                                    </td>
                                    <td>
                                        <FormControl
                                            value={book.title}
                                            onChange={(e) => handleFieldChange(book.bookId, 'title', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <FormControl
                                            value={book.author}
                                            onChange={(e) => handleFieldChange(book.bookId, 'author', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <FormControl
                                            value={book.isbn}
                                            onChange={(e) => handleFieldChange(book.bookId, 'isbn', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <FormControl
                                            value={book.genre}
                                            onChange={(e) => handleFieldChange(book.bookId, 'genre', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <FormControl
                                            value={book.addedBy}
                                            disabled={true}
                                            onChange={(e) => handleFieldChange(book.bookId, 'addedBy', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <FormControl
                                            value={book.publicationYear}
                                            onChange={(e) => handleFieldChange(book.bookId, 'publicationYear', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <FormControl
                                            value={book.physicalDescription}
                                            onChange={(e) => handleFieldChange(book.bookId, 'physicalDescription', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <FormControl
                                            value={book.subjectHeadings}
                                            onChange={(e) => handleFieldChange(book.bookId, 'subjectHeadings', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <FormControl
                                            value={book.corporateNames}
                                            onChange={(e) => handleFieldChange(book.bookId, 'corporateNames', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <FormControl
                                            value={book.personalNames}
                                            onChange={(e) => handleFieldChange(book.bookId, 'personalNames', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <FormControl
                                            value={book.seriesStatements}
                                            onChange={(e) => handleFieldChange(book.bookId, 'seriesStatements', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <FormControl
                                            value={book.generalNotes}
                                            onChange={(e) => handleFieldChange(book.bookId, 'generalNotes', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <FormControl
                                            value={book.summary}
                                            onChange={(e) => handleFieldChange(book.bookId, 'summary', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <FormControl
                                            value={book.tableOfContents}
                                            onChange={(e) => handleFieldChange(book.bookId, 'tableOfContents', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <FormControl
                                            value={book.languageCode}
                                            onChange={(e) => handleFieldChange(book.bookId, 'languageCode', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <FormControl
                                            value={book.originalLanguage}
                                            onChange={(e) => handleFieldChange(book.bookId, 'originalLanguage', e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                        {statusMessage && <Alert>{statusMessage}</Alert>}
                    </TableContainer>
                    <PaginationContainer>
                        <PaginationButton onClick={prevPage} disabled={currentPage === 1}>Previous</PaginationButton>
                        {renderPaginationItems(currentPage, totalPages)}
                        <PaginationButton onClick={nextPage} disabled={currentPage === totalPages}>Next</PaginationButton>
                    </PaginationContainer>
                </>
            )}
        </Container>
    );
}

export default ManageBooks;