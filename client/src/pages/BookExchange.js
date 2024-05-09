import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import bookIcon from '../assets/icons/book_icon.png';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../styles/shakeAnimation.css';
import Recaptcha from 'react-google-recaptcha';

function BookExchange() {
    const [formData, setFormData] = useState({
        bookTitle: '',
        authorName: '',
        isbn: '',
        genre: '',
    });
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [message, setMessage] = useState(null);

    const [captchaVerifiedBook, setCaptchaVerifiedBook] = useState(false);
    const [captchaVerifiedExchange, setCaptchaVerifiedExchange] = useState(false);

    const genres = ["Biznes", "Podręczniki", "Humor", "Powieść", "Romans", "Biografia", "Fantastyka", "Filozofia", "Literatura podróżnicza", "Nauka", "Komiks", "Informatyka", "Poradniki", "Horror", "Publicystyka", "Kryminał", "Literatura młodzieżowa", "Poezja", "Historia", "Literatura dziecięca"];
    const bookConditions = ["Nowa",
        "Bardzo dobry",
        "Dobry",
        "Akceptowalny",
        "Uszkodzona"];

    const [showModal, setShowModal] = useState(false);
    const [formType, setFormType] = useState('search');
    const [selectedBook, setSelectedBook] = useState({
        selectedBookTitle: '',
        selectedAuthorName: '',
        selectedIsbn: '',
        selectedBookId: '',
        selectedGenre: '',
        selectedCondition: '',
        selectedPreferredBooks: '',
    });

    const handleCloseModal = () => {
        setShowModal(false);
        setMessage(null);
        setFormType('search');
        setCaptchaVerifiedBook(false);
    };

    const handleImageClick = () => {
        setIsClicked(true);
        setShowModal(true);
        fetchBooks(formData.bookTitle, formData.authorName, formData.isbn, formData.genre);
        setMessage(null);
    };

    const clearInput = useCallback((field) => {
        setFormData({ ...formData, [field]: '' });
        if (field === 'bookTitle' || field === 'authorName') {
            setSearchResults([]);
            setSelectedBook(null);
        }
    }, [formData]);

    const clearSearchForm = () => {
        setFormData(prev => ({
            bookTitle: '',
            authorName: '',
            isbn: '',
            bookId: prev.bookId,
            genre: '',
        }));
        setSearchResults([]);
    };

    const clearSelectedForm = () => {
        setSelectedBook(({
            selectedBookTitle: '',
            selectedAuthorName: '',
            selectedIsbn: '',
            selectedBookId: '',
            selectedGenre: '',
            selectedCondition: '',
            selectedPreferredBooks: '',
        }));
        setMessage(null);
        setCaptchaVerifiedExchange(false);
    };

    const fetchBooks = useCallback(debounce(async (title, author, isbn, genre) => {
        setIsSearching(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/user/fetchBooks`, {
                params: { title, author, isbn, genre },
            });
            setSearchResults(response.data || []);
        } catch (error) {
            console.error('Failed to fetch books:', error);
        } finally {
            setIsSearching(false);
        }
    }, 300), []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('selected')) {
            setSelectedBook(prev => ({ ...prev, [name]: value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
            if (['bookTitle', 'authorName', 'isbn', 'genre'].includes(name)) {
                const newFormData = { ...formData, [name]: value };
                fetchBooks(newFormData.bookTitle, newFormData.authorName, newFormData.isbn, newFormData.genre);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(selectedBook.selectedBookId ,selectedBook.selectedCondition ,selectedBook.selectedPreferredBooks)
        if (!selectedBook.selectedBookId || !selectedBook.selectedCondition || !selectedBook.selectedPreferredBooks) {
            setMessage('Please choose the book and fill all required fields before submitting!');
            return;
        }
        const { selectedBookId, selectedCondition, selectedPreferredBooks} = selectedBook;

        const encodedBookId = encodeURIComponent(selectedBookId);
        const encodedDescription = encodeURIComponent(selectedPreferredBooks);
        const encodedCondition = encodeURIComponent(selectedCondition);

        const url = `http://localhost:8080/api/user/submitExchange?bookId=${encodedBookId}&description=${encodedDescription}&bookCondition=${encodedCondition}`;
        try {
            const response = await axios.post(url);
            clearSelectedForm();
            setMessage('Propozycja wymiany została wysłana!');
            console.log('Response:', response.data);
            setCaptchaVerifiedExchange(false);

        } catch (error) {
            console.error('Failed to submit exchange:', error);
            setMessage('Failed to send exchange proposal. Please try again.');
        }
    };

    const handleSelectSuggestion = (suggestion) => {
        setSelectedBook({
            selectedBookTitle: suggestion.title,
            selectedAuthorName: suggestion.author,
            selectedBookId: suggestion.bookId,
            selectedGenre: suggestion.genre
        });
        setSearchResults([]);
        handleCloseModal();
    };

    const handleSubmitNewBook = async () => {
        if (!formData.bookTitle || !formData.authorName || !formData.genre) {
            setMessage('Please fill all required fields.');
            return;
        }

            const encodedBookTitle = encodeURIComponent(formData.bookTitle);
            const encodedAuthorName = encodeURIComponent(formData.authorName);
            const encodedGenre = encodeURIComponent(formData.genre);
            const encodedIsbn = encodeURIComponent(formData.isbn);

            const url = `http://localhost:8080/api/user/addBook?title=${encodedBookTitle}&author=${encodedAuthorName}&genre=${encodedGenre}&isbn=${encodedIsbn}`;

            try {
                const response = await axios.post(url);
                setMessage('Book has been successfully added.');
                setFormType('search');
                fetchBooks(formData.bookTitle, formData.authorName, formData.isbn, formData.genre);
                setCaptchaVerifiedBook(false);
            } catch (error) {
                if(error.data = 'There is already book with this title and author'){
                    console.error('Failed to add book:', error);
                    setMessage('There is already book with this title and author');
                } else {
                    console.error('Failed to add book:', error);
                    setMessage('Failed to add book. Please try again.');
                }
            }
    };

    const handleAddNewBook = () => {
        setMessage(null);
        setFormType('add');
    };

    const handleGetBackToSearch = () => {
        setMessage(null);
        setFormType('search');
        setCaptchaVerifiedBook(false);
    };

    const [applyShake, setApplyShake] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setApplyShake(true);
            setTimeout(() => setApplyShake(false), 500);
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="container mt-5">

            <form onSubmit={handleSubmit}>

                <div className="card mb-4">
                    <div className="card-header bg-white">
                        <h2 className="text-center mb-4">Propozycja wymiany książki</h2>
                    </div>
                    <div className="row g-0">
                        <div className="col-md-4">

                            <div className="container mt-5">
                                <img
                                    src={bookIcon}
                                    alt="Book icon"
                                    className={`${applyShake && !isClicked ? 'shake' : 'hoverShake'}`+' img-fluid'}
                                    style={{ maxWidth: '100%' }}
                                    style={{ cursor: 'pointer' }}
                                    onClick={handleImageClick}
                                />
                            </div>
                        </div>

                        <div className="col-md-8 d-flex align-items-center justify-content-center">
                            {selectedBook.selectedBookId !== '' && (
                                <div className="card-body d-flex flex-column" style={{ height: '100%', padding: '20px' }}>
                                    <h5 className="card-title">{selectedBook.selectedBookTitle}</h5>
                                    <p className="card-text">{selectedBook.selectedAuthorName}</p>
                                    <p className="card-text"><small className="text-muted">{selectedBook.selectedGenre}</small></p>
                                    <div className="mb-3">
                                        <label htmlFor="condition" className="form-label">Stan książki</label>
                                        <select
                                            className="form-select"
                                            id="condition"
                                            name="selectedCondition"
                                            value={selectedBook.selectedCondition}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Wybierz stan książki</option>
                                            {bookConditions.map(condition => (
                                                <option key={condition} value={condition}>{condition}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3 d-flex flex-column" style={{ flexGrow: 1 }}>
                                        <label htmlFor="preferredBooks" className="form-label">Preferowane książki do wymiany</label>
                                        <textarea
                                            className="form-control"
                                            id="preferredBooks"
                                            name="selectedPreferredBooks"
                                            value={selectedBook.selectedPreferredBooks}
                                            onChange={handleChange}
                                            required
                                            style={{ height: '100%' }}
                                        />
                                    </div>

                                    <Recaptcha
                                        sitekey="6LeUONcpAAAAAL5fYacJIwfTFX3v8jTpE0nwWbPQ"
                                        onChange={(val) => setCaptchaVerifiedExchange(val)}
                                    />

                                </div>
                            )}
                            {selectedBook.selectedBookId === '' && (
                                <h5 className="card-title">Kliknij w ikonę książki aby wyszukać</h5>
                            )}
                        </div>
                        {message && !showModal &&(
                            <div className="alert alert-info text-center" role="alert">
                                {message}
                            </div>
                        )}
                        <div className="card-footer d-flex justify-content-end align-items-center bg-white text-white">

                            <button type="submit" className="btn btn-primary" disabled={!captchaVerifiedExchange}>Wyślij propozycję</button>
                            <button type="button" className="btn btn-secondary ms-2" onClick={clearSelectedForm}>Wyczyść formularz</button>
                        </div>
                    </div>




                </div>


                <Modal show={showModal} size="xl" onHide={() => { handleCloseModal()}}>
                    <Modal.Header closeButton>
                        <Modal.Title>{formType === 'search' ? 'Informacje o książce' : 'Dodaj książkę do systemu'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {message && (
                            <div className="alert alert-info" role="alert">
                                {message}
                            </div>
                        )}
                        {formType === 'search' ? (
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="bookTitle" className="form-label">Tytuł książki</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="bookTitle"
                                                name="bookTitle"
                                                value={formData.bookTitle}
                                                onChange={handleChange}
                                                autoComplete="off"
                                                required
                                            />
                                            {formData.bookTitle && (
                                                <i
                                                    className="bi bi-x-lg"
                                                    style={{ cursor: 'pointer', position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)' }}
                                                    onClick={() => clearInput('bookTitle')}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="authorName" className="form-label">Autor</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="authorName"
                                                name="authorName"
                                                value={formData.authorName}
                                                onChange={handleChange}
                                                autoComplete="off"
                                                required
                                            />
                                            {formData.authorName && (
                                                <i
                                                    className="bi bi-x-lg"
                                                    style={{ cursor: 'pointer', position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)' }}
                                                    onClick={() => clearInput('authorName')}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <label htmlFor="isbn" className="form-label">ISBN</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="isbn"
                                            name="isbn"
                                            value={formData.isbn}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="genre" className="form-label">Gatunek</label>
                                        <select
                                            className="form-select"
                                            id="genre"
                                            name="genre"
                                            value={formData.genre}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Wszystkie</option>
                                            {genres.map(genre => (
                                                <option key={genre} value={genre}>{genre}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                {isSearching && (
                                    <div className="text-center">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                )}
                                {!isSearching && searchResults.length > 0 && (
                                    <div className="row mb-3">
                                        {searchResults.map((book, index) => (
                                            <div key={index} className="col-sm-6 col-md-4 col-lg-3 mb-3">
                                                <div className="card h-100 hover-shadow" onMouseOver={e => e.currentTarget.classList.add('shadow')} onMouseOut={e => e.currentTarget.classList.remove('shadow')} onClick={() => handleSelectSuggestion(book)}>
                                                    <div className="card-body">
                                                        <h6 className="card-title">{book.title}</h6>
                                                        <p className="card-text">{book.author}</p>
                                                        <p className="card-text"><small className="text-muted">{book.genre}</small></p>
                                                    </div>
                                                    <div className="card-footer">
                                                        <small className="text-muted">ISBN: {book.isbn}</small>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        ) : (
                            <div className="card mb-4">
                                <div className="card-body">
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="newBookTitle" className="form-label">Tytuł nowej książki</label>
                                            <input type="text" className="form-control" id="newBookTitle" name="bookTitle" value={formData.bookTitle} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="newAuthorName" className="form-label">Autor</label>
                                            <input type="text" className="form-control" id="newAuthorName" name="authorName" value={formData.authorName} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="newIsbn" className="form-label">ISBN</label>
                                            <input type="text" className="form-control" id="newIsbn" name="isbn" value={formData.isbn} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="newGenre" className="form-label">Gatunek</label>
                                            <select className="form-select" id="newGenre" name="genre" value={formData.genre} onChange={handleChange} required>
                                                <option value="">Wybierz gatunek</option>
                                                {genres.map(genre => (
                                                    <option key={genre} value={genre}>{genre}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <Recaptcha
                                            sitekey="6LeUONcpAAAAAL5fYacJIwfTFX3v8jTpE0nwWbPQ"
                                            onChange={(val) => setCaptchaVerifiedBook(val)}
                                        />
                                    </div>
                                    <button className="btn btn-primary" onClick={handleSubmitNewBook} disabled={!captchaVerifiedBook}>Dodaj książkę</button>
                                </div>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        {formType === 'search' ? (
                            <>
                            <button type="button" className={searchResults.length === 0 ? "btn btn-primary" : "btn btn-secondary"}
                                    onClick={handleAddNewBook}
                            >
                                Nie znaleziono książki? Dodaj książkę do systemu
                            </button>
                            <button type="button" className="btn btn-secondary ms-2" onClick={clearSearchForm}>
                                Wyczyść formularz
                            </button>
                            </>
                            ) : (
                                <>
                            <button type="button" className="btn btn-primary" onClick={handleGetBackToSearch}>
                            Wróć do wyszukiwania
                            </button>
                            <button type="button" className="btn btn-secondary ms-2" onClick={clearSearchForm}>
                            Wyczyść formularz
                            </button>
                                </>
                            )}
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Zamknij
                        </Button>
                    </Modal.Footer>
                </Modal>
            </form>

        </div>
    );
}

export default BookExchange;