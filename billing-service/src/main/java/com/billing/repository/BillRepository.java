package com.billing.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.billing.model.Bill;

public interface BillRepository extends JpaRepository<Bill, Long> {
}