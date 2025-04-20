package com.proyecto.uade.dieteticaYuyo.entity.dto;

import com.proyecto.uade.dieteticaYuyo.entity.PurchaseOrder;
import com.proyecto.uade.dieteticaYuyo.entity.User;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PurchaseOrderResponseDTO {
    private Long id;
    private UserSummaryDTO user;
    private List<ItemDetailDTO> items;
    private BigDecimal subtotal;
    private LocalDateTime orderDate;
    private String status;

    @Data
    public static class UserSummaryDTO {
        private Long id;
        private String username;
        private String email;
    }

    @Data
    public static class ItemDetailDTO {
        private Long productId;
        private String productName;
        private BigDecimal unitPrice;
        private int quantity;
    }

    public static PurchaseOrderResponseDTO fromPurchaseOrder(PurchaseOrder order) {
        PurchaseOrderResponseDTO dto = new PurchaseOrderResponseDTO();
        dto.setId(order.getId());
        dto.setOrderDate(order.getDate());
        dto.setSubtotal(order.getSubtotal());
        dto.setStatus(order.getStatus().name());

        User user = order.getUser();
        UserSummaryDTO userDto = new UserSummaryDTO();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        dto.setUser(userDto);

        List<ItemDetailDTO> items = order.getItems().stream().map(item -> {
            ItemDetailDTO itemDto = new ItemDetailDTO();
            itemDto.setProductId(item.getProduct().getId());
            itemDto.setProductName(item.getProduct().getName());
            itemDto.setUnitPrice(item.getProduct().getPrice());
            itemDto.setQuantity(item.getQuantity());
            return itemDto;
        }).toList();

        dto.setItems(items);
        return dto;
    }
}
