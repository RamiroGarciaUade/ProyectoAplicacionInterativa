package com.proyecto.uade.dieteticaYuyo.entity.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UserRequestDTO {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String address;
    private MultipartFile image;
}
