package com.proyecto.uade.dieteticaYuyo.entity.dto;

import java.math.BigDecimal;
import java.util.Base64;

import com.proyecto.uade.dieteticaYuyo.entity.Category;
import com.proyecto.uade.dieteticaYuyo.entity.Product;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private CategoryResponseDTO category;
    private String imageData;
    private String imageType;
    private BigDecimal discountPercentage;

    public static ProductResponseDTO fromProduct(Product product) {
        String base64Image = null;
        if (product.getImageData() != null) {
            try {
                byte[] imageBytes = product.getImageData().getBytes(1, (int) product.getImageData().length());
                base64Image = Base64.getEncoder().encodeToString(imageBytes);
            } catch (Exception e) {
            }
        }

        return ProductResponseDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .category(null) // Se establecerá en el servicio
                .imageData(base64Image)
                .imageType(product.getImageType())
                .discountPercentage(product.getDiscountPercentage())
                .build();
    }

    public static ProductResponseDTO fromProduct(Product product, Category category) {
        String base64Image = null;
        if (product.getImageData() != null) {
            try {
                byte[] imageBytes = product.getImageData().getBytes(1, (int) product.getImageData().length());
                base64Image = Base64.getEncoder().encodeToString(imageBytes);
            } catch (Exception e) {
            }
        }

        return ProductResponseDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .category(category != null ? CategoryResponseDTO.fromCategory(category) : null)
                .imageData(base64Image)
                .imageType(product.getImageType())
                .discountPercentage(product.getDiscountPercentage())
                .build();
    }
}
