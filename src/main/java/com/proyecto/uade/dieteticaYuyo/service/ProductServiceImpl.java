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

import com.proyecto.uade.dieteticaYuyo.entity.Product;
import com.proyecto.uade.dieteticaYuyo.exceptions.ProductDuplicateException;
import com.proyecto.uade.dieteticaYuyo.repository.CategoryRepository;
import com.proyecto.uade.dieteticaYuyo.repository.ProductRepository;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<Product> getProducts() {
        List<Product> products = productRepository.findAll();
        return loadCategoriesInProducts(products);
    }
    
    @Override
    public Page<Product> getProductsPage(PageRequest pageRequest) {
        Page<Product> productsPage = productRepository.findAll(pageRequest);
        productsPage.getContent().forEach(this::loadCategoryInProduct);
        return productsPage;
    }

    @Override
    public Optional<Product> getProductById(Long productId) {
        Optional<Product> productOpt = productRepository.findById(productId);
        productOpt.ifPresent(this::loadCategoryInProduct);
        return productOpt;
    }

    @Override
    public Product findByQualification(String qualification) {
        Product product = productRepository.findByQualification(qualification);
        return loadCategoryInProduct(product);
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public ResponseEntity<Product> updateProduct(Product product) {
        Optional<Product> existingProduct = productRepository.findById(product.getId());

        if (existingProduct.isPresent()) {
            Product productToUpdate = existingProduct.get();
            productToUpdate.setQualification(product.getQualification());
            productToUpdate.setDescription(product.getDescription());
            productToUpdate.setPrice(product.getPrice());
            productToUpdate.setDiscount(product.getDiscount());
            productToUpdate.setImages(product.getImages());
            productToUpdate.setCategoryId(product.getCategoryId());

            Product updatedProduct = productRepository.save(productToUpdate);
            loadCategoryInProduct(updatedProduct);

            return ResponseEntity.ok(updatedProduct);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public Product createProduct(Product product) throws ProductDuplicateException {
        Product existingProduct = productRepository.findByQualification(product.getQualification());
        if (existingProduct != null) {
            throw new ProductDuplicateException();
        }
        
        Product savedProduct = productRepository.save(product);
        return loadCategoryInProduct(savedProduct);
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public ResponseEntity<String> deleteProductById(Long id) {
        Optional<Product> product = productRepository.findById(id);

        if (product.isPresent()) {
            productRepository.delete(product.get());
            return ResponseEntity.ok("El producto ya fue borrado.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No existe el producto.");
        }
    }
    
    @Override
    public Product loadCategoryInProduct(Product product) {
        if (product != null && product.getCategoryId() != null) {
            categoryRepository.findById(product.getCategoryId())
                .ifPresent(product::setCategory);
        }
        return product;
    }
    
    @Override
    public List<Product> loadCategoriesInProducts(List<Product> products) {
        if (products != null) {
            products.forEach(this::loadCategoryInProduct);
        }
        return products;
    }
    
    @Override
    public List<Product> findProductsByCategoryId(Long categoryId) {
        List<Product> products = productRepository.findByCategoryId(categoryId);
        return loadCategoriesInProducts(products);
    }
} 