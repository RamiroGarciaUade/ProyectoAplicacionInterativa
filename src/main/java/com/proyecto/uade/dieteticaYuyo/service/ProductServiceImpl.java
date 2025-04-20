package com.proyecto.uade.dieteticaYuyo.service;

import java.util.List;

import com.proyecto.uade.dieteticaYuyo.exceptions.CategoryNotFoundException;
import com.proyecto.uade.dieteticaYuyo.exceptions.ProductNotFoundException;
import com.proyecto.uade.dieteticaYuyo.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyecto.uade.dieteticaYuyo.entity.Product;
import com.proyecto.uade.dieteticaYuyo.exceptions.ProductDuplicateException;
import com.proyecto.uade.dieteticaYuyo.repository.ProductRepository;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public Page<Product> getPagedProducts(PageRequest pageRequest) {
        return productRepository.findAll(pageRequest);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(Long id) throws ProductNotFoundException {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    @Override
    public Product getProductByName(String name) throws ProductNotFoundException {
        return productRepository.findByName(name)
                .orElseThrow(() -> new ProductNotFoundException(name));
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public Product createProduct(Product product) throws ProductDuplicateException {
        if (productRepository.existsByName(product.getName())) {
            throw new ProductDuplicateException(product.getName());
        }
        if (!categoryRepository.existsById(product.getCategoryId())){
            throw new CategoryNotFoundException(product.getCategoryId());
        }
        return productRepository.save(product);
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public Product updateProduct(Product updatedProduct) throws ProductDuplicateException {
        Product existingProduct = getProductById(updatedProduct.getId());
        if (productRepository.existsByName(updatedProduct.getName()) &&
                !existingProduct.getName().equals(updatedProduct.getName())) {
            throw new ProductDuplicateException(updatedProduct.getName());
        }
        if (!categoryRepository.existsById(updatedProduct.getCategoryId())){
            throw new CategoryNotFoundException(updatedProduct.getCategoryId());
        }

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setStock(updatedProduct.getStock());
        existingProduct.setCategoryId(updatedProduct.getCategoryId());
        existingProduct.setImageUrls(updatedProduct.getImageUrls());

        return productRepository.save(existingProduct);
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public void deleteProductById(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    @Override
    public List<Product> findProductsByCategoryId(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

}
