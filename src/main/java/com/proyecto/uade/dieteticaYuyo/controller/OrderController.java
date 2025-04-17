package com.proyecto.uade.dieteticaYuyo.controller;

import org.springframework.web.bind.annotation.RestController;

import com.proyecto.uade.dieteticaYuyo.entity.Order;
import com.proyecto.uade.dieteticaYuyo.exceptions.OrderDuplicateException;
import com.proyecto.uade.dieteticaYuyo.service.OrderService;

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

    @GetMapping("/all")
    public List<Order> getOrders(){
        return orderService.getOrders();
    }
    @GetMapping("/{orderId}")
    public Optional<Order> getOrderById(@PathVariable Long orderId){
        return orderService.getOrderById(orderId);
    }
    @GetMapping("/email/{email}")
    public List<Order> findByUserEmail(String email){
        return orderService.findByUserEmail(email);
    }
    @GetMapping("/numOrder/{numOrder}")
    public Order findByNumOrder(int numOrder){
        return orderService.findByNumOrder(numOrder);
    }

    @PostMapping("/EditOrder/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id , Order updatedOrder){
        Optional<Order> orderOptional = orderService.getOrderById(id);

        if (orderOptional.isPresent()) {
            Order existingOrder= orderOptional.get();
            existingOrder.setNumOrder(updatedOrder.getNumOrder());
            existingOrder.setProducts(updatedOrder.getProducts());
            existingOrder.setUser(updatedOrder.getUser());
            existingOrder.setCount(updatedOrder.getCount());

            Order savedOrder = orderService.updateOrder(existingOrder).getBody();

            return ResponseEntity.ok(savedOrder);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    @PutMapping("/createOrder")
    public ResponseEntity<?> createOrder(@RequestBody Order order) throws OrderDuplicateException{
         try {
            // Intenta crear el order
            Order createdOrder = orderService.createOrder(order);
            // Respuesta exitosa
            return ResponseEntity.ok(Map.of("order", createdOrder.getNumOrder()));
        } catch (OrderDuplicateException e) {
            // Manejar la excepción y devolver un mensaje de error
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    @DeleteMapping("/DeleteOrder/{id}")
    public ResponseEntity<String> deleteOrderById(Long id){
        return orderService.deleteOrderById(id);
    }
}
