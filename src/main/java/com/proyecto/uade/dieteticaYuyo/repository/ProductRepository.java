package com.proyecto.uade.dieteticaYuyo.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyecto.uade.dieteticaYuyo.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Product findByDescription(String description);
} 