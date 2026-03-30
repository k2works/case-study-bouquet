package com.example.frere.infrastructure.persistence.mybatis;

import com.example.frere.domain.model.supplier.Supplier;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SupplierMapper {

    List<Supplier> findAll();

    Supplier findById(Long supplierId);

    void insert(Supplier supplier);

    void update(Supplier supplier);

    void deleteById(Long supplierId);
}
