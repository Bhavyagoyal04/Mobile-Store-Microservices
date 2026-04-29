package com.customer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.customer.model.Customer;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    // Find customer by phone
    Optional<Customer> findByPhone(String phone);

    // Check duplicate phone
    boolean existsByPhone(String phone);
}