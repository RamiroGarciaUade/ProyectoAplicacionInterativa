package com.proyecto.uade.dieteticaYuyo.controller;

import com.proyecto.uade.dieteticaYuyo.entity.User;
import com.proyecto.uade.dieteticaYuyo.entity.dto.AuthenticationRequestDTO;
import com.proyecto.uade.dieteticaYuyo.entity.dto.AuthenticationResponseDTO;
import com.proyecto.uade.dieteticaYuyo.entity.dto.UserRequestDTO;
import com.proyecto.uade.dieteticaYuyo.service.AuthenticationService;
import com.proyecto.uade.dieteticaYuyo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private UserService userService;

    // POST /auth/register
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponseDTO> register(@RequestBody UserRequestDTO requestDTO) {
        User savedUser = userService.createUser(requestDTO.getEmail(), requestDTO.getPassword(), requestDTO.getFirstName(), requestDTO.getLastName(), requestDTO.getAddress(), requestDTO.getImageUrl());
        return ResponseEntity.ok(authenticationService.getToken(savedUser));
    }

    // POST /auth/authenticate
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponseDTO> authenticate(@RequestBody AuthenticationRequestDTO requestDTO) {
        User user = userService.getUserByEmail(requestDTO.getEmail());
        authenticationService.authenticate(requestDTO.getEmail(), requestDTO.getPassword());
        return ResponseEntity.ok(authenticationService.getToken(user));
    }

}
