package com.proyecto.uade.dieteticaYuyo.entity.dto.respond;

import com.proyecto.uade.dieteticaYuyo.entity.Category;

import lombok.Data;

@Data
public class ProductRespond {
    private String qualification;
    private String description;
    private Double price;
    private Double discount;
    private Integer stock;
    private Category category;
} 