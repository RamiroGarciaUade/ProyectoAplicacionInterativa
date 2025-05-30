package com.proyecto.uade.dieteticaYuyo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    @Column(nullable = false)
    @Positive(message = "El precio debe ser mayor que 0")
    private BigDecimal price;

    @Column(nullable = false)
    @PositiveOrZero(message = "El stock no puede ser negativo")
    private Integer stock;

    @JoinColumn(name = "category_id", nullable = false)
    private Long categoryId;

    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> imageUrls;

    @Column(name = "discount_percentage", precision = 5, scale = 2) // Nuevo campo para el porcentaje de descuento
    @PositiveOrZero(message = "El porcentaje de descuento no puede ser negativo")
    private BigDecimal discountPercentage; // Por ejemplo, 10.00 para un 10%
}

