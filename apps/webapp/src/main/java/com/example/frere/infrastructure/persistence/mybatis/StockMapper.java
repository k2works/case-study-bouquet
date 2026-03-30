package com.example.frere.infrastructure.persistence.mybatis;

import com.example.frere.domain.model.stock.Stock;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface StockMapper {

    List<Stock> findAll();

    Stock findById(Long stockId);

    void insert(Stock stock);

    void update(Stock stock);

    void deleteById(Long stockId);
}
