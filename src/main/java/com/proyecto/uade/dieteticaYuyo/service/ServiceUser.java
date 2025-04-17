package com.proyecto.uade.dieteticaYuyo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.proyecto.uade.dieteticaYuyo.entity.User;
import com.proyecto.uade.dieteticaYuyo.exceptions.UserDuplicateException;

@Service
public interface ServiceUser {
    public List<User> getUsers();

    public Optional<User> getUserById(Long userId);

    public User findByUsername(String userName);

    public User findByEmail(String email);

    public ResponseEntity<User> updateUser(User user);

    public User createUser(User user) throws UserDuplicateException;

    public ResponseEntity<String> deleteUserById(Long id);
}