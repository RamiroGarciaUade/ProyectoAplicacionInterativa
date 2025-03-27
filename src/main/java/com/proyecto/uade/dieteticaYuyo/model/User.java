package com.proyecto.uade.dieteticaYuyo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String serName;

    @Column
    private String email;

    @Column
    private String direccion;

    @Column
    private String password; 

    @Column
    private String img;

    @Column
    private String rol;
}
