package com.proyecto.uade.dieteticaYuyo.service;

import java.util.List;

import com.proyecto.uade.dieteticaYuyo.entity.Role;
import com.proyecto.uade.dieteticaYuyo.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyecto.uade.dieteticaYuyo.entity.User;
import com.proyecto.uade.dieteticaYuyo.exceptions.UserDuplicateException;
import com.proyecto.uade.dieteticaYuyo.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) throws UserNotFoundException {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    @Override
    public User getUserByUsername(String username) throws UserNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public User createUser(String username, String email, String address, String password, String imageUrl) throws UserDuplicateException {
        if (userRepository.existsByUsername(username)) {
            throw new UserDuplicateException(username);
        }
        return userRepository.save(User.builder()
                .username(username)
                .email(email)
                .address(address)
                .password(password)
                .imageUrl(imageUrl)
                .role(Role.USER)
                .build());
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public User updateUser(Long id, String username, String email, String address, String password, String imageUrl) throws UserDuplicateException {
        User user = getUserById(id);
        if (userRepository.existsByUsername(username) &&
                !user.getUsername().equals(username)) {
            throw new UserDuplicateException(username);
        }

        user.setUsername(username);
        user.setEmail(email);
        user.setAddress(address);
        user.setPassword(password);
        user.setImageUrl(imageUrl);

        return userRepository.save(user);
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public void deleteUserById(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

}