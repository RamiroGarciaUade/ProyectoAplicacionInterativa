package com.proyecto.uade.dieteticaYuyo.repository;

import com.proyecto.uade.dieteticaYuyo.entity.PurchaseOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyecto.uade.dieteticaYuyo.entity.PurchaseOrder;

import java.util.List;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder,Long>{
    List<PurchaseOrder> findByUserId(Long userId);

    List<PurchaseOrder> findByStatus(PurchaseOrderStatus status);

}
