package com.example.frere.infrastructure.persistence.mybatis;

import com.example.frere.domain.model.customer.Customer;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CustomerMapper {

    List<Customer> findAll();

    Customer findById(Long customerId);

    void insert(Customer customer);

    void update(Customer customer);

    void deleteById(Long customerId);

    Customer findByEmail(String email);

    boolean existsByEmail(String email);
}
