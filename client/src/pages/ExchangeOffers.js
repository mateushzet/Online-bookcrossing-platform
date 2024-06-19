import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import UserAvatarComponent from '../components/UserAvatarComponent';
import SearchFilters from '../components/SearchFilters';
import { getDistance } from 'geolib';
import debounce from 'lodash/debounce';
import { useLocation, useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import defaultBookImage from '../assets/icons/no-book-image.webp';

const StyledContainer = styled.div`
  margin: auto;
  height: auto;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #eef2f7;
  border-radius: 1rem;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const OffersContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;

const StyledCard = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 12px 0;
  padding: 20px;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fff;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 70%;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
`;

const CardTitle = styled.h5`
  color: #333;
  margin-bottom: 15px;
  font-size: 1.25em;
`;

const CardText = styled.p`
  color: #555;
  margin-bottom: 12px;
  font-size: 1em;
  word-wrap: break-word;
  white-space: pre-wrap;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const AcceptButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #627254;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #41542b;
  }
`;

const DetailsButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #627254;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #357ab8;
  }
`;

const Header = styled.div`
  background-color: #627254;
  width: 100%;
  padding: 1rem;
  color: #fff;
  text-align: center;
  border-radius: 1rem 1rem 0 0;
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
`;

const ImagePreview = styled.img`
  width: 250px;
  height: 250px;
  cursor: pointer;
  margin-bottom: 10px;
`;

const FullSizeImageModal = styled.div`
  display: ${(props) => (props.show ? 'block' : 'none')};
  position: fixed;
  z-index: 1050;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FullSizeImage = styled.img`
  max-width: 90%;
  max-height: 90%;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 2em;
  cursor: pointer;
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
  cursor: pointer;
`;

