package com.proyecto.uade.dieteticaYuyo.entity.dto;

import com.proyecto.uade.dieteticaYuyo.entity.Product;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private Long categoryId;
    private List<String> imageUrls;

    public static ProductResponseDTO fromProduct(Product product) {
        return ProductResponseDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .categoryId(product.getCategoryId())
                .imageUrls(product.getImageUrls())
                .build();
    }
}
