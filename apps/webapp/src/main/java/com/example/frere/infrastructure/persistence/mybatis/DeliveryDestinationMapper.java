package com.example.frere.infrastructure.persistence.mybatis;

import com.example.frere.domain.model.destination.DeliveryDestination;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DeliveryDestinationMapper {

    List<DeliveryDestination> findAll();

    DeliveryDestination findById(Long destinationId);

    void insert(DeliveryDestination deliveryDestination);

    void update(DeliveryDestination deliveryDestination);

    void deleteById(Long destinationId);
}
