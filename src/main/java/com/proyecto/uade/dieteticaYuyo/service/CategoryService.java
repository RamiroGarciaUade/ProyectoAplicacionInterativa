package com.proyecto.uade.dieteticaYuyo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;

import com.proyecto.uade.dieteticaYuyo.entity.Category;
import com.proyecto.uade.dieteticaYuyo.entity.Product;
import com.proyecto.uade.dieteticaYuyo.exceptions.CategoryDuplicateException;

public interface CategoryService {
    public Page<Category> getCategories(PageRequest pageRequest);
    
    public List<Category> getAllCategories();

    public Optional<Category> getCategoryById(Long categoryId);
    
    public List<Category> findByDescription(String description);

    public Category createCategory(Category category) throws CategoryDuplicateException;

    public ResponseEntity<Category> updateCategory(Category category);

    public ResponseEntity<String> deleteCategoryById(Long id);
    
    public List<Product> getProductsByCategory(Long categoryId);
}
