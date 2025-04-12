package com.proyecto.uade.dieteticaYuyo.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.proyecto.uade.dieteticaYuyo.entity.Product;
import com.proyecto.uade.dieteticaYuyo.exceptions.ProductDuplicateException;
import com.proyecto.uade.dieteticaYuyo.repository.ProductRepository;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Product> getProducts() {
        return (ArrayList<Product>) productRepository.findAll();
    }
    
    @Override
    public Page<Product> getProductsPage(PageRequest pageRequest) {
        return productRepository.findAll(pageRequest);
    }

    @Override
    public Optional<Product> getProductById(Long productId) {
        return productRepository.findById(productId);
    }

    @Override
    public Product findByQualification(String qualification) {
        return productRepository.findByQualification(qualification);
    }

    @Override
    public ResponseEntity<Product> updateProduct(Product product) {
        Optional<Product> existingProduct = productRepository.findById(product.getId());

        if (existingProduct.isPresent()) {
            Product productToUpdate = existingProduct.get();
            productToUpdate.setQualification(product.getQualification());
            productToUpdate.setDescription(product.getDescription());
            productToUpdate.setPrice(product.getPrice());
            productToUpdate.setImages(product.getImages());
            productToUpdate.setCategory(product.getCategory());

            Product updatedProduct = productRepository.save(productToUpdate);

            return ResponseEntity.ok(updatedProduct);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    public Product createProduct(Product product) throws ProductDuplicateException {
        // Verificar si ya existe un producto con la misma descripción
        Product existingProduct = productRepository.findByQualification(product.getQualification());
        if (existingProduct != null) {
            throw new ProductDuplicateException();
        }
        
        return productRepository.save(product);
    }

    @Override
    public ResponseEntity<String> deleteProductById(Long id) {
        Optional<Product> product = productRepository.findById(id);

        if (product.isPresent()) {
            productRepository.delete(product.get());
            return ResponseEntity.ok("El producto ya fue borrado.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No existe el producto.");
        }
    }
} 