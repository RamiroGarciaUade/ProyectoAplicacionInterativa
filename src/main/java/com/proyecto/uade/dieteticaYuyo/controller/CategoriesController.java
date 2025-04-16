package com.proyecto.uade.dieteticaYuyo.controller;

import com.proyecto.uade.dieteticaYuyo.entity.Category;
import com.proyecto.uade.dieteticaYuyo.entity.Product;
import com.proyecto.uade.dieteticaYuyo.exceptions.CategoryDuplicateException;
import com.proyecto.uade.dieteticaYuyo.service.CategoryService;
import com.proyecto.uade.dieteticaYuyo.entity.dto.CategoryRequest;
import org.springframework.beans.factory.annotation.Autowired;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("categorie")
public class CategoriesController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping()
    public ResponseEntity<Page<Category>> getCategories(
            @RequestParam(required = false, defaultValue = "0") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size) {
        return ResponseEntity.ok(categoryService.getCategories(PageRequest.of(page, size)));
    }
    
    @GetMapping("/categories")
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long categoryId) {
        Optional<Category> result = categoryService.getCategoryById(categoryId);
        if (result.isPresent())
            return ResponseEntity.ok(result.get());

        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/description/{description}")
    public ResponseEntity<List<Category>> getCategoriesByDescription(@PathVariable String description) {
        List<Category> categories = categoryService.findByDescription(description);
        if (!categories.isEmpty()) {
            return ResponseEntity.ok(categories);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @GetMapping("/{categoryId}/products")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Long categoryId) {
        if (!categoryService.getCategoryById(categoryId).isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        
        List<Product> products = categoryService.getProductsByCategory(categoryId);
        return ResponseEntity.ok(products);
    }

    @PutMapping("/CreateCategory")
    public ResponseEntity<?> createCategory(@RequestBody CategoryRequest categoryRequest)
            throws CategoryDuplicateException {
        try {
            Category newCategory = new Category();
            newCategory.setName(categoryRequest.getName());
            newCategory.setDescription(categoryRequest.getDescription());
            
            Category result = categoryService.createCategory(newCategory);
            return ResponseEntity.created(URI.create("/categories/" + result.getId())).body(result);
        } catch (CategoryDuplicateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "La categoría ya existe"));
        }
    }
    
    @PostMapping("/EditCategory/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody  CategoryRequest categoryRequest) {
        Optional<Category> categoryOptional = categoryService.getCategoryById(id);

        if (categoryOptional.isPresent()) {
            Category existingCategory = categoryOptional.get();
            
            existingCategory.setName(categoryRequest.getName());
            existingCategory.setDescription(categoryRequest.getDescription());
            
            return categoryService.updateCategory(existingCategory);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @DeleteMapping("/DeleteCategory/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id) {
        return categoryService.deleteCategoryById(id);
    }
}
