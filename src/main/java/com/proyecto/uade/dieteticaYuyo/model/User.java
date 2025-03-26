package com.proyecto.uade.dieteticaYuyo.model;

import jakarta.persistence.Entity;
import lombok.Data;

@Data
@Entity
public class User {
    private Long id;
    private String serName;
    private String gmail;
    private String dirección;
    private String contraseña; 
    private String img;
    private String rol;
}
