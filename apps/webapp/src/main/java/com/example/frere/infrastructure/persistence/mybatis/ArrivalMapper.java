package com.example.frere.infrastructure.persistence.mybatis;

import com.example.frere.domain.model.arrival.Arrival;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ArrivalMapper {

    List<Arrival> findAll();

    Arrival findById(Long arrivalId);

    void insert(Arrival arrival);

    void deleteById(Long arrivalId);
}
