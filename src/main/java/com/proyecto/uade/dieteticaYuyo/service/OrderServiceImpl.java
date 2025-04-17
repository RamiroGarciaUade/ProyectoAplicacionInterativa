package com.proyecto.uade.dieteticaYuyo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyecto.uade.dieteticaYuyo.entity.Order;
import com.proyecto.uade.dieteticaYuyo.exceptions.OrderDuplicateException;
import com.proyecto.uade.dieteticaYuyo.repository.OrderRepository;

@Service
public class OrderServiceImpl implements OrderService{
    @Autowired
    private OrderRepository orderRepository;

    @Override
    public List<Order> getOrders(){
        return orderRepository.findAll();
    }

    @Override
    public Optional<Order> getOrderById(Long orderId){
        return orderRepository.findById(orderId);
    }

    @Override
    public List<Order> findByUserEmail(String email){
        return orderRepository.findByUserEmail(email);
    }

    @Override
    public Order findByNumOrder(int numOrder){
        return orderRepository.findByNumOrder(numOrder);
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public ResponseEntity<Order> updateOrder(Order order){
        Optional<Order> existingOrder = orderRepository.findById(order.getId());

        if (existingOrder.isPresent()) {
            Order orderToUpdate = existingOrder.get();
            orderToUpdate.setNumOrder(order.getNumOrder());
            orderToUpdate.setProducts(order.getProducts());
            orderToUpdate.setUser(order.getUser());

            Order updatedOrder = orderRepository.save(orderToUpdate);

            return ResponseEntity.ok(updatedOrder);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @Override
    @Transactional(rollbackFor = Throwable.class)
    public Order createOrder(Order order) throws OrderDuplicateException{
        // Verificar si ya existe un producto con la misma descripción
        Order existingOrder = orderRepository.findByNumOrder(order.getNumOrder());
        if (existingOrder != null) {
            throw new OrderDuplicateException();
        }
        
        return orderRepository.save(order);
    }
    @Override
    @Transactional(rollbackFor = Throwable.class)
    public ResponseEntity<String> deleteOrderById(Long id){
        Optional<Order> order = orderRepository.findById(id);

        if (order.isPresent()) {
            orderRepository.delete(order.get());
            return ResponseEntity.ok("El producto ya fue borrado.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No existe el producto.");
        }
    }
}