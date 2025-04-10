package com.proyecto.uade.dieteticaYuyo.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.uade.dieteticaYuyo.entity.Product;
import com.proyecto.uade.dieteticaYuyo.entity.dto.ProductRequest;
import com.proyecto.uade.dieteticaYuyo.exceptions.ProductDuplicateException;
import com.proyecto.uade.dieteticaYuyo.service.ProductService;
import com.proyecto.uade.dieteticaYuyo.service.CategoryService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("products")
public class ProductController {
    @Autowired
    private ProductService productService;
    
    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public Page<Product> getProducts(
            @RequestParam(required = false, defaultValue = "0") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size) {
        return productService.getProductsPage(PageRequest.of(page, size));
    }
    
    @GetMapping("/all")
    public List<Product> getAllProducts() {
        return productService.getProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        if (product.isPresent()) {
            return ResponseEntity.ok(product.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/description/{description}")
    public ResponseEntity<Product> getProductByDescription(@PathVariable String description) {
        Product product = productService.findByDescription(description);
        if (product != null) {
            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody ProductRequest productRequest) {
        try {
            Product newProduct = new Product();
            newProduct.setDescription(productRequest.getDescription());
            newProduct.setPrice(productRequest.getPrice());
            newProduct.setImages(productRequest.getImages());
            
            // Asignar categoría si se proporciona ID
            if (productRequest.getCategoryId() != null) {
                categoryService.getCategoryById(productRequest.getCategoryId())
                    .ifPresent(newProduct::setCategory);
            }
            
            Product createdProduct = productService.createProduct(newProduct);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
        } catch (ProductDuplicateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "El producto ya existe"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody ProductRequest productRequest) {
        Optional<Product> productOptional = productService.getProductById(id);

        if (productOptional.isPresent()) {
            Product existingProduct = productOptional.get();

            existingProduct.setDescription(productRequest.getDescription());
            existingProduct.setPrice(productRequest.getPrice());
            existingProduct.setImages(productRequest.getImages());
            
            // Actualizar categoría si se proporciona ID
            if (productRequest.getCategoryId() != null) {
                categoryService.getCategoryById(productRequest.getCategoryId())
                    .ifPresent(existingProduct::setCategory);
            }

            Product updatedProduct = productService.updateProduct(existingProduct).getBody();
            return ResponseEntity.ok(updatedProduct);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        return productService.deleteProductById(id);
    }
} 