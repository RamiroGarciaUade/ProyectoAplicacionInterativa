package com.proyecto.uade.dieteticaYuyo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyecto.uade.dieteticaYuyo.entity.Image;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
} 