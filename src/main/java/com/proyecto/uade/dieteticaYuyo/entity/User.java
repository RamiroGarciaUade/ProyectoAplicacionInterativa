package com.proyecto.uade.dieteticaYuyo.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name="user")
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

    @Enumerated(EnumType.STRING)
    /*
     *  `EnumType.STRING`: guarda el nombre del enum en la base de datos (por ejemplo `"ADMIN"`).
     Sin esto, por defecto se usa `EnumType.ORDINAL`, que guarda el índice (0, 1, 2...), lo cual 
     **no es recomendable** porque rompe si cambias el orden de los valores del enum.
     */
    private Role rol;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Order> orders=new ArrayList<>();
    
}
