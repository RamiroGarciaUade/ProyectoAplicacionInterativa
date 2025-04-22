package com.proyecto.uade.dieteticaYuyo.controller;

import com.proyecto.uade.dieteticaYuyo.entity.dto.AuthenticationRequestDTO;
import com.proyecto.uade.dieteticaYuyo.entity.dto.AuthenticationResponseDTO;
import com.proyecto.uade.dieteticaYuyo.entity.dto.UserRequestDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.uade.dieteticaYuyo.service.AuthenticationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("auth")
@RequiredArgsConstructor
public class AuthenticationController {
    
    private final AuthenticationService service;

    // POST /auth/register
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponseDTO> register(@RequestBody UserRequestDTO request) {
        return ResponseEntity.ok(service.register(request));
    }

    // POST /auth/authenticate
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponseDTO> authenticate(@RequestBody AuthenticationRequestDTO request) {
        return ResponseEntity.ok(service.authenticate(request));
    }
}