const ExchangeOffers = () => {
    const [offers, setOffers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [authorQuery, setAuthorQuery] = useState('');
    const [exchangeDescriptionQuery, setExchangeDescriptionQuery] = useState('');
    const [bookConditionFilter, setBookConditionFilter] = useState('');
    const [genreFilter, setGenreFilter] = useState('');
    const [filteredOffers, setFilteredOffers] = useState([]);
    const [fullSizeImage, setFullSizeImage] = useState(null);
    const [maxDistance, setMaxDistance] = useState(null);
    const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });
    const [tempLocation, setTempLocation] = useState({ lat: 0, lng: 0 });
    const [cityInput, setCityInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8080/api/user/getUser')
            .then(response => {
                const location = { lat: response.data.lat, lng: response.data.lng };
                setUserLocation(location);
                if (!cityInput) {
                    setCityInput(response.data.city || '');
                }
                console.log("User location:", location);
            })
            .catch(error => console.error('Error fetching user location:', error));

        axios.get('http://localhost:8080/api/user/fetchExchanges')
            .then(response => {
                setOffers(response.data);
                setFilteredOffers(response.data);
                console.log("Fetched offers:", response.data);
            })
            .catch(error => console.error('Error fetching offers:', error));
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const title = queryParams.get('title') || '';
        const author = queryParams.get('author') || '';
        const genre = queryParams.get('genre') || '';
        const lat = parseFloat(queryParams.get('lat')) || 0;
        const lng = parseFloat(queryParams.get('lng')) || 0;
        const city = queryParams.get('city') || '';

        setSearchQuery(title);
        setAuthorQuery(author);
        setGenreFilter(genre);
        if (lat && lng) {
            setTempLocation({ lat, lng });
            reverseGeocode(lat, lng);
            setMaxDistance(5);
        } else if (city) {
            setCityInput(city);
        }
    }, [location.search]);

    const reverseGeocode = async (lat, lng) => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const city = response.data.address.city || response.data.address.town || response.data.address.village || '';
            setCityInput(city);
        } catch (error) {
            console.error("Reverse geocoding failed:", error);
        }
    };

    useEffect(() => {
        recalculateDistances();
    }, [searchQuery, authorQuery, exchangeDescriptionQuery, bookConditionFilter, genreFilter, offers, maxDistance, tempLocation]);

    const recalculateDistances = () => {
        const lowercasedSearchQuery = searchQuery ? searchQuery.toLowerCase() : '';
        const lowercasedAuthorQuery = authorQuery ? authorQuery.toLowerCase() : '';
        const lowercasedExchangeDescriptionQuery = exchangeDescriptionQuery ? exchangeDescriptionQuery.toLowerCase() : '';

        const filtered = offers.filter(offer => {
            const matchesFilters =
                (offer.title ? offer.title.toLowerCase().includes(lowercasedSearchQuery) : true) &&
                (offer.author ? offer.author.toLowerCase().includes(lowercasedAuthorQuery) : true) &&
                (offer.exchangeDescription ? offer.exchangeDescription.toLowerCase().includes(lowercasedExchangeDescriptionQuery) : true) &&
                (bookConditionFilter === '' || offer.bookCondition === bookConditionFilter) &&
                (genreFilter === '' || offer.genre === genreFilter);

            if (tempLocation.lat !== 0 && tempLocation.lng !== 0 && offer.lat !== 0 && offer.lng !== 0) {
                const distance = getDistance(tempLocation, { lat: offer.lat, lng: offer.lng }) / 1000;
                console.log(`Distance for offer ${offer.title}: ${distance} km`);
                return matchesFilters && (maxDistance === null || distance <= maxDistance);
            } else if (maxDistance === null) {
                return matchesFilters;
            } else {
                console.log(`Offer ${offer.title} does not have valid location data.`);
                return false;
            }
        });

        setFilteredOffers(filtered);
    };

    const handleAcceptOffer = (exchangeId, ownerId) => {
        axios.post('http://localhost:8080/api/user/acceptExchange', {}, {
            params: {
                exchangeId: exchangeId,
                ownerId: ownerId
            }
        })
            .then(response => {
                setOffers(offers.filter(offer => offer.exchangeId !== exchangeId));
                setSearchQuery('');
            })
            .catch(error => console.error('Error accepting offer:', error));
    };

    const handleViewBookDetails = (title, author, genre) => {
        const query = new URLSearchParams({
            title,
            author,
            genre
        }).toString();
        navigate(`/books?${query}`);
    };

    const handleViewPreferredBookDetails = (book) => {
        const query = new URLSearchParams({
            title: book.title,
            author: book.author,
            genre: book.genre
        }).toString();
        navigate(`/books?${query}`);
    };

    const uniqueBookConditions = [...new Set(offers.map(offer => offer.bookCondition))];
    const uniqueGenres = [...new Set(offers.map(offer => offer.genre))];

    const handleImageClick = (bookImage) => {
        setFullSizeImage(bookImage);
    };

    const closeModal = () => {
        setFullSizeImage(null);
    };

    const geocodeLocationByName = useCallback(
        debounce(async (cityName) => {
            try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&country=Poland&city=${cityName}`);
                if (response.data && response.data.length > 0) {
                    const location = response.data[0];
                    const lat = parseFloat(location.lat);
                    const lng = parseFloat(location.lon);
                    setTempLocation({ lat, lng });
                    setSuggestions(response.data);
                    console.log("Geocoded location:", { lat, lng });
                    return { lat, lng };
                } else {
                    setSuggestions([]);
                }
            } catch (error) {
                console.error("Geocoding failed:", error);
                setSuggestions([]);
            }
        }, 300), []
    );

    const handleCityInputChange = async (event) => {
        const value = event.target.value;
        setCityInput(value);

        if (value.length > 2) {
            geocodeLocationByName(value);
        } else {
            setSuggestions([]);
        }
    };

    const handleCitySelect = async (event) => {
        const value = event.target.value;
        const selectedOption = suggestions.find(suggestion => suggestion.display_name === value);
        if (selectedOption) {
            setCityInput(value);
            const lat = parseFloat(selectedOption.lat);
            const lng = parseFloat(selectedOption.lon);
            setTempLocation({ lat, lng });
            console.log("Selected location:", { lat, lng });
            recalculateDistances();
        }
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        setAuthorQuery('');
        setExchangeDescriptionQuery('');
        setBookConditionFilter('');
        setGenreFilter('');
        setMaxDistance(null);
        setTempLocation(userLocation);
        setCityInput('');
        setSuggestions([]);
    };

    return (
        <StyledContainer>
            <Header>
                <HeaderTitle>Dostępne oferty wymiany</HeaderTitle>
            </Header>
            <SearchFilters
                searchQuery={searchQuery}
                authorQuery={authorQuery}
                exchangeDescriptionQuery={exchangeDescriptionQuery}
                bookConditionFilter={bookConditionFilter}
                genreFilter={genreFilter}
                cityInput={cityInput}
                setSearchQuery={setSearchQuery}
                setAuthorQuery={setAuthorQuery}
                setExchangeDescriptionQuery={setExchangeDescriptionQuery}
                setBookConditionFilter={setBookConditionFilter}
                setGenreFilter={setGenreFilter}
                handleCityInputChange={handleCityInputChange}
                handleCitySelect={handleCitySelect}
                suggestions={suggestions}
                maxDistance={maxDistance}
                setMaxDistance={setMaxDistance}
                handleResetFilters={handleResetFilters}
                uniqueBookConditions={uniqueBookConditions}
                uniqueGenres={uniqueGenres}
                isFiltersExpanded={isFiltersExpanded}
                setIsFiltersExpanded={setIsFiltersExpanded}
            />
            <OffersContainer>
                {filteredOffers.map((offer, index) => (
                    <StyledCard key={index}>
                        <LeftColumn>
                            <UserAvatarComponent userId={offer.ownerId} userName={offer.ownerName} />
                            <CardTitle>{offer.title}</CardTitle>
                            <CardText as="h6">{offer.author}</CardText>
                            <CardText>{offer.genre}</CardText>
                            <CardText><strong>Stan książki:</strong> {offer.bookCondition}</CardText>
                            <CardText><strong>Preferowane książki:</strong> {offer.preferredBooksDescription}</CardText>
                            <CardText><strong>Opis wymiany:</strong> {offer.exchangeDescription}</CardText>
                            <div>
                                {offer.preferredBooksList.map((book, index) => (
                                    <Hashtag key={index} onClick={() => handleViewPreferredBookDetails(book)}>{book.title}</Hashtag>
                                ))}
                            </div>
                        </LeftColumn>
                        <RightColumn>
                            <ImagePreview src={offer.bookImage || defaultBookImage} alt="Zdjęcie książki" onClick={() => handleImageClick(offer.bookImage || defaultBookImage)} />
                            <ButtonContainer>
                                <AcceptButton onClick={() => handleAcceptOffer(offer.exchangeId, offer.ownerId)}>Akceptuj</AcceptButton>
                                <DetailsButton onClick={() => handleViewBookDetails(offer.title, offer.author, offer.genre)}>Szczegóły książki</DetailsButton>
                            </ButtonContainer>
                        </RightColumn>
                    </StyledCard>
                ))}
            </OffersContainer>

            {fullSizeImage && (
                <FullSizeImageModal show={fullSizeImage}>
                    <FullSizeImage src={fullSizeImage} alt="Pełnowymiarowe zdjęcie" />
                    <CloseButton onClick={closeModal}>&times;</CloseButton>
                </FullSizeImageModal>
            )}
        </StyledContainer>
    );
}

export default ExchangeOffers;