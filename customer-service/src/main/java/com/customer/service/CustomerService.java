package com.customer.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.customer.model.Customer;
import com.customer.repository.CustomerRepository;
import com.customer.exception.ResourceNotFoundException;
import com.customer.exception.BadRequestException;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository repo;

    // CREATE CUSTOMER
    public Customer addCustomer(Customer customer) {

        // Basic validation
        if (customer.getName() == null || customer.getName().isBlank()) {
            throw new BadRequestException("Customer name is required");
        }

        if (customer.getPhone() == null || customer.getPhone().isBlank()) {
            throw new BadRequestException("Phone number is required");
        }

        // Prevent duplicate phone
        if (repo.existsByPhone(customer.getPhone())) {
            throw new BadRequestException("Customer already exists with this phone");
        }

        return repo.save(customer);
    }

    // GET ALL
    public List<Customer> getAllCustomers() {
        return repo.findAll();
    }

    // GET BY ID
    public Customer getCustomerById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
    }

    // DELETE
    public void deleteCustomer(Long id) {

        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Customer not found");
        }

        repo.deleteById(id);
    }
}