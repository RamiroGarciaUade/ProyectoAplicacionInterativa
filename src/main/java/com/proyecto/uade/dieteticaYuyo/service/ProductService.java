package com.proyecto.uade.dieteticaYuyo.service;

import java.util.List;

import com.proyecto.uade.dieteticaYuyo.exceptions.ProductNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.proyecto.uade.dieteticaYuyo.entity.Product;
import com.proyecto.uade.dieteticaYuyo.exceptions.ProductDuplicateException;

@Service
public interface ProductService {
    List<Product> getAllProducts();

    Page<Product> getPagedProducts(PageRequest pageRequest);

    Product getProductById(Long id) throws ProductNotFoundException;

    Product getProductByName(String name) throws ProductNotFoundException;

    Product createProduct(Product product) throws ProductDuplicateException;

    Product updateProduct(Product product) throws ProductDuplicateException;

    void deleteProductById(Long id);

    List<Product> findProductsByCategoryId(Long categoryId);
} 