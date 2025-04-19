package com.proyecto.uade.dieteticaYuyo.service;

import java.util.List;

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
    public User updateUser(User updatedUser) {
        User existingUser = getUserById(updatedUser.getId());
        if (userRepository.existsByUsername(updatedUser.getUsername()) &&
                !existingUser.getUsername().equals(updatedUser.getUsername())) {
            throw new UserDuplicateException(updatedUser.getUsername());
        }

        existingUser.setUsername(updatedUser.getUsername());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setPassword(updatedUser.getPassword());
        existingUser.setAddress(updatedUser.getAddress());
        existingUser.setImageUrl(updatedUser.getImageUrl());

        return userRepository.save(existingUser);
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public User createUser(User user) throws UserDuplicateException {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new UserDuplicateException(user.getUsername());
        }
        return userRepository.save(user);
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public void deleteUserById(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

}
