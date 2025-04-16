package com.proyecto.uade.dieteticaYuyo.entity.dto;

import java.util.List;

import com.proyecto.uade.dieteticaYuyo.entity.Category;

import lombok.Data;

@Data
public class ProductRequest {
    private String qualification;
    private String description;
    private Double price;
    private Double discount;
    private Long categoryId;
    private Category category;
    private List<String> images;
} 