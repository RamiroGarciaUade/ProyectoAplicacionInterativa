package com.proyecto.uade.dieteticaYuyo.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import com.proyecto.uade.dieteticaYuyo.entity.dto.ProductResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.uade.dieteticaYuyo.entity.Product;
import com.proyecto.uade.dieteticaYuyo.entity.dto.ProductRequestDTO;
import com.proyecto.uade.dieteticaYuyo.service.ProductService;

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

    // GET /products
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        List<ProductResponseDTO> productDTOs = products.stream()
                .map(ProductResponseDTO::fromProduct)
                .toList();

        return ResponseEntity.ok(productDTOs);
    }

    // GET /products/paged
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @GetMapping("/paged")
    public ResponseEntity<Page<ProductResponseDTO>> getPagedProducts(
            @RequestParam(required = false, defaultValue = "0") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size) {

        Page<Product> productPage = productService.getPagedProducts(PageRequest.of(page, size));
        Page<ProductResponseDTO> productDTOPage = productPage.map(ProductResponseDTO::fromProduct);

        return ResponseEntity.ok(productDTOPage);
    }

    // GET /products/{id}
    @PreAuthorize("hasAnyAuthority( 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(ProductResponseDTO.fromProduct(product));
    }

    // GET /products/name/{name}
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    @GetMapping("/name/{name}")
    public ResponseEntity<ProductResponseDTO> getProductByName(@PathVariable String name) {
        Product product = productService.getProductByName(name);
        return ResponseEntity.ok(ProductResponseDTO.fromProduct(product));
    }

    // GET /products/category/{categoryId}
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByCategory(@PathVariable Long categoryId) {
        List<Product> products = productService.getProductsByCategory(categoryId);
        List<ProductResponseDTO> productDTOs = products.stream()
                .map(ProductResponseDTO::fromProduct)
                .toList();

        return ResponseEntity.ok(productDTOs);
    }

    // POST /products
    @PreAuthorize("hasAnyAuthority( 'ADMIN')")
    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody ProductRequestDTO requestDTO) {
        Product savedProduct = productService.createProduct(requestDTO.getName(), requestDTO.getDescription(), requestDTO.getPrice(), requestDTO.getStock(), requestDTO.getCategoryId(), requestDTO.getImageUrls());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("message", "Producto " + savedProduct.getName() + " creado con éxito"));
    }

    // PUT /products/{id}
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody ProductRequestDTO requestDTO) {
        Product currentProduct = productService.getProductById(id);

        String name = requestDTO.getName() != null ? requestDTO.getName() : currentProduct.getName();
        String description = requestDTO.getName() != null ? requestDTO.getDescription() : currentProduct.getDescription();
        BigDecimal price = requestDTO.getPrice() != null ? requestDTO.getPrice() : currentProduct.getPrice();
        Integer stock = requestDTO.getStock() != null ? requestDTO.getStock() : currentProduct.getStock();
        Long categoryId = requestDTO.getCategoryId() != null ? requestDTO.getCategoryId() : currentProduct.getCategoryId();
        List<String> imageUrls = requestDTO.getImageUrls() != null ? requestDTO.getImageUrls() : currentProduct.getImageUrls();

        Product updatedProduct = productService.updateProduct(id, name, description, price, stock, categoryId, imageUrls);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(Map.of("message", "Producto " + updatedProduct.getName() + " actualizado con éxito"));
    }

    // DELETE /products/{id}
    @PreAuthorize("hasAnyAuthority( 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.deleteProductById(id);
        return ResponseEntity.ok(Map.of("message", "Producto eliminado con éxito"));
    }

}
