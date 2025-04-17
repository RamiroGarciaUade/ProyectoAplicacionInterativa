package com.proyecto.uade.dieteticaYuyo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyecto.uade.dieteticaYuyo.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order,Long>{
    List<Order> findByUserEmail(String email);
    Order findByNumOrder(int numOrder);
}