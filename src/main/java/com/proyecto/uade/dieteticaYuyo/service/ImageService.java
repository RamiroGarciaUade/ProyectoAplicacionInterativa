package com.proyecto.uade.dieteticaYuyo.service;

import org.springframework.stereotype.Service;

import com.proyecto.uade.dieteticaYuyo.entity.Image;

@Service
public interface ImageService {
    Image create(Image image);
    Image viewById(Long id);
} 