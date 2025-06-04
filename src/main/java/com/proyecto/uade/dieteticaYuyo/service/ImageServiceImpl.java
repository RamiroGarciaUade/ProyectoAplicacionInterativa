package com.proyecto.uade.dieteticaYuyo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.uade.dieteticaYuyo.entity.Image;
import com.proyecto.uade.dieteticaYuyo.repository.ImageRepository;

@Service
public class ImageServiceImpl implements ImageService {
    @Autowired
    private ImageRepository imageRepository;

    @Override
    public Image create(Image image) {
        return imageRepository.save(image);
    }

    @Override
    public Image viewById(Long id) {
        return imageRepository.findById(id).orElseThrow(() -> new RuntimeException("Image not found"));
    }
} 