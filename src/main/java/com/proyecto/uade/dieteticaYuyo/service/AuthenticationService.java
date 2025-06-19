package com.proyecto.uade.dieteticaYuyo.service;

import com.proyecto.uade.dieteticaYuyo.entity.User;
import com.proyecto.uade.dieteticaYuyo.entity.dto.AuthenticationResponseDTO;

public interface AuthenticationService {

    AuthenticationResponseDTO getToken(User user);

    void authenticate(String email, String password);

}
