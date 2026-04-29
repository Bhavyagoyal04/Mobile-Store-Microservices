package com.order.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.order.model.Order;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // ✅ Filter by status
    List<Order> findByStatus(String status);

    // ✅ Get all orders of a customer
    List<Order> findByCustomerId(Long customerId);

    // ✅ Get all orders for a mobile
    List<Order> findByMobileId(Long mobileId);

    // ✅ Combined filter (advanced)
    List<Order> findByCustomerIdAndStatus(Long customerId, String status);
}