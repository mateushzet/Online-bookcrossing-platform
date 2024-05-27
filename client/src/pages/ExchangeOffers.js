import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import UserAvatarComponent from '../components/UserAvatarComponent';
import SearchFilters from '../components/SearchFilters';

const StyledContainer = styled.div`
  max-width: 1200px;
  margin: auto;
  height: 100%;
  width: 100%;
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

const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  text-align: left;
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
`;

const AcceptButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  max-width: 40%;
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
  max-width: 250px;
  max-height: 250px;
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

function ExchangeOffers() {
    const [offers, setOffers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [authorQuery, setAuthorQuery] = useState('');
    const [exchangeDescriptionQuery, setExchangeDescriptionQuery] = useState('');
    const [bookConditionFilter, setBookConditionFilter] = useState('');
    const [genreFilter, setGenreFilter] = useState('');
    const [filteredOffers, setFilteredOffers] = useState([]);
    const [fullSizeImage, setFullSizeImage] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/user/fetchExchanges`)
            .then(response => {
                setOffers(response.data);
                setFilteredOffers(response.data);
            })
            .catch(error => console.error('Error fetching offers:', error));
    }, []);

    useEffect(() => {
        const lowercasedSearchQuery = searchQuery.toLowerCase();
        const lowercasedAuthorQuery = authorQuery.toLowerCase();
        const lowercasedExchangeDescriptionQuery = exchangeDescriptionQuery.toLowerCase();
        const filtered = offers.filter(offer =>
            offer.title.toLowerCase().includes(lowercasedSearchQuery) &&
            offer.author.toLowerCase().includes(lowercasedAuthorQuery) &&
            offer.exchangeDescription.toLowerCase().includes(lowercasedExchangeDescriptionQuery) &&
            (bookConditionFilter === '' || offer.bookCondition === bookConditionFilter) &&
            (genreFilter === '' || offer.genre === genreFilter)
        );
        setFilteredOffers(filtered);
    }, [searchQuery, authorQuery, exchangeDescriptionQuery, bookConditionFilter, genreFilter, offers]);

    const handleAcceptOffer = (exchangeId, ownerId) => {
        axios.post(`http://localhost:8080/api/user/acceptExchange`, {}, {
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

    const uniqueBookConditions = [...new Set(offers.map(offer => offer.bookCondition))];
    const uniqueGenres = [...new Set(offers.map(offer => offer.genre))];

    const handleImageClick = (bookImage) => {
        setFullSizeImage(bookImage);
    };

    const closeModal = () => {
        setFullSizeImage(null);
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
                setSearchQuery={setSearchQuery}
                setAuthorQuery={setAuthorQuery}
                setExchangeDescriptionQuery={setExchangeDescriptionQuery}
                setBookConditionFilter={setBookConditionFilter}
                setGenreFilter={setGenreFilter}
                uniqueBookConditions={uniqueBookConditions}
                uniqueGenres={uniqueGenres}
            />
            <OffersContainer>
                {filteredOffers.map((offer, index) => (
                    <StyledCard key={index}>
                        <CardHeader>
                            <UserAvatarComponent userId={offer.ownerId} userName={offer.ownerName} />
                        </CardHeader>
                        <CardBody>
                            <CardTitle>{offer.title}</CardTitle>
                            <CardText as="h6">{offer.author}</CardText>
                            <CardText>{offer.genre}</CardText>
                            <CardText><strong>Stan książki:</strong> {offer.bookCondition}</CardText>
                            <CardText><strong>Preferowane książki:</strong> {offer.exchangeDescription}</CardText>
                            <AcceptButton onClick={() => handleAcceptOffer(offer.exchangeId, offer.ownerId)}>Akceptuj</AcceptButton>

                        </CardBody>
                        <div>
                            {offer.bookImage && (
                                <>
                                    <ImagePreview src={offer.bookImage} alt="Zdjęcie książki" onClick={() => handleImageClick(offer.bookImage)} />
                                </>
                            )}
                        </div>
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
