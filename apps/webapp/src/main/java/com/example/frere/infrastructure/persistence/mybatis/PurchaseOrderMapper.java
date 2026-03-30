package com.example.frere.infrastructure.persistence.mybatis;

import com.example.frere.domain.model.purchaseorder.PurchaseOrder;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PurchaseOrderMapper {

    List<PurchaseOrder> findAll();

    PurchaseOrder findById(Long purchaseOrderId);

    void insert(PurchaseOrder purchaseOrder);

    void update(PurchaseOrder purchaseOrder);

    void deleteById(Long purchaseOrderId);
}
