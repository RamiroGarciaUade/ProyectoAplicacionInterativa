package com.proyecto.uade.dieteticaYuyo.controller;

import com.proyecto.uade.dieteticaYuyo.entity.dto.AuthenticationRequestDTO;
import com.proyecto.uade.dieteticaYuyo.entity.dto.AuthenticationResponseDTO;
import com.proyecto.uade.dieteticaYuyo.entity.dto.UserRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.uade.dieteticaYuyo.service.AuthenticationServiceImpl;

@RestController
@RequestMapping("auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationServiceImpl authenticationService;

    // POST /auth/register
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponseDTO> register(@RequestBody UserRequestDTO requestDTO) {
        return ResponseEntity.ok(authenticationService.register(requestDTO.getEmail(), requestDTO.getPassword(), requestDTO.getFirstName(), requestDTO.getLastName(), requestDTO.getAddress(), requestDTO.getImageUrl()));
    }

    // POST /auth/authenticate
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponseDTO> authenticate(@RequestBody AuthenticationRequestDTO requestDTO) {
        return ResponseEntity.ok(authenticationService.authenticate(requestDTO.getEmail(), requestDTO.getPassword()));
    }

}
