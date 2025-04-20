package com.proyecto.uade.dieteticaYuyo.service;

import java.util.List;

import com.proyecto.uade.dieteticaYuyo.entity.PurchaseOrderStatus;
import com.proyecto.uade.dieteticaYuyo.exceptions.PurchaseOrderInsufficientStockException;
import com.proyecto.uade.dieteticaYuyo.exceptions.PurchaseOrderInvalidStateException;
import com.proyecto.uade.dieteticaYuyo.exceptions.PurchaseOrderNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.proyecto.uade.dieteticaYuyo.entity.PurchaseOrder;

@Service
public interface PurchaseOrderService {
    Page<PurchaseOrder> getPagedPurchaseOrders(PageRequest pageRequest);

    List<PurchaseOrder> getAllPurchaseOrders();

    PurchaseOrder getPurchaseOrderById(Long id) throws PurchaseOrderNotFoundException;

    List<PurchaseOrder> getPurchaseOrdersByUserId(Long userId);

    List<PurchaseOrder> getPurchaseOrdersByStatus(PurchaseOrderStatus status);

    PurchaseOrder createPurchaseOrder(PurchaseOrder purchaseOrder);

    PurchaseOrder updatePurchaseOrder(PurchaseOrder purchaseOrder) throws PurchaseOrderInvalidStateException;

    void deletePurchaseOrderById(Long id);

    void confirmPurchaseOrder(Long id) throws PurchaseOrderNotFoundException, PurchaseOrderInsufficientStockException;

    void cancelPurchaseOrder(Long id) throws PurchaseOrderNotFoundException;
}
