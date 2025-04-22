package com.proyecto.uade.dieteticaYuyo.service;

import com.proyecto.uade.dieteticaYuyo.exceptions.UserDuplicateException;
import com.proyecto.uade.dieteticaYuyo.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.proyecto.uade.dieteticaYuyo.config.JwtService;
import com.proyecto.uade.dieteticaYuyo.entity.dto.AuthenticationResponseDTO;
import com.proyecto.uade.dieteticaYuyo.entity.Role;
import com.proyecto.uade.dieteticaYuyo.entity.User;
import com.proyecto.uade.dieteticaYuyo.repository.UserRepository;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthenticationResponseDTO register(String email, String password, String firstName, String lastName, String address, String imageUrl) {
        if (userRepository.existsByEmail(email)) {
            throw new UserDuplicateException(email);
        }
        User user = userRepository.save(User.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .firstName(firstName)
                .lastName(lastName)
                .address(address)
                .imageUrl(imageUrl)
                .role(Role.USER)
                .build());
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponseDTO.builder()
                .accessToken(jwtToken)
                .build();
    }

    public AuthenticationResponseDTO authenticate(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        password
                )
        );
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponseDTO.builder()
                .accessToken(jwtToken)
                .build();
    }

}
