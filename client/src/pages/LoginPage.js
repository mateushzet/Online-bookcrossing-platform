import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faExchangeAlt, faUsers } from '@fortawesome/free-solid-svg-icons';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Modal, Button, Form, Alert, Card, Container as BootstrapContainer } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  width: 100%;
  margin: auto;
  max-width: 1200px;
  background-color: #FFFFFF;
  border-radius: 1rem;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-align: center;
  display: flex;
  margin-top: 1%;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.div`
  background-color: #627254;
  padding: 2rem;
  color: #fff;
  text-align: center;
  border-radius: 1rem 1rem 0 0;
  flex-shrink: 0; /* Prevents shrinking */
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  margin: 0;
`;

const Content = styled.div`
  flex: 1; /* Allow this section to grow and take remaining space */
  overflow-y: auto; /* Make this section scrollable */
  padding: 2rem; /* Padding for content */
`;

const CarouselContainer = styled.div`
  text-align: center;
  margin: 2rem 0;
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 1rem;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const WelcomeText = styled.p`
  font-size: 1.2rem;
  color: #76885B;
  text-align: center;
  margin: 2rem 0;
`;

const FeaturesContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Feature = styled.div`
  text-align: center;
  width: 30%;
  min-width: 200px;
  margin-bottom: 1rem;
`;

const Icon = styled.div`
  font-size: 3rem;
  color: #76885B;
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #627254;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #76885B;
`;

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

const ActionButton = styled.a`
  background-color: #76885B;
  color: #EEE;
  border-radius: 0.25rem;
  padding: 1rem 2rem;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 1rem;
  display: inline-block;

  &:hover {
    color: #EEE;
    background-color: #627254;
  }
`;

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 1024 },
        items: 3,
        slidesToSlide: 1,
    },
    desktop: {
        breakpoint: { max: 1024, min: 800 },
        items: 3,
        slidesToSlide: 1,
    },
    tablet: {
        breakpoint: { max: 800, min: 464 },
        items: 2,
        slidesToSlide: 1,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1,
    },
};

function LoginPage() {
    const [showLogin, setShowLogin] = useState(false);

    const handleShowLogin = () => setShowLogin(true);
    const handleCloseLogin = () => setShowLogin(false);

    const images = Array.from({ length: 11 }, (_, i) => `/photo-books-${i + 1}.jpg`);

    return (
        <Container>
            <Header>
                <HeaderTitle>Witaj w Online Bookcrossing Platform</HeaderTitle>
            </Header>
            <Content>
                <CarouselContainer>
                    <Carousel
                        responsive={responsive}
                        showDots={false}
                        infinite={true}
                        autoPlay={true}
                        autoPlaySpeed={2500}
                        keyBoardControl={true}
                        customTransition="transform 1s ease-in-out"
                        transitionDuration={1000}
                        containerClass="carousel-container"
                        removeArrowOnDeviceType={["tablet", "mobile"]}
                        deviceType="desktop"
                        dotListClass="custom-dot-list-style"
                        itemClass="carousel-item-padding-40-px"
                    >
                        {images.map((src, index) => (
                            <Image key={index} src={src} alt={`Books ${index + 1}`} />
                        ))}
                    </Carousel>
                </CarouselContainer>
                <WelcomeText>
                    Odkrywaj nowe historie i dziel się swoimi własnymi z naszą społecznością wymiany książek. Czy szukasz nowych przygód, chcesz się czegoś nauczyć, czy po prostu chcesz zrobić trochę miejsca na półkach, trafiłeś w odpowiednie miejsce.
                </WelcomeText>
                <FeaturesContainer>
                    <Feature>
                        <Icon><FontAwesomeIcon icon={faBookOpen} /></Icon>
                        <Title>Odkrywaj</Title>
                        <Description>Przeglądaj szeroki wybór książek dostępnych do wymiany.</Description>
                    </Feature>
                    <Feature>
                        <Icon><FontAwesomeIcon icon={faExchangeAlt} /></Icon>
                        <Title>Wymieniaj</Title>
                        <Description>Wymieniaj się swoimi książkami z innymi czytelnikami i odkrywaj nowe ulubione pozycje.</Description>
                    </Feature>
                    <Feature>
                        <Icon><FontAwesomeIcon icon={faUsers} /></Icon>
                        <Title>Społeczność</Title>
                        <Description>Połącz się z osobami o podobnych zainteresowaniach czytelniczych i podziel się swoją pasją do książek.</Description>
                    </Feature>
                </FeaturesContainer>
                <CenteredContainer>
                    <ActionButton onClick={handleShowLogin}>Zaloguj się</ActionButton>
                </CenteredContainer>
            </Content>

            <LoginModal show={showLogin} handleClose={handleCloseLogin} />
        </Container>
    );
}

function LoginModal({ show, handleClose }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            if (!username || !password) {
                setError('Please enter both username and password.');
                return;
            }

            const response = await axios.post('http://localhost:8080/auth/signin', { username, password });

            console.log('Login successful:', response.data);
            localStorage.setItem('token', response.data.jwt);
            if (response.data.jwt) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.jwt}`;
            }
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 401) {
                setError('Account is not active. Please check your email box.');
            } else {
                setError('Invalid username or password.');
            }
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form>
                    <Form.Group className="mb-3" controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="button" onClick={handleLogin} className="w-100">
                        Sign In
                    </Button>
                </Form>
                <div className="mt-3 text-center">
                    <p>Not a member? <a href="/signup">Register now</a></p>
                </div>
                <div className="mt-3 text-center">
                    <p>Forgot password? <a href="/forgotPassword">Reset password</a></p>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default LoginPage;
