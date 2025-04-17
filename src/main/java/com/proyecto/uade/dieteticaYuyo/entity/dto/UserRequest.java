package com.proyecto.uade.dieteticaYuyo.entity.dto;
import lombok.Data;

@Data
public class UserRequest {
    private String userName;
    private String email;
    private String direccion;
    private String password; 
    private String img;
}