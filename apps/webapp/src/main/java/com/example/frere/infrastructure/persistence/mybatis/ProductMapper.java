package com.example.frere.infrastructure.persistence.mybatis;

import com.example.frere.domain.model.product.Product;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ProductMapper {

    List<Product> findAll();

    Product findById(Long productId);

    void insert(Product product);

    void update(Product product);

    void deleteById(Long productId);
}
