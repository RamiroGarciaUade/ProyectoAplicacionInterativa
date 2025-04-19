package com.proyecto.uade.dieteticaYuyo.service;

import java.util.List;

import com.proyecto.uade.dieteticaYuyo.entity.User;
import com.proyecto.uade.dieteticaYuyo.exceptions.UserDuplicateException;

public interface UserService {
    List<User> getUsers();

    User getUserById(Long id);

    User getUserByUsername(String username);

    User updateUser(User user);

    User createUser(User user) throws UserDuplicateException;

    void deleteUserById(Long id);
}
