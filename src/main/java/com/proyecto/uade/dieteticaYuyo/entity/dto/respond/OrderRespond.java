package com.proyecto.uade.dieteticaYuyo.entity.dto.respond;

import java.util.ArrayList;
import java.util.List;

import com.proyecto.uade.dieteticaYuyo.entity.Product;

import lombok.Data;

@Data
public class OrderRespond {
    private int numOrder;
    private List<Product> products = new ArrayList<>();
    private Double total_price;
}
