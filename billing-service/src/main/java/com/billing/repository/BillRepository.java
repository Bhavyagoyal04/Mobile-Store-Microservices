package com.billing.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.billing.model.Bill;

import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {

    // ✅ Find bill by order
    List<Bill> findByOrderId(Long orderId);

    // ✅ Find bills by customer name
    List<Bill> findByCustomerName(String customerName);

    // ✅ Filter by status (GENERATED, PAID, etc.)
    List<Bill> findByStatus(String status);

    // ✅ Combined filter (advanced)
    List<Bill> findByCustomerNameAndStatus(String customerName, String status);
}