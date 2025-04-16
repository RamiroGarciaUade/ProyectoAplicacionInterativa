package com.proyecto.uade.dieteticaYuyo.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyecto.uade.dieteticaYuyo.entity.Category;
import com.proyecto.uade.dieteticaYuyo.entity.Product;
import com.proyecto.uade.dieteticaYuyo.repository.CategoryRepository;
import com.proyecto.uade.dieteticaYuyo.exceptions.CategoryDuplicateException;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    @Lazy
    private ProductService productService;

    @Override
    public Page<Category> getCategories(PageRequest pageable) {
        return categoryRepository.findAll(pageable);
    }
    
    @Override
    public List<Category> getAllCategories() {
        return (ArrayList<Category>) categoryRepository.findAll();
    }

    @Override
    public Optional<Category> getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId);
    }
    
    @Override
    public List<Category> findByDescription(String description) {
        return categoryRepository.findByDescription(description);
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public Category createCategory(Category category) throws CategoryDuplicateException {
        List<Category> categories = categoryRepository.findByDescription(category.getDescription());
        if (categories.isEmpty()) {
            return categoryRepository.save(category);
        }
        throw new CategoryDuplicateException();
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public ResponseEntity<Category> updateCategory(Category category) {
        Optional<Category> existingCategory = categoryRepository.findById(category.getId());

        if (existingCategory.isPresent()) {
            Category categoryToUpdate = existingCategory.get();
            categoryToUpdate.setName(category.getName());
            categoryToUpdate.setDescription(category.getDescription());

            Category updatedCategory = categoryRepository.save(categoryToUpdate);

            return ResponseEntity.ok(updatedCategory);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public ResponseEntity<String> deleteCategoryById(Long id) {
        Optional<Category> category = categoryRepository.findById(id);

        if (category.isPresent()) {
            categoryRepository.delete(category.get());
            return ResponseEntity.ok("La categoría ya fue borrada.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No existe esta categoría.");
        }
    }
    
    @Override
    public List<Product> getProductsByCategory(Long categoryId) {
        return productService.findProductsByCategoryId(categoryId);
    }
}
