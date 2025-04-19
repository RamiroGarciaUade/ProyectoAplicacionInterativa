package com.proyecto.uade.dieteticaYuyo.exceptions;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(Long id) {
        super("Usuario con ID: " + id + " no encontrado.");
    }

    public UserNotFoundException(String username) {
        super("Usuario con nombre de usuario: \"" + username + "\" no encontrado.");
    }
}

