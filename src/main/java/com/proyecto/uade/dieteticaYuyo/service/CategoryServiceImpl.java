package com.proyecto.uade.dieteticaYuyo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyecto.uade.dieteticaYuyo.entity.Category;
import com.proyecto.uade.dieteticaYuyo.repository.CategoryRepository;
import com.proyecto.uade.dieteticaYuyo.exceptions.CategoryDuplicateException;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public Page<Category> getCategories(PageRequest pageable) {
        return categoryRepository.findAll(pageable);
    }

    public Optional<Category> getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId);
    }

    @Transactional(rollbackFor = Throwable.class) // se asegura que si no se ejecuta la operacion la cancela los cambios realicado (compro un producto no se termina y restaura el stock)
    public Category createCategory(String description) throws CategoryDuplicateException {
        List<Category> categories = categoryRepository.findByDescription(description);
        if (categories.isEmpty())
            return categoryRepository.save(new Category(description));
        throw new CategoryDuplicateException();
    }

    @Transactional(rollbackFor = Throwable.class)
    public ResponseEntity<Category> updateCategory(Category category){
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

    @Transactional(rollbackFor = Throwable.class)
    public ResponseEntity<String> deleteCategoryById(Long id){
        Optional<Category> category = categoryRepository.findById(id);

        if (category.isPresent()) {
            categoryRepository.delete(category.get());
            return ResponseEntity.ok("La categoria ya fue borrado.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No existe esta categoria.");
        }
    }
}
