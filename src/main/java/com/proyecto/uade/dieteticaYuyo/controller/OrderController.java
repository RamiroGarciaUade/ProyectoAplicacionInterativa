package com.proyecto.uade.dieteticaYuyo.controller;

import org.springframework.web.bind.annotation.RestController;

import com.proyecto.uade.dieteticaYuyo.entity.Order;
import com.proyecto.uade.dieteticaYuyo.entity.Product;
import com.proyecto.uade.dieteticaYuyo.entity.User;
import com.proyecto.uade.dieteticaYuyo.entity.dto.OrderRequest;
import com.proyecto.uade.dieteticaYuyo.exceptions.OrderDuplicateException;
import com.proyecto.uade.dieteticaYuyo.service.OrderService;
import com.proyecto.uade.dieteticaYuyo.service.ProductService;
import com.proyecto.uade.dieteticaYuyo.service.ServiceUser;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("order")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private ServiceUser userService;

    @Autowired
    private ProductService productService;

    @GetMapping("/orders")
    public List<Order> getOrders() {
        return orderService.getOrders();
    }

    @GetMapping("/order/{orderId}")
    public Optional<Order> getOrderById(@PathVariable Long orderId) {
        return orderService.getOrderById(orderId);
    }

    @GetMapping("/email/{email}")
    public List<Order> findByUserEmail(@PathVariable String email) {
        return orderService.findByUserEmail(email);
    }

    @GetMapping("/numOrder/{numOrder}")
    public Order findByNumOrder(@PathVariable int numOrder) {
        return orderService.findByNumOrder(numOrder);
    }

    @PutMapping("/EditOrder/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody OrderRespond orderRequest) {
        Optional<Order> orderOptional = orderService.getOrderById(id);

        if (orderOptional.isPresent()) {
            Order existingOrder = orderOptional.get();
            existingOrder.setNumOrder(orderRequest.getNumOrder());
            existingOrder.setCount(orderRequest.getCount());

            if (orderRequest.getUser() != null && orderRequest.getUser().getId() != null) {
                Optional<User> userOpt = userService.getUserById(orderRequest.getUser().getId());
                if (userOpt.isPresent()) {
                    existingOrder.setUser(userOpt.get());
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .header("Error", "Usuario no encontrado con ID: " + orderRequest.getUser().getId())
                            .build();
                }
            }

            if (orderRequest.getProducts() != null && !orderRequest.getProducts().isEmpty()) {
                List<Product> productList = new ArrayList<>();

                for (Product productRef : orderRequest.getProducts()) {
                    if (productRef.getId() != null) {
                        Optional<Product> productOpt = productService.getProductById(productRef.getId());
                        if (productOpt.isPresent()) {
                            productList.add(productOpt.get());
                        } else {
                            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                    .header("Error", "Producto no encontrado con ID: " + productRef.getId())
                                    .build();
                        }
                    }
                }

                existingOrder.setProducts(productList);
            }

            Order savedOrder = orderService.updateOrder(existingOrder).getBody();
            return ResponseEntity.ok(savedOrder);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/createOrder")
    public ResponseEntity<?> createOrder(@RequestBody OrderRespond orderRequest) {
        try {
            Order newOrder = new Order();
            newOrder.setNumOrder(orderRequest.getNumOrder());
            newOrder.setCount(orderRequest.getCount());

            if (orderRequest.getUser() != null && orderRequest.getUser().getId() != null) {
                Long userId = orderRequest.getUser().getId();

                Optional<User> userOpt = userService.getUserById(userId);

                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    newOrder.setUser(user);
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(Map.of("error", "Usuario no encontrado con ID: " + userId));
                }
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Se requiere un usuario válido con ID"));
            }

            if (orderRequest.getProducts() != null && !orderRequest.getProducts().isEmpty()) {
                List<Product> productList = new ArrayList<>();

                for (Product productRef : orderRequest.getProducts()) {
                    if (productRef.getId() != null) {
                        Long productId = productRef.getId();

                        Optional<Product> productOpt = productService.getProductById(productId);
                        if (productOpt.isPresent()) {
                            Product product = productOpt.get();
                            productList.add(product);
                        } else {
                            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                    .body(Map.of("error", "Producto no encontrado con ID: " + productId));
                        }
                    }
                }

                newOrder.setProducts(productList);
            }

            Order createdOrder = orderService.createOrder(newOrder);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Orden creada correctamente", "orderId", createdOrder.getId()));
        } catch (OrderDuplicateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al crear la orden: " + e.getMessage()));
        }
    }

    @DeleteMapping("/DeleteOrder/{id}")
    public ResponseEntity<String> deleteOrderById(@PathVariable Long id) {
        return orderService.deleteOrderById(id);
    }
}
