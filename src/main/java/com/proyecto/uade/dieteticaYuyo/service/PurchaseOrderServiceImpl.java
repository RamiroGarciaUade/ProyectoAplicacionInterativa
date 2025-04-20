package com.proyecto.uade.dieteticaYuyo.service;

import java.util.List;

import com.proyecto.uade.dieteticaYuyo.entity.Product;
import com.proyecto.uade.dieteticaYuyo.entity.PurchaseItem;
import com.proyecto.uade.dieteticaYuyo.entity.PurchaseOrderStatus;
import com.proyecto.uade.dieteticaYuyo.exceptions.PurchaseOrderInsufficientStockException;
import com.proyecto.uade.dieteticaYuyo.exceptions.PurchaseOrderInvalidStateException;
import com.proyecto.uade.dieteticaYuyo.exceptions.PurchaseOrderNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.proyecto.uade.dieteticaYuyo.entity.PurchaseOrder;
import com.proyecto.uade.dieteticaYuyo.repository.PurchaseOrderRepository;

@Service
public class PurchaseOrderServiceImpl implements PurchaseOrderService {
    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Override
    public Page<PurchaseOrder> getPagedPurchaseOrders(PageRequest pageRequest) {
        return purchaseOrderRepository.findAll(pageRequest);
    }

    @Override
    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll();
    }

    @Override
    public PurchaseOrder getPurchaseOrderById(Long id) throws PurchaseOrderNotFoundException {
        return purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new PurchaseOrderNotFoundException(id));
    }

    @Override
    public List<PurchaseOrder> getPurchaseOrdersByUserId(Long userId) {
        return purchaseOrderRepository.findByUserId(userId);
    }

    @Override
    public List<PurchaseOrder> getPurchaseOrdersByStatus(PurchaseOrderStatus status) {
        return purchaseOrderRepository.findByStatus(status);
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public PurchaseOrder createPurchaseOrder(PurchaseOrder purchaseOrder) {
        return purchaseOrderRepository.save(purchaseOrder);
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public PurchaseOrder updatePurchaseOrder(PurchaseOrder updatedPurchaseOrder) throws PurchaseOrderInvalidStateException {
        PurchaseOrder existingPurchaseOrder = getPurchaseOrderById(updatedPurchaseOrder.getId());
        if (existingPurchaseOrder.getStatus() != PurchaseOrderStatus.PENDING) {
            throw new PurchaseOrderInvalidStateException(updatedPurchaseOrder.getId());
        }

        existingPurchaseOrder.setUser(updatedPurchaseOrder.getUser());
        existingPurchaseOrder.setItems(updatedPurchaseOrder.getItems());

        return purchaseOrderRepository.save(existingPurchaseOrder);
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public void deletePurchaseOrderById(Long id) {
        PurchaseOrder purchaseOrder = getPurchaseOrderById(id);
        purchaseOrderRepository.delete(purchaseOrder);
        // TODO: We could add the same status validation here
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public void confirmPurchaseOrder(Long id) throws PurchaseOrderInvalidStateException, PurchaseOrderInsufficientStockException {
        PurchaseOrder order = getPurchaseOrderById(id);
        if (order.getStatus() != PurchaseOrderStatus.PENDING) {
            throw new PurchaseOrderInvalidStateException(id);
        }

        for (PurchaseItem item : order.getItems()) {
            Product product = item.getProduct();
            int quantity = item.getQuantity();

            if (product.getStock() < quantity) {
                throw new PurchaseOrderInsufficientStockException(product.getName(), product.getStock(), quantity);
            }

            // TODO: @Transactional should make this work without having to save the product change, check on it later!
            product.setStock(product.getStock() - quantity);
        }

        order.setStatus(PurchaseOrderStatus.CONFIRMED);
        purchaseOrderRepository.save(order);
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public void cancelPurchaseOrder(Long id) {
        PurchaseOrder order = getPurchaseOrderById(id);

        if (order.getStatus() != PurchaseOrderStatus.PENDING) {
            throw new PurchaseOrderInvalidStateException(id);
        }

        order.setStatus(PurchaseOrderStatus.CANCELLED);
        purchaseOrderRepository.save(order);
    }

}
