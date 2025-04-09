package com.proyecto.uade.dieteticaYuyo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "El producto ya existe")
public class ProductDuplicateException extends Exception {

} 