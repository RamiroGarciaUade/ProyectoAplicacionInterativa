package com.proyecto.uade.dieteticaYuyo.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class AddFileRequest {
    private String name;
    private MultipartFile file;
} 