package com.proyecto.uade.dieteticaYuyo.service;

import java.util.List;

import com.proyecto.uade.dieteticaYuyo.entity.Role;
import com.proyecto.uade.dieteticaYuyo.entity.User;
import com.proyecto.uade.dieteticaYuyo.exceptions.UserDuplicateException;
import com.proyecto.uade.dieteticaYuyo.exceptions.UserNotFoundException;

public interface UserService {
    List<User> getUsers();

    User getUserById(Long id) throws UserNotFoundException;

    User getUserByEmail(String email) throws UserNotFoundException;

    User createUser(String email, String password, String firstName, String lastName, String address, String imageUrl) throws UserDuplicateException;

    User updateUser(Long id, String email, String password, String firstName, String lastName, String address, String imageUrl) throws UserDuplicateException;

    void deleteUserById(Long id);

}