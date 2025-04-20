package com.proyecto.uade.dieteticaYuyo.entity.dto.request;

import lombok.Data;

@Data
public class ProductRequest {
    private String qualification;
    private String description;
    private Double price;
    private Double discount;
} 