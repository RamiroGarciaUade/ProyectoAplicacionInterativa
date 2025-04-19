package com.proyecto.uade.dieteticaYuyo.entity.dto;

import java.util.List;

import com.proyecto.uade.dieteticaYuyo.entity.Category;

import lombok.Data;

@Data
public class ProductDTO {
    private Long id;
    private String qualification;
    private String description;
    private Double price;
    private Double discount;
    private List<String> images;
    private Long categoryId;
} 