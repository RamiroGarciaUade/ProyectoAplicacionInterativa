package com.proyecto.uade.dieteticaYuyo.entity.dto.request;

import com.proyecto.uade.dieteticaYuyo.entity.User;

import lombok.Data;

@Data
public class OrderRequest {
    private int numOrder;
    private User user;
    private Double total_price;
}
