package com.example.frere.infrastructure.persistence.mybatis;

import com.example.frere.domain.model.item.Item;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ItemMapper {

    List<Item> findAll();

    Item findById(Long itemId);

    void insert(Item item);

    void update(Item item);

    void deleteById(Long itemId);
}
