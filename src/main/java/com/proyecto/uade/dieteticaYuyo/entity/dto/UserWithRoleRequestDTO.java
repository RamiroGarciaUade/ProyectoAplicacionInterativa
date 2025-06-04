package com.proyecto.uade.dieteticaYuyo.entity.dto;

import com.proyecto.uade.dieteticaYuyo.entity.Role;
import lombok.Data;

@Data
public class UserWithRoleRequestDTO {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String address;
    private String imageUrl;
    private Role role;
}
