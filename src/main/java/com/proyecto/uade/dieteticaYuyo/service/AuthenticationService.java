package com.proyecto.uade.dieteticaYuyo.service;

import com.proyecto.uade.dieteticaYuyo.entity.dto.AuthenticationResponseDTO;

public interface AuthenticationService {

    AuthenticationResponseDTO register(String email, String password, String firstName, String lastName, String address, String imageUrl);

    AuthenticationResponseDTO authenticate(String email, String password);

}
