import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import UserProfileModal from './UserProfileModal';

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const AvatarImage = styled.img`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin-right: 10px;
`;

const UserName = styled.span`
  font-size: 1em;
  color: #333;
`;

const UserAvatarComponent = ({ userId, userName }) => {
    const [avatar, setAvatar] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/user/getUserAvatar', {
                    params: { userId },
                    responseType: 'blob'
                });
                const imageUrl = URL.createObjectURL(response.data);
                setAvatar(imageUrl);
            } catch (error) {
                console.error('Error fetching avatar:', error);
            }
        };

        fetchAvatar();
    }, [userId]);

    const handleAvatarClick = () => {
        setShowModal(true);
    };

    return (
        <>
            <AvatarContainer onClick={handleAvatarClick}>
                {avatar ? <AvatarImage src={avatar} alt="User Avatar" /> : <div>Loading...</div>}
                <UserName>{userName}</UserName>
            </AvatarContainer>
            <UserProfileModal userId={userId} show={showModal} onHide={() => setShowModal(false)} />
        </>
    );
};

export default UserAvatarComponent;
