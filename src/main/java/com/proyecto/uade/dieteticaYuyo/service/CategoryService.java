package com.proyecto.uade.dieteticaYuyo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;

import com.proyecto.uade.dieteticaYuyo.entity.Category;
import com.proyecto.uade.dieteticaYuyo.entity.Product;
import com.proyecto.uade.dieteticaYuyo.exceptions.CategoryDuplicateException;
import org.springframework.stereotype.Service;

public interface CategoryService {
    Page<Category> getPagedCategories(PageRequest pageRequest);

    List<Category> getAllCategories();

    Category getCategoryById(Long id);

    Category getCategoryByName(String name);

    Category createCategory(Category category) throws CategoryDuplicateException;

    Category updateCategory(Category category);

    void deleteCategoryById(Long id);
}
