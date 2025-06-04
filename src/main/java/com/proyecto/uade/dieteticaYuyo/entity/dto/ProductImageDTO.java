package com.proyecto.uade.dieteticaYuyo.entity.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ProductImageDTO {
    private Long productId;
    private MultipartFile image;
} 