package com.proyecto.uade.dieteticaYuyo.entity.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ImageResponseDTO {
    private Long id;
    private String file;
} 