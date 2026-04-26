package com.billing.dto;

public class Order {
    private Long id;

	private Long mobileId;
    private int quantity;
    private String customerName;
    private String status;

    // getters & setters
    public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getMobileId() {
		return mobileId;
	}
	public void setMobileId(Long mobileId) {
		this.mobileId = mobileId;
	}
	public int getQuantity() {
		return quantity;
	}
	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
	public String getCustomerName() {
		return customerName;
	}
	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
}