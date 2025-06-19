package com.proyecto.uade.dieteticaYuyo.service;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import com.proyecto.uade.dieteticaYuyo.entity.User;
import com.proyecto.uade.dieteticaYuyo.entity.dto.AuthenticationRequestDTO;
import com.proyecto.uade.dieteticaYuyo.entity.dto.AuthenticationResponseDTO;
import com.proyecto.uade.dieteticaYuyo.entity.dto.UserRequestDTO;

public interface AuthenticationService {
    

    AuthenticationResponseDTO getToken(User user);

    AuthenticationResponseDTO authenticate(AuthenticationRequestDTO request);

    ResponseEntity<AuthenticationResponseDTO> register(@RequestBody UserRequestDTO requestDTO);

}
