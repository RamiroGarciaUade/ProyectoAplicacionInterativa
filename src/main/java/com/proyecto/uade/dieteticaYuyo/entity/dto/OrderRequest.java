package com.proyecto.uade.dieteticaYuyo.entity.dto;

import java.util.List;

import com.proyecto.uade.dieteticaYuyo.entity.Product;
import com.proyecto.uade.dieteticaYuyo.entity.User;

import lombok.Data;

@Data
public class OrderRequest {
    private int numOrder;
    private User user;
    private List<Product> products;
    private Long count;
}