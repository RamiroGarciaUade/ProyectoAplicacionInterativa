package com.proyecto.uade.dieteticaYuyo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.proyecto.uade.dieteticaYuyo.entity.Order;
import com.proyecto.uade.dieteticaYuyo.exceptions.OrderDuplicateException;

@Service
public interface OrderService {
    public List<Order> getOrders();

    public Optional<Order> getOrderById(Long orderId);

    public List<Order> findByUserEmail(String email);

    public Order findByNumOrder(int numOrder);

    public ResponseEntity<Order> updateOrder(Order order);

    public Order createOrder(Order order) throws OrderDuplicateException;

    public ResponseEntity<String> deleteOrderById(Long id);
}
