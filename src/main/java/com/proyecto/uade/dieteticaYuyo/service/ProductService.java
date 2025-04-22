package com.proyecto.uade.dieteticaYuyo.service;

import java.math.BigDecimal;
import java.util.List;

import com.proyecto.uade.dieteticaYuyo.exceptions.ProductNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.proyecto.uade.dieteticaYuyo.entity.Product;
import com.proyecto.uade.dieteticaYuyo.exceptions.ProductDuplicateException;

public interface ProductService {
    List<Product> getAllProducts();

    Page<Product> getPagedProducts(PageRequest pageRequest);

    Product getProductById(Long id) throws ProductNotFoundException;

    Product getProductByName(String name) throws ProductNotFoundException;

    List<Product> getProductsByCategory(Long categoryId);

    Product createProduct(String name, String description, BigDecimal price, Integer stock, Long categoryId, List<String> imageUrls) throws ProductDuplicateException;

    Product updateProduct(Long id, String name, String description, BigDecimal price, Integer stock, Long categoryId, List<String> imageUrls) throws ProductDuplicateException;

    void deleteProductById(Long id);

}
