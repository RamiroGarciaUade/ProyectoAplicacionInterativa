package com.proyecto.uade.dieteticaYuyo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class PurchaseOrderInvalidStateException extends RuntimeException {
    public PurchaseOrderInvalidStateException(Long id) {
        super("La orden de compra con ID: " + id + " ya no está en estado pendiente, por lo que no se puede modificar.");
    }
}
