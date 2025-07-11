package com.proyecto.uade.dieteticaYuyo.entity.dto;

import com.proyecto.uade.dieteticaYuyo.entity.Category;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoryResponseDTO {
    private Long id;
    private String name;
    private String description;

    public static CategoryResponseDTO fromCategory(Category category) {
        return CategoryResponseDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }
}
