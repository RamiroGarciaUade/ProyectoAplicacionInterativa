package com.proyecto.uade.dieteticaYuyo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class CategoryDuplicateException extends RuntimeException {
    public CategoryDuplicateException(String name) {
        super("La categoria con el nombre: '" + name + "' ya existe.");
    }
}
