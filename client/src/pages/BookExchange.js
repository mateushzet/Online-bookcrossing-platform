import React, { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import styled from 'styled-components';
import Recaptcha from 'react-google-recaptcha';

const Container = styled.div`
  margin: auto;
  height: 100%;
  width: 100%;
  max-width: 1200px;
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const CardHeader = styled.div`
  background-color: #627254;
  padding: 20px;
  color: #fff;
  text-align: center;
`;

const CardTitle = styled.h2`
  margin: 0;
`;

const CardBody = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const CardBodyColumn = styled.div`
  padding: 20px;
  display: column;
  flex-wrap: wrap;
  gap: 20px;
`;

const Column = styled.div`
  flex: 1;
  min-width: 200px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const CardText = styled.p`
  margin-bottom: 5px;
  color: #000;
  background: #f1f1f1;
  padding: 10px;
  border-radius: 5px;
`;

const Form = styled.form`
  width: 100%;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #000;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s;
  &:focus {
    border-color: #627254;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s;
  &:focus {
    border-color: #627254;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s;
  height: 400px; /* Set the default height here */
  &:focus {
    border-color: #627254;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  color: #fff;
  background-color: ${(props) => (props.primary ? '#627254' : '#6c757d')};
  cursor: pointer;
  transition: background-color 0.3s;
  &:disabled {
    background-color: #ccc;
  }
  &:hover:enabled {
    background-color: ${(props) => (props.primary ? '#505d40' : '#5a6268')};
  }
`;

const Alert = styled.div`
  padding: 10px;
  background-color: #d9edf7;
  color: #31708f;
  border: 1px solid #bce8f1;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const ModalWrapper = styled.div`
  display: ${(props) => (props.show ? 'block' : 'none')};
  position: fixed;
  z-index: 1050;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.5);
`;

const ModalDialog = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const ModalContent = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 95%;
  width: 70%;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  background-color: #627254;
  padding: 20px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h5`
  margin: 0;
`;

const ModalBody = styled.div`
  padding: 20px;
  flex: 1;
  overflow-y: auto;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f1f1f1;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
  max-width: 100%;
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const Tile = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  &:hover {
    background-color: #f1f1f1;
  }
`;

const TileTitle = styled.h6`
  margin: 0;
  font-size: 1.2em;
  color: #627254;
`;

const TileAuthor = styled.p`
  margin: 5px 0;
  color: #333;
`;

const TileGenre = styled.p`
  margin: 5px 0;
  color: #777;
`;

const TileISBN = styled.p`
  margin: 5px 0;
  color: #999;
  font-size: 0.9em;
`;

const Hashtag = styled.span`
  display: inline-flex;
  align-items: center;
  background-color: #e1f3d8;
  color: #627254;
  padding: 5px 10px;
  border-radius: 5px;
  margin: 2px;
  font-size: 0.9em;
  position: relative;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #556b2f;
  font-size: 1.2em;
  margin-left: 5px;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #3a5f0b;
    color: #adff2f;
    width: 24px;
    height: 24px;
    align-items: center;
    justify-content: center;
  }
`;

const ImagePreview = styled.img`
  max-width: 100px;
  max-height: 100px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const CaptchaAndButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
