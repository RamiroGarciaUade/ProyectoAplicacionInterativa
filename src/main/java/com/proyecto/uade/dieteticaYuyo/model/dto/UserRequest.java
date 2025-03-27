package com.proyecto.uade.dieteticaYuyo.model.dto;
import lombok.Data;

@Data
public class UserRequest {
    private String serName;
    private String email;
    private String direccion;
    private String password; 
    private String img;
}
