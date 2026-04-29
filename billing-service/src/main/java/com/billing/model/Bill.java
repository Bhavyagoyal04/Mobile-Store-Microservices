package com.billing.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bills")
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long billId;

    @Column(nullable = false)
    private Long orderId; // 🔥 IMPORTANT

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private Long mobileId;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private double totalAmount; // ⚠️ can keep double for now, but BigDecimal is better

    @Column(nullable = false)
    private String status;

    private LocalDateTime createdAt;

    // 🔥 Auto set before save
    @PrePersist
    public void onCreate() {
        if (status == null) {
            status = "GENERATED";
        }
        createdAt = LocalDateTime.now();
    }

    // =========================
    // Getters & Setters
    // =========================

    public Long getBillId() { return billId; }
    public void setBillId(Long billId) { this.billId = billId; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public Long getMobileId() { return mobileId; }
    public void setMobileId(Long mobileId) { this.mobileId = mobileId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}