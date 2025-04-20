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
    @GetMapping
    public ResponseEntity<List<PurchaseOrderResponseDTO>> getAllOrders() {
        List<PurchaseOrder> purchaseOrders = purchaseOrderService.getAllPurchaseOrders();
        List<PurchaseOrderResponseDTO> purchaseOrderDTOs = purchaseOrders.stream()
                .map(PurchaseOrderResponseDTO::fromPurchaseOrder)
                .toList();

        return ResponseEntity.ok(purchaseOrderDTOs);
    }

    // GET /purchase-orders/paged
    @GetMapping("/paged")
    public ResponseEntity<Page<PurchaseOrderResponseDTO>> getPagedCategories(
            @RequestParam(required = false, defaultValue = "0") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size) {

        Page<PurchaseOrder> purchaseOrderPage = purchaseOrderService.getPagedPurchaseOrders(PageRequest.of(page, size));
        Page<PurchaseOrderResponseDTO> purchaseOrderDTOPage = purchaseOrderPage.map(PurchaseOrderResponseDTO::fromPurchaseOrder);

        return ResponseEntity.ok(purchaseOrderDTOPage);
    }

    // GET /purchase-orders/{id}
    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrderResponseDTO> getPurchaseOrderById(@PathVariable Long id) {
        PurchaseOrder purchaseOrder = purchaseOrderService.getPurchaseOrderById(id);
        return ResponseEntity.ok(PurchaseOrderResponseDTO.fromPurchaseOrder(purchaseOrder));
    }

    // GET /purchase-orders/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PurchaseOrderResponseDTO>> getPurchaseOrdersByUser(@PathVariable Long userId) {
        List<PurchaseOrderResponseDTO> orders = purchaseOrderService.getPurchaseOrdersByUserId(userId)
                .stream().map(PurchaseOrderResponseDTO::fromPurchaseOrder).toList();
        return ResponseEntity.ok(orders);
    }

    // GET /purchase-orders/status/{status}
    @GetMapping("/status/{status}")
    public ResponseEntity<List<PurchaseOrderResponseDTO>> getPurchaseOrdersByStatus(@PathVariable PurchaseOrderStatus status) {
        List<PurchaseOrderResponseDTO> orders = purchaseOrderService.getPurchaseOrdersByStatus(status)
                .stream().map(PurchaseOrderResponseDTO::fromPurchaseOrder).toList();
        return ResponseEntity.ok(orders);
    }

    // POST /purchase-orders
    @PostMapping
    public ResponseEntity<?> createPurchaseOrder(@RequestBody PurchaseOrderRequestDTO request) {
        User user = userService.getUserById(request.getUserId());

        PurchaseOrder order = new PurchaseOrder();
        order.setStatus(PurchaseOrderStatus.PENDING);
        order.setUser(user);
        order.setItems(request.getItems().stream().map(dto -> {
            Product product = productService.getProductById(dto.getProductId());
            PurchaseItem item = new PurchaseItem();
            item.setProduct(product);
            item.setQuantity(dto.getQuantity());
            item.setOrder(order);
            return item;
        }).toList());

        PurchaseOrder savedPurchaseOrder = purchaseOrderService.createPurchaseOrder(order);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("message", "Orden de compra " + savedPurchaseOrder.getId().toString() + " creada con éxito"));
    }

    // PUT /purchase-orders/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(
            @PathVariable Long id,
            @RequestBody PurchaseOrderRequestDTO request
    ) {
        User user = userService.getUserById(request.getUserId());

        PurchaseOrder existingPurchaseOrder = purchaseOrderService.getPurchaseOrderById(id);

        List<PurchaseItem> updatedItems = request.getItems().stream().map(dto -> {
            Product product = productService.getProductById(dto.getProductId());
            PurchaseItem item = new PurchaseItem();
            item.setProduct(product);
            item.setQuantity(dto.getQuantity());
            item.setOrder(existingPurchaseOrder);
            return item;
        }).toList();

        existingPurchaseOrder.setUser(user);
        existingPurchaseOrder.setItems(updatedItems);

        PurchaseOrder updatedPurchaseOrder = purchaseOrderService.updatePurchaseOrder(existingPurchaseOrder);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(Map.of("message", "Orden de compra " + updatedPurchaseOrder.getId().toString() + " actualizada con éxito"));
    }

    // DELETE /purchase-orders/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePurchaseOrder(@PathVariable Long id) {
        purchaseOrderService.deletePurchaseOrderById(id);
        return ResponseEntity.ok(Map.of("message", "Orden de compra eliminada con éxito"));
    }

    // PUT /purchase-orders/{id}/confirm
    @PutMapping("/{id}/confirm")
    public ResponseEntity<?> confirmPurchaseOrder(@PathVariable Long id) {
        purchaseOrderService.confirmPurchaseOrder(id);
        return ResponseEntity.ok(Map.of("message", "Orden de compra confirmada con éxito"));
    }

    // PUT /purchase-orders/{id}/cancel
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelPurchaseOrder(@PathVariable Long id) {
        purchaseOrderService.cancelPurchaseOrder(id);
        return ResponseEntity.ok(Map.of("message", "Orden de compra cancelada con éxito"));
    }

}
