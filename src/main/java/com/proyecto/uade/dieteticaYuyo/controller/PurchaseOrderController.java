package com.proyecto.uade.dieteticaYuyo.controller;

import com.proyecto.uade.dieteticaYuyo.entity.*;
import com.proyecto.uade.dieteticaYuyo.entity.dto.PurchaseOrderRequestDTO;
import com.proyecto.uade.dieteticaYuyo.entity.dto.PurchaseOrderResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.proyecto.uade.dieteticaYuyo.service.PurchaseOrderService;
import com.proyecto.uade.dieteticaYuyo.service.ProductService;
import com.proyecto.uade.dieteticaYuyo.service.UserService;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("purchase-orders")
public class PurchaseOrderController {
    @Autowired
    private PurchaseOrderService purchaseOrderService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    // GET /purchase-orders
    @PreAuthorize("hasAnyAuthority( 'ADMIN')")
    @GetMapping
    public ResponseEntity<List<PurchaseOrderResponseDTO>> getAllOrders() {
        List<PurchaseOrder> purchaseOrders = purchaseOrderService.getAllPurchaseOrders();
        List<PurchaseOrderResponseDTO> purchaseOrderDTOs = purchaseOrders.stream()
                .map(PurchaseOrderResponseDTO::fromPurchaseOrder)
                .toList();

        return ResponseEntity.ok(purchaseOrderDTOs);
    }

    // GET /purchase-orders/paged
    @PreAuthorize("hasAnyAuthority( 'ADMIN')")
    @GetMapping("/paged")
    public ResponseEntity<Page<PurchaseOrderResponseDTO>> getPagedCategories(
            @RequestParam(required = false, defaultValue = "0") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size) {

        Page<PurchaseOrder> purchaseOrderPage = purchaseOrderService.getPagedPurchaseOrders(PageRequest.of(page, size));
        Page<PurchaseOrderResponseDTO> purchaseOrderDTOPage = purchaseOrderPage.map(PurchaseOrderResponseDTO::fromPurchaseOrder);

        return ResponseEntity.ok(purchaseOrderDTOPage);
    }

    // GET /purchase-orders/{id}
    @PreAuthorize("hasAnyAuthority( 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrderResponseDTO> getPurchaseOrderById(@PathVariable Long id) {
        PurchaseOrder purchaseOrder = purchaseOrderService.getPurchaseOrderById(id);
        return ResponseEntity.ok(PurchaseOrderResponseDTO.fromPurchaseOrder(purchaseOrder));
    }

    // GET /purchase-orders/user/{userId}
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PurchaseOrderResponseDTO>> getPurchaseOrdersByUser(@PathVariable Long userId) {
        List<PurchaseOrderResponseDTO> orders = purchaseOrderService.getPurchaseOrdersByUserId(userId)
                .stream().map(PurchaseOrderResponseDTO::fromPurchaseOrder).toList();
        return ResponseEntity.ok(orders);
    }

    // GET /purchase-orders/status/{status}
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<PurchaseOrderResponseDTO>> getPurchaseOrdersByStatus(@PathVariable PurchaseOrderStatus status) {
        List<PurchaseOrderResponseDTO> orders = purchaseOrderService.getPurchaseOrdersByStatus(status)
                .stream().map(PurchaseOrderResponseDTO::fromPurchaseOrder).toList();
        return ResponseEntity.ok(orders);
    }

    // POST /purchase-orders
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    @PostMapping
    public ResponseEntity<?> createPurchaseOrder(@RequestBody PurchaseOrderRequestDTO requestDTO) {
        User user = userService.getUserById(requestDTO.getUserId());
        List<PurchaseItem> items = requestDTO.getItems().stream()
                .map(purchaseItemDTO -> PurchaseItem.builder()
                        .product(productService.getProductById(purchaseItemDTO.getProductId()))
                        .quantity(purchaseItemDTO.getQuantity())
                        .build())
                .toList();

        PurchaseOrder savedPurchaseOrder = purchaseOrderService.createPurchaseOrder(user, items);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("message", "Orden de compra número: " + savedPurchaseOrder.getId().toString() + " creada con éxito"));
    }

    // PUT /purchase-orders/{id}
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(
            @PathVariable Long id,
            @RequestBody PurchaseOrderRequestDTO requestDTO
    ) {
        PurchaseOrder currentPurchaseOrder = purchaseOrderService.getPurchaseOrderById(id);
        User user = requestDTO.getUserId() != null ? userService.getUserById(requestDTO.getUserId()) : currentPurchaseOrder.getUser();
        List<PurchaseItem> items = requestDTO.getItems() != null ? requestDTO.getItems().stream()
                .map(purchaseItemDTO -> PurchaseItem.builder()
                        .product(productService.getProductById(purchaseItemDTO.getProductId()))
                        .quantity(purchaseItemDTO.getQuantity())
                        .build())
                .toList() : currentPurchaseOrder.getItems();

        PurchaseOrder updatedPurchaseOrder = purchaseOrderService.updatePurchaseOrder(id, user, items);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(Map.of("message", "Orden de compra número: " + id + " actualizada con éxito"));
    }

    // DELETE /purchase-orders/{id}
    @PreAuthorize("hasAnyAuthority( 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePurchaseOrder(@PathVariable Long id) {
        purchaseOrderService.deletePurchaseOrderById(id);
        return ResponseEntity.ok(Map.of("message", "Orden de compra número: " + id + " eliminada con éxito"));
    }

    // PUT /purchase-orders/{id}/confirm
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    @PutMapping("/{id}/confirm")
    public ResponseEntity<?> confirmPurchaseOrder(@PathVariable Long id) {
        purchaseOrderService.confirmPurchaseOrder(id);
        return ResponseEntity.ok(Map.of("message", "Orden de compra número: " + id + " confirmada con éxito"));
    }

    // PUT /purchase-orders/{id}/cancel
    @PreAuthorize("hasAnyAuthority( 'ADMIN')")
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelPurchaseOrder(@PathVariable Long id) {
        purchaseOrderService.cancelPurchaseOrder(id);
        return ResponseEntity.ok(Map.of("message", "Orden de compra número: " + id + "  cancelada con éxito"));
    }

}
