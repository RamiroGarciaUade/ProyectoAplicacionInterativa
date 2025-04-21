package com.proyecto.uade.dieteticaYuyo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(Long id) {
        super("Usuario con ID: " + id + " no encontrado.");
    }

    public UserNotFoundException(String username) {
        super("Usuario con nombre de usuario: '" + username + "' no encontrado.");
    }
}

