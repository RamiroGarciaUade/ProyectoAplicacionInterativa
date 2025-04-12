package com.proyecto.uade.dieteticaYuyo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name="usuario")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false , unique = true)
    private String userName;

    @Column(nullable = false , unique = true)
    private String email;

    @Column(nullable = false)
    private String direccion;

    @Column(nullable = false)
    private String password; 

    @Column(nullable = false)
    private String img;

    @Column(nullable = false)
    private String rol;

    public void setRole(String rol) {
        if (!rol.equals("ADMIN") && !rol.equals("USER")) {
            throw new IllegalArgumentException("El rol debe ser 'ADMIN' o 'USER'.");
        }
        this.rol = rol;
    }
    
}
