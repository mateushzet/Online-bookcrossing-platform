import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import UserAvatarComponent from '../components/UserAvatarComponent';
import { ToggleButton, ToggleButtonGroup, Rating, Tooltip } from '@mui/material';
import { HourglassEmpty } from '@mui/icons-material';
import defaultBookImage from "../assets/icons/no-book-image.webp";
import {useNavigate} from "react-router-dom";

function ExchangeOffers({ onSelectOffer, setIsCollapsed, isCollapsed, setTab, resetRightPanel }) {
    const [offers, setOffers] = useState([]);
    const [endpoint, setEndpoint] = useState('fetchAcceptedExchanges');
    const [activeButton, setActiveButton] = useState('fetchAcceptedExchanges');

    useEffect(() => {
        axios.get(`http://localhost:8080/api/user/${endpoint}`)
            .then(response => {
                setOffers(response.data);
            })
            .catch(error => console.error('Error fetching offers:', error));
    }, [endpoint]);

    return (
        <>
            <FixedButtonContainer isCollapsed={isCollapsed}>
                <StyledButton
                    active={activeButton === 'fetchMyExchanges'}
                    onClick={() => {
                        setEndpoint('fetchMyExchanges');
                        setTab('fetchMyExchanges');
                        setActiveButton('fetchMyExchanges');
                        resetRightPanel();
                    }}
                >
                    Moje oferty
                </StyledButton>
                <StyledButton
                    active={activeButton === 'fetchAcceptedExchanges'}
                    onClick={() => {
                        setEndpoint('fetchAcceptedExchanges');
                        setTab('fetchAcceptedExchanges');
                        setActiveButton('fetchAcceptedExchanges');
                        resetRightPanel();
                    }}
                >
                    Zaakceptowane oferty
                </StyledButton>
            </FixedButtonContainer>
            <ScrollableContainer>
                <StyledContainer>
                    {offers.length === 0 ? (
                        <NoOffersMessage>Brak ofert wymiany</NoOffersMessage>
                    ) : (
                        offers.map((offer, index) => (
                            <StyledCard key={index}>
                                <CardBody onClick={() => onSelectOffer(offer, endpoint)}>
                                    <UserAvatarComponent userId={offer.ownerId} userName={offer.ownerName} />
                                    <CardTitle>{offer.title}</CardTitle>
                                    <CardText as="h6">{offer.author}</CardText>
                                    <CardText>{offer.genre}</CardText>
                                </CardBody>
                            </StyledCard>
                        ))
                    )}
                </StyledContainer>
            </ScrollableContainer>
        </>
    );
}

