package com.proyecto.uade.dieteticaYuyo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.proyecto.uade.dieteticaYuyo.entity.Product;
import com.proyecto.uade.dieteticaYuyo.exceptions.ProductDuplicateException;

@Service
public interface ProductService {
    public List<Product> getProducts();
    
    public Page<Product> getProductsPage(PageRequest pageRequest);

    public Optional<Product> getProductById(Long productId);

    public Product findByDescription(String description);

    public ResponseEntity<Product> updateProduct(Product product);

    public Product createProduct(Product product) throws ProductDuplicateException;
    
    public ResponseEntity<String> deleteProductById(Long id);
} 