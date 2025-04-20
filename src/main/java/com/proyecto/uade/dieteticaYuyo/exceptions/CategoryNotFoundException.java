package com.proyecto.uade.dieteticaYuyo.exceptions;

public class CategoryNotFoundException extends RuntimeException {

    public CategoryNotFoundException(Long id) {
        super("Categoría con ID: " + id + " no encontrada.");
    }

    public CategoryNotFoundException(String name) {
        super("Categoría con nombre: \"" + name + "\" no encontrada.");
    }
}
