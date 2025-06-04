package com.proyecto.uade.dieteticaYuyo.entity.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class AddFileRequestDTO {
    private String name;
    private MultipartFile file;
} 