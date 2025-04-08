package com.proyecto.uade.dieteticaYuyo.controller;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/auth")

public class UserLogin {

    @Autowired
    private ServiceUser serviceUser;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = serviceUser.findByEmail(request.getEmail());

        if (user == null || !user.getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
        }

        // Ejemplo: devolver el nombre, rol y mensaje de éxito
        Map<String, Object> response = new HashMap<>();
        response.put("nombre", user.getSurname());
        response.put("email", user.getEmail());
        response.put("rol", user.getRoles().stream().map(Role::getRoleName).toList());
        response.put("mensaje", "Login exitoso");

        return ResponseEntity.ok(response);
    }

}