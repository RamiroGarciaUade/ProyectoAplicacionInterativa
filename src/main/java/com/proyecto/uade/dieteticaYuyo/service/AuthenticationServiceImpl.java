package com.proyecto.uade.dieteticaYuyo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.proyecto.uade.dieteticaYuyo.config.JwtService;
import com.proyecto.uade.dieteticaYuyo.entity.dto.AuthenticationResponseDTO;
import com.proyecto.uade.dieteticaYuyo.entity.User;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {
    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthenticationResponseDTO getToken(User user) {
        return AuthenticationResponseDTO.builder()
                .accessToken(jwtService.generateToken(user))
                .build();
    }

    public void authenticate(String email, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        password
                )
        );
    }

}
