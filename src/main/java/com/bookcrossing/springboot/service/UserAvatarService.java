package com.bookcrossing.springboot.service;

import com.bookcrossing.springboot.model.UserAvatar;
import com.bookcrossing.springboot.repository.UserAvatarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class UserAvatarService {
    @Autowired
    private UserAvatarRepository userAvatarRepository;

    public UserAvatar getUserAvatarByUserId(int userId) {
        UserAvatar userAvatar = userAvatarRepository.findByUserId(userId);
        if (userAvatar == null) {
            userAvatar = userAvatarRepository.findByUserId(-1);
        }
        return userAvatar;
    }

    public void saveUserAvatar(int userId, byte[] avatarBytes) {
            UserAvatar userAvatar = userAvatarRepository.findByUserId(userId);
            if (userAvatar == null) {
                userAvatar = new UserAvatar();
                userAvatar.setUserId(userId);
                userAvatar.setAvatar(avatarBytes);
            } else {
                userAvatar.setAvatar(avatarBytes);
            }
            userAvatarRepository.save(userAvatar);
        }
}