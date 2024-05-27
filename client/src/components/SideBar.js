import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import isAdminRole from "../utils/IsAdminRole";
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faExchangeAlt, faBook, faBookmark, faUserShield, faUser, faSignOutAlt, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import UserProfile from '../pages/UserProfile';

const SidebarContainer = styled.aside`
  width: ${({ isCollapsed }) => (isCollapsed ? '60px' : '250px')};
  height: 100%;
  background: #333;
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: width 0.3s ease;
  overflow: hidden;
`;

const GreenBar = styled.div`
  background-color: #627254;
  color: #fff;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;
`;

const SidebarHeader = styled.div`
  color: #fff;
  text-align: center;
  font-size: 1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  width: ${({ isCollapsed }) => (isCollapsed ? '80px' : '250px')};
  transition: width 0.3s ease;
`;

const SidebarLink = styled(Nav.Link)`
  color: #fff;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  text-decoration: none;
  justify-content: flex-start;
  transition: padding 0.3s ease;
  height: 50px; /* Fixed height to prevent vertical movement */
  &:hover, &:focus {
    color: #ccc;
    background-color: #222;
    text-decoration: none;
    transition: background-color 0.3s;
  }
  &.active {
    color: #ccc;
    background-color: #222;
  }
`;

const Icon = styled(FontAwesomeIcon)`
  margin-right: 10px;
  transition: margin-right 0.3s ease;
  min-width: 20px; /* Ensure icons have a fixed space */
`;

const LinkText = styled.span`
  display: inline-block;
  opacity: ${({ isCollapsed }) => (isCollapsed ? '0' : '1')};
  width: ${({ isCollapsed }) => (isCollapsed ? '0' : 'auto')};
  overflow: hidden;
  white-space: nowrap;
  transition: opacity 0.3s ease, width 0.3s ease;
`;

const BottomLinks = styled.div`
  padding-bottom: 60px;
`;

const ToggleButton = styled.button`
  background: #444;
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 20px;
  right: ${({ collapsed }) => (collapsed ? '-20px' : '-20px')}; // Ensure it protrudes when collapsed
  transition: right 0.3s;
  &:hover, &:focus {
    color: #ccc;
  }
`;

const SideBar = ({ isCollapsed, onToggleCollapse }) => {
    const [showProfile, setShowProfile] = useState(false);

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <SidebarContainer isCollapsed={isCollapsed}>
            <div>
                <GreenBar>
                    <SidebarHeader isCollapsed={isCollapsed}>
                        {isCollapsed ? (
                            'OBP'
                        ) : (
                            'Online Bookcrossing Platform'
                        )}
                    </SidebarHeader>
                </GreenBar>
                <Nav className="flex-column" style={{ width: '100%' }}>
                    <SidebarLink as={NavLink} to="/" activeClassName="active" isCollapsed={isCollapsed}>
                        <Icon icon={faHome} /> <LinkText isCollapsed={isCollapsed}>Strona główna</LinkText>
                    </SidebarLink>
                    <SidebarLink as={NavLink} to="/exchangeOffers" activeClassName="active" isCollapsed={isCollapsed}>
                        <Icon icon={faExchangeAlt} /> <LinkText isCollapsed={isCollapsed}>Dostępne wymiany</LinkText>
                    </SidebarLink>
                    <SidebarLink as={NavLink} to="/bookExchange" activeClassName="active" isCollapsed={isCollapsed}>
                        <Icon icon={faBookmark} /> <LinkText isCollapsed={isCollapsed}>Utwórz wymianę</LinkText>
                    </SidebarLink>
                    <SidebarLink as={NavLink} to="/books" activeClassName="active" isCollapsed={isCollapsed}>
                        <Icon icon={faBook} /> <LinkText isCollapsed={isCollapsed}>Baza książek</LinkText>
                    </SidebarLink>
                    <SidebarLink as={NavLink} to="/acceptedExchanges" activeClassName="active" isCollapsed={isCollapsed}>
                        <Icon icon={faExchangeAlt} /> <LinkText isCollapsed={isCollapsed}>Aktywne wymiany</LinkText>
                    </SidebarLink>
                    {isAdminRole() && (
                        <SidebarLink as={NavLink} to="/adminPage" activeClassName="active" isCollapsed={isCollapsed}>
                            <Icon icon={faUserShield} /> <LinkText isCollapsed={isCollapsed}>Administracja</LinkText>
                        </SidebarLink>
                    )}
                </Nav>
            </div>

            <BottomLinks>
                <SidebarLink onClick={() => setShowProfile(true)} isCollapsed={isCollapsed}>
                    <Icon icon={faUser} /> <LinkText isCollapsed={isCollapsed}>Profil</LinkText>
                </SidebarLink>
                <SidebarLink onClick={handleLogout} isCollapsed={isCollapsed}>
                    <Icon icon={faSignOutAlt} /> <LinkText isCollapsed={isCollapsed}>Wyloguj się</LinkText>
                </SidebarLink>
            </BottomLinks>
            <ToggleButton isCollapsed={isCollapsed} onClick={onToggleCollapse}>
                <Icon icon={isCollapsed ? faAngleRight : faAngleLeft} />
            </ToggleButton>
            <UserProfile show={showProfile} onHide={() => setShowProfile(false)} />
        </SidebarContainer>
    );
};

export default SideBar;
