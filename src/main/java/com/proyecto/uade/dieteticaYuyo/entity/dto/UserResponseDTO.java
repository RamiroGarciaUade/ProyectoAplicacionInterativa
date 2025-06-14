package com.proyecto.uade.dieteticaYuyo.entity.dto;

import com.proyecto.uade.dieteticaYuyo.entity.Role;
import com.proyecto.uade.dieteticaYuyo.entity.User;
import lombok.Builder;
import lombok.Data;

import java.util.Base64;

@Data
@Builder
public class UserResponseDTO {
    private Long id;
    private String email;
    private String address;
    private String firstName;
    private String lastName;
    private String imageData;
    private String imageType;
    private Role role;

    public static UserResponseDTO fromUser(User user) {
        String base64Image = null;
        if (user.getImageData() != null) {
            try {
                byte[] imageBytes = user.getImageData().getBytes(1, (int) user.getImageData().length());
                base64Image = Base64.getEncoder().encodeToString(imageBytes);
            } catch (Exception e) {
            }
        }

        return UserResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .address(user.getAddress())
                .imageData(base64Image)
                .imageType(user.getImageType())
                .role(user.getRole())
                .build();
    }
}
