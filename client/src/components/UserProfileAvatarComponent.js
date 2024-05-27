import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const AvatarImage = styled.img`
  border-radius: 50%;
  width: 100px;
  height: 100px;
  margin-bottom: 15px;
`;

const UserProfileAvatarComponent = ({ userId }) => {
    const [avatar, setAvatar] = useState(null);

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

    return avatar ? <AvatarImage src={avatar} alt="User Avatar" /> : null;
};

export default UserProfileAvatarComponent;