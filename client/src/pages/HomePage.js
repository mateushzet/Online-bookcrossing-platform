import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faExchangeAlt, faUsers } from '@fortawesome/free-solid-svg-icons';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  background-color: #FFFFFF;
  border-radius: 1rem;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.div`
  background-color: #627254;
  padding: 2rem;
  color: #fff;
  text-align: center;
  border-radius: 1rem 1rem 0 0;
  flex-shrink: 0;
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  margin: 0;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto; 
  padding: 2rem;
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
  color: black;
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
  color: black;
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

function Home() {
    const images = Array.from({ length: 14 }, (_, i) => `/photo-books-${i + 1}.webp`);

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
                        <Description>Przeglądaj szeroki wybór książek dostępnych do wymiany i znajdź swoje ulubione tytuły.</Description>
                    </Feature>
                    <Feature>
                        <Icon><FontAwesomeIcon icon={faExchangeAlt} /></Icon>
                        <Title>Wymieniaj</Title>
                        <Description>Wymieniaj swoje książki z innymi czytelnikami i odkrywaj nowe fascynujące pozycje.</Description>
                    </Feature>
                    <Feature>
                        <Icon><FontAwesomeIcon icon={faUsers} /></Icon>
                        <Title>Społeczność</Title>
                        <Description>Połącz się z osobami o podobnych zainteresowaniach i dziel się pasją do książek.</Description>
                    </Feature>
                </FeaturesContainer>
                <CenteredContainer>
                    <ActionButton href="/exchangeOffers">Przeglądaj Wymiany</ActionButton>
                    <ActionButton href="/bookExchange">Utwórz Ofertę Wymiany</ActionButton>
                </CenteredContainer>
            </Content>
        </Container>
    );
}

export default Home;