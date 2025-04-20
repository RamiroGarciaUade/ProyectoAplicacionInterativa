package com.proyecto.uade.dieteticaYuyo.entity.dto.respond;
import com.proyecto.uade.dieteticaYuyo.entity.Role;
import lombok.Data;

@Data
public class UserRespond {
    private String userName;
    private String email;
    private String direccion;
    private String password; 
    private String img;
    private Role rol;
}