const Messages = ({
                      exchangeId, ownerId, fetchOfferDetails, selectedUser, setSelectedUser,
                      messages, setMessages, scrollToBottom, messagesEndRef, tab
                  }) => {
    const [users, setUsers] = useState([]);
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [initialLoad, setInitialLoad] = useState(true);
    const [prevSelectedUser, setPrevSelectedUser] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/user/participants/${exchangeId}`, {
            params: { ownerId }
        })
            .then(response => {
                setUsers(Array.isArray(response.data) ? response.data : []);
                const initialUser = response.data[0]?.userId || '';
                setSelectedUser(initialUser);
                console.log('Initial selectedUser set:', initialUser);
            })
            .catch(error => setError('Error fetching users: ' + error.message));
    }, [exchangeId, ownerId, setSelectedUser]);

    useEffect(() => {
        if (selectedUser && selectedUser !== prevSelectedUser) {
            setPrevSelectedUser(selectedUser);
            axios.get(`http://localhost:8080/api/user/messages/${exchangeId}`, {
                params: { userId: selectedUser, ownerId }
            })
                .then(response => {
                    setMessages(response.data);
                    if (initialLoad) {
                        setTimeout(scrollToBottom, 0);
                        setInitialLoad(false);
                    }
                })
                .catch(error => setError('Error fetching messages: ' + error.message));

            fetchOfferDetails(exchangeId, ownerId, selectedUser);
            console.log('Fetching offer details for selectedUser:', selectedUser);
        }
    }, [exchangeId, selectedUser, ownerId, fetchOfferDetails, setMessages, initialLoad, prevSelectedUser, scrollToBottom]);

    const handleSendMessage = () => {
        if (!content.trim()) {
            return;
        }

        axios.post(`http://localhost:8080/api/user/sendMessage`, {
            exchangeId, content, senderId: ownerId, receiverId: selectedUser
        })
            .then(response => {
                setMessages(prevMessages => {
                    const updatedMessages = [...prevMessages, response.data];
                    setTimeout(scrollToBottom, 0);
                    return updatedMessages;
                });
                setContent('');
                fetchMessages(selectedUser);
            })
            .catch(error => setError('Error sending message: ' + error.message));
    };

    const fetchMessages = (selectedUser) => {
        axios.get(`http://localhost:8080/api/user/messages/${exchangeId}`, {
            params: { userId: selectedUser, ownerId }
        })
            .then(response => setMessages(response.data))
            .catch(error => setError('Error fetching messages: ' + error.message));
    };

    const handleKeyPress = event => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleUserChange = (e) => {
        const newSelectedUser = e.target.value;
        setSelectedUser(newSelectedUser);
        setInitialLoad(true);
        console.log('User selected from dropdown:', newSelectedUser);
    };

    const isStageChangeMessage = (message) => {
        return message.content.includes('Zmieniono status wymiany:');
    };

    return (
        <MessagesContainer>
            {users.length === 0 ? (
                <NoOffersMessage>Jeszcze nikt nie zaakceptował twojej oferty</NoOffersMessage>
            ) : (
                <>
                    <Label>Adresat</Label>
                    <UserSelect
                        value={selectedUser}
                        onChange={handleUserChange}
                    >
                        {users.map(user => (
                            <option key={user.userId} value={user.userId}>
                                {user.username}
                            </option>
                        ))}
                    </UserSelect>
                    <MessagesList>
                        {messages.map((msg, index) => (
                            <MessageItem key={index} isStageChange={isStageChangeMessage(msg)}>
                                <MessageContent>{msg.content}</MessageContent>
                                <MessageMeta>
                                    Użytkownik: {msg.senderUsername}, wysłano: {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : "just now"}
                                </MessageMeta>
                            </MessageItem>
                        ))}
                        <div ref={messagesEndRef} />
                    </MessagesList>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <MessageInputContainer>
                        <MessageInput
                            type="text"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Wpisz swoją wiadomość..."
                        />
                        <SendButton
                            onClick={handleSendMessage}
                            disabled={!content.trim()}
                        >
                            Wyślij
                        </SendButton>
                    </MessageInputContainer>
                </>
            )}
        </MessagesContainer>
    );
};

const SelectedOfferCard = ({ offer, onCancelExchange, onDeleteExchange, tab }) => {
    const [isClicked, setIsClicked] = useState(false);
    const [fullSizeImage, setFullSizeImage] = useState(null);
    const navigate = useNavigate();

    const handleImageClick = (image) => {
        setFullSizeImage(image);
        setIsClicked(true);
    };

    if (!offer) return null;

    const handleTagClick = (book) => {
        const query = new URLSearchParams({
            title: book.title,
            author: book.author,
            genre: book.genre
        }).toString();
        navigate(`/books?${query}`);
    };

    return (
        <SelectedStyledCard>
            <CardBody>
                <ImagePreview src={offer.bookImage || defaultBookImage} alt="Book Image" onClick={() => handleImageClick(offer.bookImage || defaultBookImage)} />
                <CardTitle>{offer.title}</CardTitle>
                <CardText as="h6">{offer.author}</CardText>
                <CardText>{offer.genre}</CardText>
                <CardText><strong>Stan książki:</strong> {offer.bookCondition}</CardText>
                <CardText style={{ wordWrap: 'break-word' }}><strong>Opis wymiany:</strong> {offer.exchangeDescription}</CardText>
                <CardText style={{ wordWrap: 'break-word' }}><strong>Preferowane książki:</strong> {offer.preferredBooksDescription}</CardText>
                {offer.preferredBooksList && offer.preferredBooksList.length > 0 && (
                    <div>
                        <TagDiv>
                            {offer.preferredBooksList.map((book) => (
                                <Tag key={book.bookId} onClick={() => handleTagClick(book)}>{book.title}</Tag>
                            ))}
                        </TagDiv>
                    </div>
                )}
            </CardBody>
            {isClicked && fullSizeImage && (
                <ModalWrapper show={isClicked}>
                    <ModalDialog>
                        <ModalContent>
                            <ModalHeader>
                                <ModalTitle>Pełny rozmiar obrazu</ModalTitle>
                                <Button onClick={() => setIsClicked(false)}>Zamknij</Button>
                            </ModalHeader>
                            <ModalBody>
                                <img src={fullSizeImage} alt="Full Size Book" style={{ width: '100%' }} />
                            </ModalBody>
                        </ModalContent>
                    </ModalDialog>
                </ModalWrapper>
            )}
        </SelectedStyledCard>
    );
};

