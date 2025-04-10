package com.proyecto.uade.dieteticaYuyo.entity.dto;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class ProductRequest {
    private String description;
    private Double price;
    private Double discount;
    private List<String> images = new ArrayList<>();
    private Long categoryId;
} 