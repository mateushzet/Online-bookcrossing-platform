import React, { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import isAdminRole from "../utils/IsAdminRole";
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faExchangeAlt, faBook, faBookmark, faUserShield, faUser, faSignOutAlt, faAngleLeft, faAngleRight, faMapMarkedAlt, faSyncAlt, faBell, faTrashAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import UserProfile from '../pages/UserProfile';
import axios from 'axios';

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
  z-index: 1040;
  
  @media (max-width: 768px) {
    width: ${({ isCollapsed }) => (isCollapsed ? '0' : '100%')};
  }
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
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SidebarLink = styled(Nav.Link)`
  color: #fff;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  text-decoration: none;
  justify-content: flex-start;
  transition: padding 0.3s ease;
  height: 50px;
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
  min-width: 20px;
`;

const LinkText = styled.span`
  display: inline-block;
  opacity: ${({ isCollapsed }) => (isCollapsed ? '0' : '1')};
  width: ${({ isCollapsed }) => (isCollapsed ? '0' : 'auto')};
  overflow: hidden;
  white-space: nowrap;
  transition: opacity 0.3s ease, width 0.3s ease;
  @media (max-width: 768px) {
    display: ${({ isCollapsed }) => (isCollapsed ? 'none' : 'inline')};
    width: ${({ isCollapsed }) => (isCollapsed ? '30%' : '100%')};
    font-size: 1.5em;
    padding: 30px;
  }
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
  right: ${({ isCollapsed }) => (isCollapsed ? '-20px' : '-20px')};
  transition: right 0.3s;
  &:hover, &:focus {
    color: #ccc;
  }
  
  @media (max-width: 768px) {
    right: ${({ isCollapsed }) => (isCollapsed ? '320px' : '40px')};
    z-index: 100;
    position: fixed;
  }
`;

const NotificationsModal = styled.div`
  display: ${({ show }) => (show ? 'block' : 'none')};
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
  z-index: 1051;
  max-width: 90%;
  max-height: 90%;
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
  justify-content: flex-end;
  align-items: center;
  padding: 20px;
  background-color: #f1f1f1;
`;

const Button = styled.button`
  background: #444;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  padding: 10px 20px;
  margin-left: 10px;
  &:hover, &:focus {
    background: #333;
  }
`;

const NotificationItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ read }) => (read ? '#e2e2e2' : '#627254')};
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
`;

const NotificationButton = styled(Button)`
  margin-left: 10px;
`;

const NotificationIcon = styled(Icon)`
  margin-right: 10px;
`;

const NotificationDot = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  background: ${({ hasUnread }) => (hasUnread ? 'white' : '#333')};
  border-radius: 50%;
  margin-left: 10px;
`;

const NoNotificationsText = styled.p`
  color: #000;  // Set text color to black
`;

const SideBar = ({ isCollapsed, onToggleCollapse }) => {
    const [showProfile, setShowProfile] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true); // Default to true

    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/api/user/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const fetchUserSettings = async () => {
        try {
            const userResponse = await axios.get('http://localhost:8080/api/user/getUser');
            setEmailNotificationsEnabled(userResponse.data.emailNotifications);
        } catch (error) {
            console.error('Error fetching user settings:', error);
        }
    };

    const markNotificationAsRead = async (notificationId) => {
        try {
            await axios.post(`/api/user/notifications/markAsRead/${notificationId}`);
            setNotifications(notifications.map(notification =>
                notification.id === notificationId ? { ...notification, read: true } : notification
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            await axios.delete(`/api/user/notifications/${notificationId}`);
            setNotifications(notifications.filter(notification => notification.id !== notificationId));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    useEffect(() => {
        fetchNotifications(); // Fetch notifications on component mount
        fetchUserSettings(); // Fetch user settings on component mount
    }, []);

    useEffect(() => {
        if (showNotifications) {
            fetchNotifications();
        }
    }, [showNotifications]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const unreadNotifications = notifications.some(notification => !notification.read);

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
                    <SidebarLink as={NavLink} to="/map" activeClassName="active" isCollapsed={isCollapsed}>
                        <Icon icon={faMapMarkedAlt} /> <LinkText isCollapsed={isCollapsed}>Mapa wymian</LinkText>
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
                        <Icon icon={faSyncAlt} /> <LinkText isCollapsed={isCollapsed}>Aktywne wymiany</LinkText>
                    </SidebarLink>
                    {isAdminRole() && (
                        <SidebarLink as={NavLink} to="/adminPage" activeClassName="active" isCollapsed={isCollapsed}>
                            <Icon icon={faUserShield} /> <LinkText isCollapsed={isCollapsed}>Administracja</LinkText>
                        </SidebarLink>
                    )}
                </Nav>
            </div>

            <BottomLinks>
                <SidebarLink
                    onClick={() => setShowNotifications(true)}
                    isCollapsed={isCollapsed}
                    style={{ color: emailNotificationsEnabled ? '#fff' : '#888' }} // Grey out if notifications are disabled
                >
                    <NotificationIcon icon={faBell} />
                    <LinkText isCollapsed={isCollapsed}>Powiadomienia</LinkText>
                    {emailNotificationsEnabled && <NotificationDot hasUnread={unreadNotifications} />}
                </SidebarLink>
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

            <UserProfile show={showProfile} onClose={() => setShowProfile(false)} />
            <NotificationsModal show={showNotifications}>
                <ModalDialog>
                    <ModalContent>
                        <ModalHeader>
                            <ModalTitle>Powiadomienia</ModalTitle>
                        </ModalHeader>
                        <ModalBody>
                            {notifications.length === 0 ? (
                                <NoNotificationsText>Brak powiadomień</NoNotificationsText>
                            ) : (
                                notifications.map(notification => (
                                    <NotificationItem key={notification.id} read={notification.read}>
                                        <span>{notification.message}</span>
                                        <div>
                                            {!notification.read && (
                                                <NotificationButton onClick={() => markNotificationAsRead(notification.id)}>
                                                    <FontAwesomeIcon icon={faEye} />
                                                </NotificationButton>
                                            )}
                                            <NotificationButton onClick={() => deleteNotification(notification.id)}>
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            </NotificationButton>
                                        </div>
                                    </NotificationItem>
                                ))
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={() => setShowNotifications(false)}>Zamknij</Button>
                        </ModalFooter>
                    </ModalContent>
                </ModalDialog>
            </NotificationsModal>
        </SidebarContainer>
    );
};

export default SideBar;
