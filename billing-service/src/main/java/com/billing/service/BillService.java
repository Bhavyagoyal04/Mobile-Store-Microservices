package com.billing.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.billing.dto.Order;
import com.billing.dto.Mobile;
import com.billing.model.Bill;
import com.billing.repository.BillRepository;
import com.billing.exception.BadRequestException;
import com.billing.exception.ResourceNotFoundException;

import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepo;

    @Autowired
    private WebClient.Builder webClientBuilder;

    // 🔥 CREATE BILL
    public Bill createBill(Long orderId) {

        WebClient client = webClientBuilder.build();

        // =========================
        // ✅ Fetch Order
        // =========================
        Order order = client.get()
                .uri("http://order-service/orders/" + orderId)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> Mono.error(new BadRequestException("Order not found")))
                .bodyToMono(Order.class)
                .block();

        if (order == null) {
            throw new BadRequestException("Order does not exist");
        }

        // =========================
        // ✅ Fetch Mobile
        // =========================
        Mobile mobile = client.get()
                .uri("http://mobile-service/mobiles/" + order.getMobileId())
                .retrieve()
                .onStatus(status -> status.is4xxClientError(),
                        response -> Mono.error(new BadRequestException("Mobile not found")))
                .bodyToMono(Mobile.class)
                .block();

        if (mobile == null) {
            throw new BadRequestException("Mobile does not exist");
        }

        // =========================
        // ✅ Calculate Bill
        // =========================
        double total = mobile.getPrice() * order.getQuantity();

        // =========================
        // ✅ Create Bill
        // =========================
        Bill bill = new Bill();
        bill.setOrderId(orderId); // 🔥 IMPORTANT
        bill.setCustomerName(order.getCustomerName());
        bill.setMobileId(order.getMobileId());
        bill.setQuantity(order.getQuantity());
        bill.setTotalAmount(total);
        bill.setStatus("GENERATED");

        return billRepo.save(bill);
    }

    // ✅ GET BY ID
    public Bill getBillById(Long id) {
        return billRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found"));
    }

    // ✅ GET ALL
    public List<Bill> getAllBills() {
        return billRepo.findAll();
    }
}