const StageSwitch = ({
                         currentStage, setCurrentStage, rating, setRating, offerId, ownerId,
                         selectedUser, disabled, setMessages, scrollToBottom, ownerStage, requesterStage,
                         tab, setOwnerStage, setRequesterStage, ownerUsername, selectedUsername
                     }) => {
    const stages = ['Negocjacje', 'W trakcie wymiany', 'Zakończono'];

    useEffect(() => {
        if (selectedUser) {
            console.log('Selected user changed:', selectedUser);
        }
    }, [selectedUser]);

    const handleStageChange = async (event, newStage) => {
        if (newStage !== null) {
            const isValidTransition = (current, newStage) => {
                if (newStage === 3) {
                    return current === 2 || current === 3;
                }
                if (newStage === 2) {
                    return current === 1 || current === 2;
                }
                if (newStage === 1) {
                    return current === 1 || current === 2;
                }
                return false;
            };

            if (
                isValidTransition(ownerStage, newStage) &&
                isValidTransition(requesterStage, newStage)
            ) {
                setCurrentStage(newStage);
                console.log('Updating stage for selectedUser:', selectedUser);
                try {
                    await axios.post(`http://localhost:8080/api/user/updateStage`, null, {
                        params: {
                            exchangeId: offerId,
                            ownerId: ownerId,
                            selectedUser: selectedUser,
                            stage: newStage
                        },
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    const stageNames = ['Negocjacje', 'W trakcie wymiany', 'Zakończono'];
                    const content = `Zmieniono status wymiany: ${stageNames[newStage - 1]}`;
                    const newMessage = {
                        content,
                        senderId: ownerId,
                        senderUsername: ownerUsername,
                        receiverId: selectedUser,
                        timestamp: new Date().toISOString()
                    };

                    if (tab === 'fetchAcceptedExchanges') {
                        setRequesterStage(newStage);
                    } else {
                        setOwnerStage(newStage);
                    }

                    await axios.post(`http://localhost:8080/api/user/sendMessage`, {
                        exchangeId: offerId,
                        content: newMessage.content,
                        senderId: newMessage.senderId,
                        receiverId: newMessage.receiverId
                    });

                    setMessages(prevMessages => {
                        const updatedMessages = [...prevMessages, newMessage];
                        setTimeout(scrollToBottom, 0);
                        return updatedMessages;
                    });

                } catch (error) {
                    console.error('Error updating stage:', error);
                }
            }
        }
    };

    const handleRatingChange = async (event, newValue) => {
        const updatedRating = newValue || 0;
        setRating(updatedRating);
        console.log('Updating rating for selectedUser:', selectedUser);
        try {
            await axios.post(`http://localhost:8080/api/user/updateRating`, null, {
                params: {
                    exchangeId: offerId,
                    ownerId: ownerId,
                    selectedUser: selectedUser,
                    rating: updatedRating
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Error updating rating:', error);
        }
    };

    const displayedStage = tab === 'fetchMyExchanges' ? ownerStage : requesterStage;
    const displayedRating = tab === 'fetchMyExchanges' ? rating : rating;

    return (
        <div style={{ marginTop: '20px', width: '100%' }}>
            <ToggleButtonGroup
                orientation="vertical"
                value={disabled ? null : displayedStage}
                exclusive
                onChange={handleStageChange}
                fullWidth
                disabled={disabled}
            >
                {stages.map((stage, index) => {
                    const canChangeStage = (
                        index + 1 === 1 && (ownerStage === 1 || ownerStage === 2) && (requesterStage === 1 || requesterStage === 2)
                    ) || (
                        index + 1 === 2 && (ownerStage === 2 || ownerStage === 1) && (requesterStage === 2 || requesterStage === 1)
                    ) || (
                        index + 1 === 3 && (ownerStage === 2 || ownerStage === 3) && (requesterStage === 2 || requesterStage === 3)
                    );

                    const showHourglass = ownerStage !== requesterStage && index + 1 === displayedStage;

                    return (
                        <ToggleButtonStyled key={index} value={index + 1} disabled={!canChangeStage}>
                            {stage}
                            {showHourglass && (
                                <Tooltip title={ownerStage < requesterStage ? "Oczekiwanie na zmianę etapu przez właściciela oferty" : "Oczekiwanie na zmianę etapu przez zainteresowanego ofertą"}>
                                    <HourglassEmpty style={{ marginLeft: '10px' }} />
                                </Tooltip>
                            )}
                        </ToggleButtonStyled>
                    );
                })}
            </ToggleButtonGroup>
            {currentStage === 3 && (
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                    <Rating
                        name="rating"
                        value={displayedRating}
                        onChange={handleRatingChange}
                        disabled={disabled}
                    />
                    {displayedRating === 0 && <div style={{ marginTop: '10px', color: 'black' }}>Proszę ocenić przebieg wymiany</div>}
                </div>
            )}
        </div>
    );
};

function AcceptedExchanges() {
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [currentStage, setCurrentStage] = useState(1);
    const [rating, setRating] = useState(0);
    const [ownerId, setOwnerId] = useState(null);
    const [ownerUsername, setOwnerUsername] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedUsername, setSelectedUsername] = useState('');
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [ownerStage, setOwnerStage] = useState(1);
    const [requesterStage, setRequesterStage] = useState(1);
    const [tab, setTab] = useState('fetchAcceptedExchanges');
    const messagesEndRef = useRef(null);
    const [isClicked, setIsClicked] = useState(false);
    const [fullSizeImage, setFullSizeImage] = useState(null);
    const [offers, setOffers] = useState([]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    };

    const resetRightPanel = () => {
        setSelectedOffer(null);
        setUsers([]);
        setMessages([]);
        setOwnerId(null);
        setSelectedUser('');
        setCurrentStage(1);
        setRating(0);
        setOwnerStage(1);
        setRequesterStage(1);
    };

    const fetchOfferDetails = (exchangeId, ownerId, selectedUser) => {
        console.log('Fetching offer details for selectedUser:', selectedUser);
        axios.get(`http://localhost:8080/api/user/offerDetails`, {
            params: { exchangeId, ownerId, selectedUser }
        })
            .then(response => {
                console.log('Fetched offer details for selectedUser:', selectedUser);
                if (tab === 'fetchAcceptedExchanges') {
                    setCurrentStage(response.data.stageRequester);
                } else {
                    setCurrentStage(response.data.stageOwner);
                }
                setOwnerStage(response.data.stageOwner);
                setRequesterStage(response.data.stageRequester);
                if (tab === 'fetchAcceptedExchanges') {
                    setRating(response.data.starsRequester || 0);
                } else {
                    setRating(response.data.starsOwner || 0);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching offer details:', error);
                setLoading(false);
            });
    };

    const handleSelectOffer = (offer) => {
        setLoading(true);
        setSelectedOffer(offer);
        setOwnerId(offer.ownerId);
        setOwnerUsername(offer.ownerName);
        axios.get(`http://localhost:8080/api/user/participants/${offer.exchangeId}`, {
            params: { ownerId: offer.ownerId }
        })
            .then(response => {
                setUsers(Array.isArray(response.data) ? response.data : []);
                const userId = response.data[0]?.userId || '';
                const username = response.data[0]?.username || '';
                setSelectedUser(userId);
                setSelectedUsername(username);
                console.log('Initial selectedUser set:', userId);
                fetchOfferDetails(offer.exchangeId, offer.ownerId, userId);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (users.length === 0) {
            setCurrentStage(null);
        }
    }, [users]);

    useEffect(() => {
        if (selectedUser && selectedOffer) {
            console.log('Selected user changed:', selectedUser);
            fetchOfferDetails(selectedOffer.exchangeId, ownerId, selectedUser);
        }
    }, [selectedUser]);

    const handleCancelExchange = (exchangeId, ownerId) => {
        axios.post(`http://localhost:8080/api/user/cancelExchange`, null, {
            params: { exchangeId, ownerId, selectedUser }
        })
            .then(response => {
                console.log('Exchange canceled:', response.data);
                setOffers(prevOffers => prevOffers.filter(offer => offer.exchangeId !== exchangeId));
            })
            .catch(error => {
                console.error('Error canceling exchange:', error);
            });
    };

    const handleDeleteExchange = (exchangeId, ownerId) => {
        axios.post(`http://localhost:8080/api/user/deleteExchange`, null, {
            params: { exchangeId, ownerId }
        })
            .then(response => {
                console.log('Exchange deleted:', response.data);
                setSelectedOffer(null);
                setOffers(prevOffers => prevOffers.filter(offer => offer.exchangeId !== exchangeId));
            })
            .catch(error => {
                console.error('Error deleting exchange:', error);
            });
    };

    const handleImageClick = (image) => {
        setFullSizeImage(image);
        setIsClicked(true);
    };

    return (
        <PageLayout>
            <LeftPane isCollapsed={isCollapsed}>
                <ExchangeOffers onSelectOffer={handleSelectOffer} setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} setTab={setTab} resetRightPanel={resetRightPanel} />
            </LeftPane>
            <ToggleButtonContainer>
                <ToggleButton onClick={() => setIsCollapsed(!isCollapsed)} >
                    {isCollapsed ? '>>' : '<<'}
                </ToggleButton>
            </ToggleButtonContainer>
            <MiddlePane isCollapsed={isCollapsed}>
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    selectedOffer ? (
                        <Messages
                            exchangeId={selectedOffer.exchangeId}
                            ownerId={selectedOffer.ownerId}
                            fetchOfferDetails={fetchOfferDetails}
                            selectedUser={selectedUser}
                            setSelectedUser={setSelectedUser}
                            messages={messages}
                            setMessages={setMessages}
                            scrollToBottom={scrollToBottom}
                            messagesEndRef={messagesEndRef}
                            tab={tab}
                        />
                    ) : (
                        <div>Select an offer to start chatting</div>
                    )
                )}
            </MiddlePane>
            <RightPane>
                <SelectedOfferCard offer={selectedOffer} tab={tab} />
                <StageSwitch
                    currentStage={currentStage}
                    setCurrentStage={setCurrentStage}
                    rating={rating}
                    setRating={setRating}
                    offerId={selectedOffer?.exchangeId}
                    ownerId={ownerId}
                    selectedUser={selectedUser}
                    disabled={users.length === 0}
                    setMessages={setMessages}
                    scrollToBottom={scrollToBottom}
                    ownerStage={ownerStage}
                    requesterStage={requesterStage}
                    tab={tab}
                    setOwnerStage={setOwnerStage}
                    setRequesterStage={setRequesterStage}
                    ownerUsername={ownerUsername}
                    selectedUsername={selectedUsername}
                />
                <StyledButton onClick={() => handleCancelExchange(selectedOffer.exchangeId, selectedOffer.ownerId)} disabled={!selectedOffer}>Anuluj wymianę</StyledButton>
                <StyledButton onClick={() => handleDeleteExchange(selectedOffer.exchangeId, selectedOffer.ownerId)} disabled={tab === 'fetchAcceptedExchanges' || !selectedOffer}>
                    Usuń ofertę
                </StyledButton>
            </RightPane>
        </PageLayout>
    );
}

export default AcceptedExchanges;

const PageLayout = styled.div`
  width: 100%;
  display: flex;
  height: 100%;
  background-color: #f0f2f5;
  font-family: 'Arial', sans-serif;
`;

const LeftPane = styled.div`
  width: ${({ isCollapsed }) => (isCollapsed ? '0%' : '20%')};
  border-right: 1px solid #ddd;
  overflow-y: ${({ isCollapsed }) => (isCollapsed ? 'hidden' : 'scroll')};
  background-color: #f8f9fa;
  flex-direction: column;
  align-items: center;
  transition: width 0.3s ease;
  position: relative;
`;

const MiddlePane = styled.div`
  width: ${({ isCollapsed }) => (isCollapsed ? '100%' : '60%')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: width 0.3s ease;
  padding: 20px;
`;

const RightPane = styled.div`
  width: 20%;
  border-left: 1px solid #ddd;
  overflow-y: scroll;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const ToggleButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  height: 10%;
  margin: auto;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  margin: 5px;
  margin-top: 20px;
  margin-bottom: 0px;
  font-size: 16px;
  background-color: ${({ active }) => (active ? '#41542b' : '#627254')};
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #41542b;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ToggleButtonStyled = styled(ToggleButton)`
  && {
    width: 100%;
  }
`;

const StyledCard = styled.div`
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 12px;
  width: 320px;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  background-color: #fff;
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`;

const SelectedStyledCard = styled.div`
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
  border-radius: 10px;
  width: 100%;
  background-color: #fff;
  transition: transform 0.2s;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  height: 100%;
  width: 100%;
`;

const CardTitle = styled.h5`
  color: #333;
  margin-bottom: 15px;
  font-size: 1.25em;
  text-align: center;
  word-wrap: break-word;
`;

const CardText = styled.p`
  color: #555;
  margin-bottom: 12px;
  text-align: center;
  font-size: 1em;
  width: 100%;
  word-wrap: break-word;
`;

const NoOffersMessage = styled.div`
  color: #999;
  font-size: 16px;
  text-align: center;
  margin-top: 20px;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 0.3s linear infinite;
  margin: auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 80vh;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const MessagesList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
`;

const MessageItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  background-color: ${({ isStageChange }) => (isStageChange ? '#f0f0f0' : 'transparent')};
  &:last-child {
    border-bottom: none;
  }
`;

const MessageContent = styled.div`
  font-size: 14px;
  margin-bottom: 5px;
  color: black;
`;

const MessageMeta = styled.div`
  font-size: 12px;
  color: #999;
`;

const MessageInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-right: 10px;
`;

const SendButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
`;

const UserSelect = styled.select`
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  color: grey;
`;

const FixedButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  background-color: #f8f9fa;
  position: sticky;
  top: 0;
  z-index: 1;
  padding: ${({ isCollapsed }) => (isCollapsed ? '0' : '10px')};
  transition: padding 0.3s ease;
`;

const ScrollableContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: #eef2f7;
  transition: padding 0.3s ease;
`;

const StyledContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 800px;
  border-radius: 10px;
  background-color: #eef2f7;
`;

const Tag = styled.span`
  display: inline-block;
  background-color: #4caf50;
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
  margin: 2px;
  cursor: pointer;
`;

const TagDiv = styled.div`
  justify-content: center;
  align-items: center;
`;

const ImagePreview = styled.img`
  width: 150px;
  height: 150px;
  cursor: pointer;
  margin-bottom: 10px;
`;

const ModalWrapper = styled.div`
  display: ${({ show }) => (show ? 'block' : 'none')};
  position: fixed;
  z-index: 1050;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalDialog = styled.div`
  position: relative;
  width: auto;
  margin: 10px;
  pointer-events: none;
  max-width: 500px;
  margin: 100px auto; 
`;

const ModalContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
  outline: 0;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
`;

const ModalTitle = styled.h5`
  margin-bottom: 0;
  line-height: 1.5;
`;

const ModalBody = styled.div`
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  background-color: #4caf50;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;