`;

function BookExchange() {
    const [formData, setFormData] = useState({
        bookTitle: '',
        authorName: '',
        isbn: '',
        genre: '',
        image: null,
        imagePreviewUrl: null,
    });
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [message, setMessage] = useState(null);

    const [captchaVerifiedBook, setCaptchaVerifiedBook] = useState(false);
    const [captchaVerifiedExchange, setCaptchaVerifiedExchange] = useState(false);

    const [preferredBooks, setPreferredBooks] = useState([]);

    const genres = ["Biznes", "Podręczniki", "Humor", "Powieść", "Romans", "Biografia", "Fantastyka", "Filozofia", "Literatura podróżnicza", "Nauka", "Komiks", "Informatyka", "Poradniki", "Horror", "Publicystyka", "Kryminał", "Literatura młodzieżowa", "Poezja", "Historia", "Literatura dziecięca"];
    const bookConditions = ["Nowa", "Bardzo dobry", "Dobry", "Akceptowalny", "Uszkodzona"];

    const recaptchaRefExchange = useRef(null);

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
        setFormType('search');
        setShowModal(true);
        fetchBooks(formData.bookTitle, formData.authorName, formData.isbn, formData.genre);
        setMessage(null);
    };

    const handlePlusClick = () => {
        setIsClicked(true);
        setFormType('addPreferredBook');
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
        setPreferredBooks([]);
        setFormData(prev => ({ ...prev, image: null, imagePreviewUrl: null }));
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
        const { name, value, files } = e.target;

        if (name === 'image' && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: file, imagePreviewUrl: reader.result }));
            };

            reader.readAsDataURL(file);
        } else if (name.startsWith('selected')) {
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
        if (!selectedBook.selectedBookId || !selectedBook.selectedCondition) {
            setMessage('Please choose the book and fill all required fields before submitting!');
            return;
        }
        const { selectedBookId, selectedCondition } = selectedBook;
        const encodedBookId = encodeURIComponent(selectedBookId);
        const encodedCondition = encodeURIComponent(selectedCondition);
        const encodedPreferredBooks = encodeURIComponent(preferredBooks.map(book => book.bookId).join(','));

        const url = `http://localhost:8080/api/user/submitExchange?bookId=${encodedBookId}&bookCondition=${encodedCondition}&preferredBooks=${encodedPreferredBooks}`;

        const formDataToSubmit = new FormData();
        formDataToSubmit.append('bookId', selectedBookId);
        formDataToSubmit.append('bookCondition', selectedCondition);
        formDataToSubmit.append('preferredBooks', preferredBooks.map(book => book.bookId).join(','));
        if (formData.image) {
            formDataToSubmit.append('image', formData.image);
        }

        recaptchaRefExchange.current.reset();
        try {
            const response = await axios.post(url, formDataToSubmit, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            clearSelectedForm();
            setMessage('Propozycja wymiany została wysłana!');
            setCaptchaVerifiedExchange(false);
        } catch (error) {
            console.error('Failed to submit exchange:', error);
            setMessage('Failed to send exchange proposal. Please try again.');
        }
    };

    const handleSelectSuggestion = (suggestion) => {
        setSelectedBook((prevSelectedBook) => ({
            ...prevSelectedBook,
            selectedBookTitle: suggestion.title,
            selectedAuthorName: suggestion.author,
            selectedBookId: suggestion.bookId,
            selectedGenre: suggestion.genre
        }));
        setSearchResults([]);
        handleCloseModal();
    };

    const handleAddPreferredBook = (suggestion) => {
        setPreferredBooks((prev) => [...prev, suggestion]);
        setSearchResults([]);
        handleCloseModal();
    };

    const handleSubmitNewBook = async (e) => {
        e.preventDefault(); // Prevent the form from submitting the default way
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
            if (error.data === 'There is already book with this title and author') {
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
        setShowModal(true);
    };

    const handleGetBackToSearch = () => {
        setMessage(null);
        setFormType('search');
        setCaptchaVerifiedBook(false);
        setShowModal(true);
    };

    const [applyShake, setApplyShake] = useState(false);

    const handleRemoveHashtag = (indexToRemove) => {
        setPreferredBooks((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setApplyShake(true);
            setTimeout(() => setApplyShake(false), 500);
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Propozycja wymiany książki</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <Column>
                            <>
                                <FormGroup>
                                    <Label>Tytuł książki</Label>
                                    <CardText>{selectedBook.selectedBookTitle}</CardText>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Autor</Label>
                                    <CardText>{selectedBook.selectedAuthorName}</CardText>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Gatunek</Label>
                                    <CardText>{selectedBook.selectedGenre}</CardText>
                                </FormGroup>
                                <FormGroup>
                                    <Label htmlFor="image">Dodaj zdjęcie książki</Label>
                                    <Input
                                        type="file"
                                        id="image"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleChange}
                                    />
                                    {formData.imagePreviewUrl && (
                                        <ImagePreview src={formData.imagePreviewUrl} alt="Podgląd zdjęcia książki" />
                                    )}
                                </FormGroup>
                            </>
                            <FormGroup>
                                <>
                                    <Label htmlFor="condition">Stan książki</Label>
                                    <Select
                                        id="condition"
                                        name="selectedCondition"
                                        value={selectedBook.selectedCondition}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Wybierz stan książki</option>
                                        {bookConditions.map((condition) => (
                                            <option key={condition} value={condition}>
                                                {condition}
                                            </option>
                                        ))}
                                    </Select>
                                </>
                            </FormGroup>
                            <FormGroup>
                                <Button primary type="button" onClick={handleImageClick}>
                                    {selectedBook.selectedBookId ? 'Zmień książkę' : 'Wybierz książkę'}
                                </Button>
                            </FormGroup>
                        </Column>
                        <Column>
                            <FormGroup>
                                <Label htmlFor="preferredBooks">Preferowane książki do wymiany</Label>
                                <TextArea
                                    id="preferredBooks"
                                    name="selectedPreferredBooks"
                                    value={selectedBook.selectedPreferredBooks}
                                    onChange={handleChange}
                                    required
                                />
                                <Button type="button" onClick={handlePlusClick}>+</Button>
                                <div>
                                    {preferredBooks.map((book, index) => (
                                        <Hashtag key={index}>
                                            {book.title}
                                            <RemoveButton type="button" onClick={() => handleRemoveHashtag(index)}>x</RemoveButton>
                                        </Hashtag>
                                    ))}
                                </div>
                            </FormGroup>
                        </Column>
                    </CardBody>
                    {message && !showModal && <Alert>{message}</Alert>}
                    <ModalFooter>
                        <Recaptcha
                            sitekey="6LeUONcpAAAAAL5fYacJIwfTFX3v8jTpE0nwWbPQ"
                            onChange={(val) => setCaptchaVerifiedExchange(val)}
                            ref={recaptchaRefExchange}
                        />
                        <ButtonContainer>
                            <Button primary type="submit" disabled={!captchaVerifiedExchange}>
                                Wyślij propozycję
                            </Button>
                            <Button type="button" onClick={clearSelectedForm}>
                                Wyczyść formularz
                            </Button>
                        </ButtonContainer>
                    </ModalFooter>
                </Card>
            </Form>

            <ModalWrapper show={showModal}>
                <ModalDialog>
                    <ModalContent>
                        <ModalHeader>
                            <ModalTitle>{formType === 'search' ? 'Informacje o książce' : formType === 'addPreferredBook' ? 'Dodaj książkę do listy preferowanych' : 'Dodaj książkę do systemu'}</ModalTitle>
                            <Button onClick={handleCloseModal}>Zamknij</Button>
                        </ModalHeader>
                        <ModalBody>
                            {message && <Alert>{message}</Alert>}
                            {formType === 'search' || formType === 'addPreferredBook' ? (
                                <Form>
                                    <Card>
                                        <CardBody>
                                            <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                                                <FormGroup style={{ flex: '1' }}>
                                                    <Label htmlFor="bookTitle">Tytuł książki</Label>
                                                    <Input
                                                        type="text"
                                                        id="bookTitle"
                                                        name="bookTitle"
                                                        value={formData.bookTitle}
                                                        onChange={handleChange}
                                                        autoComplete="off"
                                                        required
                                                    />
                                                    {formData.bookTitle && (
                                                        <i
                                                            style={{ cursor: 'pointer', position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)' }}
                                                            onClick={() => clearInput('bookTitle')}
                                                        />
                                                    )}
                                                </FormGroup>
                                                <FormGroup style={{ flex: '1' }}>
                                                    <Label htmlFor="authorName">Autor</Label>
                                                    <Input
                                                        type="text"
                                                        id="authorName"
                                                        name="authorName"
                                                        value={formData.authorName}
                                                        onChange={handleChange}
                                                        autoComplete="off"
                                                        required
                                                    />
                                                    {formData.authorName && (
                                                        <i
                                                            style={{ cursor: 'pointer', position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)' }}
                                                            onClick={() => clearInput('authorName')}
                                                        />
                                                    )}
                                                </FormGroup>
                                                <FormGroup style={{ flex: '1' }}>
                                                    <Label htmlFor="isbn">ISBN</Label>
                                                    <Input
                                                        type="text"
                                                        id="isbn"
                                                        name="isbn"
                                                        value={formData.isbn}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </FormGroup>
                                                <FormGroup style={{ flex: '1' }}>
                                                    <Label htmlFor="genre">Gatunek</Label>
                                                    <Select
                                                        id="genre"
                                                        name="genre"
                                                        value={formData.genre}
                                                        onChange={handleChange}
                                                        required
                                                    >
                                                        <option value="">Wszystkie</option>
                                                        {genres.map((genre) => (
                                                            <option key={genre} value={genre}>
                                                                {genre}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </FormGroup>
                                            </div>

                                        </CardBody>
                                    </Card>
                                    {isSearching && (
                                        <div className="text-center">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    )}
                                    {!isSearching && searchResults.length > 0 && (
                                        <GridContainer>
                                            {searchResults.slice(0, 12).map((book, index) => (
                                                <Tile key={index} onClick={() => formType === 'search' ? handleSelectSuggestion(book) : handleAddPreferredBook(book)}>
                                                    <TileTitle>{book.title}</TileTitle>
                                                    <TileAuthor>{book.author}</TileAuthor>
                                                    <TileGenre>{book.genre}</TileGenre>
                                                    <TileISBN>ISBN: {book.isbn}</TileISBN>
                                                </Tile>
                                            ))}
                                        </GridContainer>
                                    )}
                                </Form>
                            ) : (
                                <Form onSubmit={handleSubmitNewBook}>
                                    <Card>
                                        <CardBodyColumn>
                                            <FormGroup>
                                                <Label htmlFor="newBookTitle">Tytuł nowej książki</Label>
                                                <Input
                                                    type="text"
                                                    id="newBookTitle"
                                                    name="bookTitle"
                                                    value={formData.bookTitle}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label htmlFor="newAuthorName">Autor</Label>
                                                <Input
                                                    type="text"
                                                    id="newAuthorName"
                                                    name="authorName"
                                                    value={formData.authorName}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label htmlFor="newIsbn">ISBN</Label>
                                                <Input
                                                    type="text"
                                                    id="newIsbn"
                                                    name="isbn"
                                                    value={formData.isbn}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label htmlFor="newGenre">Gatunek</Label>
                                                <Select
                                                    id="newGenre"
                                                    name="genre"
                                                    value={formData.genre}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Wybierz gatunek</option>
                                                    {genres.map((genre) => (
                                                        <option key={genre} value={genre}>
                                                            {genre}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </FormGroup>
                                            <CaptchaAndButton>
                                                <Recaptcha
                                                    sitekey="6LeUONcpAAAAAL5fYacJIwfTFX3v8jTpE0nwWbPQ"
                                                    onChange={(val) => setCaptchaVerifiedBook(val)}
                                                />
                                                <Button primary type="submit" disabled={!captchaVerifiedBook}>
                                                    Dodaj książkę
                                                </Button>
                                            </CaptchaAndButton>
                                        </CardBodyColumn>
                                    </Card>
                                </Form>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            {formType === 'search' ? (
                                <>
                                    <Button primary onClick={handleAddNewBook}>
                                        Nie znaleziono książki? Dodaj książkę do systemu
                                    </Button>
                                    <Button onClick={clearSearchForm}>Wyczyść formularz</Button>
                                </>
                            ) : (
                                <>
                                    <Button primary onClick={handleGetBackToSearch}>Wróć do wyszukiwania</Button>
                                    <Button onClick={clearSearchForm}>Wyczyść formularz</Button>
                                </>
                            )}
                        </ModalFooter>
                    </ModalContent>
                </ModalDialog>
            </ModalWrapper>
        </Container>
    );
}

export default BookExchange;