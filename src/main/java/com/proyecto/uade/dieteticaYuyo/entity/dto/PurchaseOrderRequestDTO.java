package com.proyecto.uade.dieteticaYuyo.entity.dto;

import lombok.Data;
import java.util.List;

@Data
public class PurchaseOrderRequestDTO {
    private Long userId;
    private List<PurchaseItemDTO> items;

    @Data
    public static class PurchaseItemDTO {
        private Long productId;
        private int quantity;
    }
}
