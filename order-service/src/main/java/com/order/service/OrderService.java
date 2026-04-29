package com.order.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.order.dto.OrderDTO;
import com.order.model.Order;
import com.order.repository.OrderRepository;
import com.order.exception.ResourceNotFoundException;
import com.order.exception.BadRequestException;

import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    @Autowired
    private OrderRepository repo;

    @Autowired
    private WebClient.Builder webClientBuilder;

    // =========================
    // CREATE ORDER
    // =========================
    public Order createOrder(OrderDTO dto) {

        WebClient client = webClientBuilder.build();

        // Validate quantity
        if (dto.getQuantity() <= 0) {
            throw new BadRequestException("Quantity must be greater than 0");
        }

        // =========================
        // 1. Validate Customer
        // =========================
        Map<String, Object> customer = client.get()
                .uri("http://customer-service/customers/" + dto.getCustomerId())
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> Mono.error(new BadRequestException("Customer not found")))
                .bodyToMono(Map.class)
                .block();

        if (customer == null) {
            throw new BadRequestException("Customer does not exist");
        }

        String customerName = (String) customer.get("name");

        // =========================
        // 2. Validate Mobile
        // =========================
        Map<String, Object> mobile = client.get()
                .uri("http://mobile-service/mobiles/" + dto.getMobileId())
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> Mono.error(new BadRequestException("Mobile not found")))
                .bodyToMono(Map.class)
                .block();

        if (mobile == null) {
            throw new BadRequestException("Mobile does not exist");
        }

        int stock = (Integer) mobile.get("stock");

        // Prevent out-of-stock order
        if (dto.getQuantity() > stock) {
            throw new BadRequestException("Not enough stock available");
        }

        // =========================
        // 3. Reduce Stock FIRST
        // =========================
        client.put()
                .uri("http://mobile-service/mobiles/reduce-stock?mobileId="
                        + dto.getMobileId() + "&quantity=" + dto.getQuantity())
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> Mono.error(new BadRequestException("Stock update failed")))
                .bodyToMono(Void.class)
                .block();

        // =========================
        // 4. Create Order
        // =========================
        Order order = new Order();
        order.setMobileId(dto.getMobileId());
        order.setQuantity(dto.getQuantity());
        order.setCustomerId(dto.getCustomerId());
        order.setCustomerName(customerName);
        order.setStatus("CREATED");

        return repo.save(order);
    }

    // =========================
    // GET ALL ORDERS
    // =========================
    public List<Order> getAllOrders() {
        return repo.findAll();
    }

    // =========================
    // GET ORDER BY ID
    // =========================
    public Order getOrderById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    // =========================
    // DELETE ORDER
    // =========================
    public void deleteOrder(Long id) {

        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Order not found");
        }

        repo.deleteById(id);
    }
}