package com.proyecto.uade.dieteticaYuyo.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;
import lombok.Data;

@Data
@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String qualification;

    @Column
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Double discount;

    @ElementCollection
    @Column(name = "image_url")
    private List<String> images = new ArrayList<>();

    @Column(name = "category_id")
    private Long categoryId;
    
    @Transient
    private Category category;
    
    public Category getCategory() {
        return category;
    }
    
    public void setCategory(Category category) {
        this.category = category;
        this.categoryId = (category != null) ? category.getId() : null;
    }
}
