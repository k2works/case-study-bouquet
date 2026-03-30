package com.example.frere.infrastructure.persistence.mybatis;

import com.example.frere.domain.model.product.ProductComposition;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ProductCompositionMapper {

    List<ProductComposition> findAll();

    ProductComposition findById(Long compositionId);

    void insert(ProductComposition productComposition);

    void update(ProductComposition productComposition);

    void deleteById(Long compositionId);
}
