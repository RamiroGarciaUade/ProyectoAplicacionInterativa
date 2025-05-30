package com.proyecto.uade.dieteticaYuyo.service;

import java.util.List;

import com.proyecto.uade.dieteticaYuyo.exceptions.CategoryNotFoundException;

import com.proyecto.uade.dieteticaYuyo.exceptions.UserDuplicateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyecto.uade.dieteticaYuyo.entity.Category;
import com.proyecto.uade.dieteticaYuyo.repository.CategoryRepository;
import com.proyecto.uade.dieteticaYuyo.exceptions.CategoryDuplicateException;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public Page<Category> getPagedCategories(PageRequest pageRequest) {
        return categoryRepository.findAll(pageRequest);
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(Long id) throws CategoryNotFoundException {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException(id));
    }

    @Override
    public Category getCategoryByName(String name) throws CategoryNotFoundException {
        return categoryRepository.findByName(name)
                .orElseThrow(() -> new CategoryNotFoundException(name));
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public Category createCategory(String name, String description) throws CategoryDuplicateException {
        if (categoryRepository.existsByName(name)) {
            throw new CategoryDuplicateException(name);
        }
        return categoryRepository.save(Category.builder()
                .name(name)
                .description(description)
                .build());
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public Category updateCategory(Long id, String name, String description) throws CategoryDuplicateException {
        Category category = getCategoryById(id);
        if (categoryRepository.existsByName(name) &&
                !category.getName().equals(name)) {
            throw new UserDuplicateException(name);
        }

        category.setName(name);
        category.setDescription(description);

        return categoryRepository.save(category);
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public void deleteCategoryById(Long id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }

}
