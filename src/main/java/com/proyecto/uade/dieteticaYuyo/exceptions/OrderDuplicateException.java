package com.proyecto.uade.dieteticaYuyo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "La Orden que se intenta agregar esta duplicada")
public class OrderDuplicateException extends Exception{
    
}