package com.proyecto.uade.dieteticaYuyo.entity.dto;

import lombok.Data;

@Data
public class UserRequestDTO {
    private String username;
    private String email;
    private String address;
    private String password;
    private String imageUrl;
}
