package com.proyecto.uade.dieteticaYuyo.entity.dto;

import java.util.ArrayList;
import java.util.List;

import com.proyecto.uade.dieteticaYuyo.entity.Product;
import com.proyecto.uade.dieteticaYuyo.entity.User;

import lombok.Data;

@Data
public class OrderRequest {
    private int numOrder;
    private User user;
    private List<Product> products = new ArrayList<>();
    private Long count;
}
