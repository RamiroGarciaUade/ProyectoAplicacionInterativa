package com.proyecto.uade.dieteticaYuyo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.proyecto.uade.dieteticaYuyo.config.JwtService;
import com.proyecto.uade.dieteticaYuyo.repository.UserRepository;
import com.proyecto.uade.dieteticaYuyo.entity.dto.AuthenticationRequestDTO;
import com.proyecto.uade.dieteticaYuyo.entity.dto.AuthenticationResponseDTO;
import com.proyecto.uade.dieteticaYuyo.entity.dto.UserRequestDTO;
import com.proyecto.uade.dieteticaYuyo.entity.User;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;

    @Autowired
    
    private AuthenticationManager authenticationManager;

    public AuthenticationResponseDTO getToken(User user) {
        return AuthenticationResponseDTO.builder()
                .accessToken(jwtService.generateToken(user))
                .build();
    }

    public AuthenticationResponseDTO authenticate(AuthenticationRequestDTO request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        // Suponiendo que tenés un método para buscar el usuario por email
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        return getToken(user);
    }

    @Override
    public ResponseEntity<AuthenticationResponseDTO> register(UserRequestDTO requestDTO) {
    User savedUser = userService.createUser(
        requestDTO.getEmail(),
        requestDTO.getPassword(),
        requestDTO.getFirstName(),
        requestDTO.getLastName(),
        requestDTO.getAddress(),
        requestDTO.getImage()
    );
    return ResponseEntity.ok(getToken(savedUser));
}



}
