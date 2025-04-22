package com.proyecto.uade.dieteticaYuyo.controller;

import java.util.List;
import java.util.Map;

import com.proyecto.uade.dieteticaYuyo.entity.dto.UserRequestDTO;
import com.proyecto.uade.dieteticaYuyo.entity.dto.UserResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.proyecto.uade.dieteticaYuyo.entity.User;
import com.proyecto.uade.dieteticaYuyo.service.UserService;

@RestController
@RequestMapping("users")
public class UserController {
    @Autowired
    private UserService userService;

    // GET /users
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<User> users = userService.getUsers();
        List<UserResponseDTO> userDTOs = users.stream()
                .map(UserResponseDTO::fromUser)
                .toList();

        return ResponseEntity.ok(userDTOs);
    }

    // GET /users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(UserResponseDTO.fromUser(user));
    }

    // GET /users/email/{email}
    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponseDTO> getUserByEmail(@PathVariable String email) {
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(UserResponseDTO.fromUser(user));
    }

    // POST /users
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserRequestDTO requestDTO) {
        User savedUser = userService.createUser(requestDTO.getEmail(), requestDTO.getPassword(), requestDTO.getFirstName(), requestDTO.getLastName(), requestDTO.getAddress(), requestDTO.getImageUrl());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("message", "Usuario de " + savedUser.getFullName() + " creado con éxito"));
    }

    // PUT /users/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserRequestDTO requestDTO) {
        User currentUser = userService.getUserById(id);

        String email = requestDTO.getEmail() != null ? requestDTO.getEmail() : currentUser.getEmail();
        String firstName = requestDTO.getFirstName() != null ? requestDTO.getFirstName() : currentUser.getFirstName();
        String lastName = requestDTO.getLastName() != null ? requestDTO.getLastName() : currentUser.getLastName();
        String address = requestDTO.getAddress() != null ? requestDTO.getAddress() : currentUser.getAddress();
        String password = requestDTO.getPassword() != null ? requestDTO.getPassword() : currentUser.getPassword();
        String imageUrl = requestDTO.getImageUrl() != null ? requestDTO.getImageUrl() : currentUser.getImageUrl();

        User updatedUser = userService.updateUser(id, email, password, firstName, lastName, address, imageUrl);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(Map.of("message", "Usuario de " + updatedUser.getFullName() + " actualizado con éxito"));
    }

    // DELETE /users/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.ok(Map.of("message", "Usuario eliminado con éxito"));
    }

}
