package com.proyecto.uade.dieteticaYuyo.service;

import java.math.BigDecimal;
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
    public Product createProduct(String name, String description, BigDecimal price, Integer stock, Long categoryId, List<String> imageUrls) throws ProductDuplicateException {
        if (productRepository.existsByName(name)) {
            throw new ProductDuplicateException(name);
        }
        if (!categoryRepository.existsById(categoryId)){
            throw new CategoryNotFoundException(categoryId);
        }

        return productRepository.save(Product.builder()
                .name(name)
                .description(description)
                .price(price)
                .stock(stock)
                .categoryId(categoryId)
                .imageUrls(imageUrls)
                .build());
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public Product updateProduct(Long id, String name, String description, BigDecimal price, Integer stock, Long categoryId, List<String> imageUrls) throws ProductDuplicateException {
        Product product = getProductById(id);
        if (productRepository.existsByName(name) &&
                !product.getName().equals(name)) {
            throw new ProductDuplicateException(name);
        }
        if (!categoryRepository.existsById(categoryId)){
            throw new CategoryNotFoundException(categoryId);
        }

        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStock(stock);
        product.setCategoryId(categoryId);
        product.setImageUrls(imageUrls);

        return productRepository.save(product);
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public void deleteProductById(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    @Override
    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

}
