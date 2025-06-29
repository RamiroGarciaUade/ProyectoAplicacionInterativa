package com.proyecto.uade.dieteticaYuyo.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.proyecto.uade.dieteticaYuyo.entity.PurchaseItem;
import com.proyecto.uade.dieteticaYuyo.entity.PurchaseOrder;
import com.proyecto.uade.dieteticaYuyo.entity.PurchaseOrderStatus;
import com.proyecto.uade.dieteticaYuyo.entity.User;
import com.proyecto.uade.dieteticaYuyo.exceptions.PurchaseOrderInsufficientStockException;
import com.proyecto.uade.dieteticaYuyo.exceptions.PurchaseOrderInvalidStateException;
import com.proyecto.uade.dieteticaYuyo.exceptions.PurchaseOrderNotFoundException;

public interface PurchaseOrderService {
    Page<PurchaseOrder> getPagedPurchaseOrders(PageRequest pageRequest);

    List<PurchaseOrder> getAllPurchaseOrders();

    PurchaseOrder getPurchaseOrderById(Long id) throws PurchaseOrderNotFoundException;

    List<PurchaseOrder> getPurchaseOrdersByUserId(Long userId);

    List<PurchaseOrder> getPurchaseOrdersByStatus(PurchaseOrderStatus status);

    PurchaseOrder createPurchaseOrder(User user, List<PurchaseItem> items);

    PurchaseOrder updatePurchaseOrder(Long id, User user, List<PurchaseItem> items) throws PurchaseOrderInvalidStateException;

    void deletePurchaseOrderById(Long id);

    void confirmPurchaseOrder(Long id) throws PurchaseOrderNotFoundException, PurchaseOrderInsufficientStockException;

    void cancelPurchaseOrder(Long id) throws PurchaseOrderNotFoundException;

    void updateOrderStatus(Long id, PurchaseOrderStatus status) throws PurchaseOrderNotFoundException, PurchaseOrderInsufficientStockException;

}
