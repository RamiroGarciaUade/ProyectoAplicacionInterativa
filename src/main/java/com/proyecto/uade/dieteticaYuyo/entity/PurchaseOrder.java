package com.proyecto.uade.dieteticaYuyo.entity;

import com.proyecto.uade.dieteticaYuyo.exceptions.PurchaseItemInvalidException;
import jakarta.persistence.*;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "purchase_orders")
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PurchaseOrderStatus status;

    @Column(nullable = false)
    private LocalDateTime date;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private final List<PurchaseItem> items = new ArrayList<>();

    @Column(nullable = false)
    @PositiveOrZero
    private BigDecimal subtotal;

    public List<PurchaseItem> getItems() {
        return Collections.unmodifiableList(items);
    }

    public void addItem(Product product, int quantity) {
        if (product == null || quantity <= 0) {
            throw new PurchaseItemInvalidException();
        }
        PurchaseItem item = new PurchaseItem();
        item.setProduct(product);
        item.setQuantity(quantity);
        item.setOrder(this);
        this.items.add(item);
    }

    public void removeItem(PurchaseItem item) {
        this.items.remove(item);
        item.setOrder(null);
    }

    public void clearItems() {
        for (PurchaseItem item : items) {
            item.setOrder(null);
        }
        items.clear();
    }

    private void setDateNow() {
        this.date = LocalDateTime.now();
    }

    private void calculateSubtotal() {
        this.subtotal = items.stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @PrePersist
    public void prePersist() {
        setDateNow();
        calculateSubtotal();
    }

    @PreUpdate
    public void preUpdate() {
        calculateSubtotal();
    }

}
