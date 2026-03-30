package com.example.frere.infrastructure.persistence.mybatis;

import com.example.frere.domain.model.order.Order;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface OrderMapper {

    List<Order> findAll();

    Order findById(Long orderId);

    void insert(Order order);

    void update(Order order);

    void deleteById(Long orderId);
}
