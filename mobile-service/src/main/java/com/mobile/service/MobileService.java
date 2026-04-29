package com.mobile.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mobile.dto.MobileDTO;
import com.mobile.model.Mobile;
import com.mobile.repository.MobileRepository;
import com.mobile.exception.ResourceNotFoundException;
import com.mobile.exception.BadRequestException;

import java.util.List;

@Service
public class MobileService {

    @Autowired
    private MobileRepository repo;

    // ✅ ADD MOBILE
    public Mobile addMobile(MobileDTO dto) {

        // 🔴 Prevent duplicate mobile
        if (repo.existsByBrandAndModel(dto.getBrand(), dto.getModel())) {
            throw new BadRequestException("Mobile already exists");
        }

        // 🔴 Validate stock
        if (dto.getStock() < 0) {
            throw new BadRequestException("Stock cannot be negative");
        }

        Mobile m = new Mobile();
        m.setBrand(dto.getBrand());
        m.setModel(dto.getModel());
        m.setPrice(dto.getPrice());
        m.setStock(dto.getStock());

        return repo.save(m);
    }

    // ✅ GET ALL
    public List<Mobile> getAllMobiles() {
        return repo.findAll();
    }

    // ✅ GET BY ID
    public Mobile getMobileById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mobile not found"));
    }

    // ✅ UPDATE
    public Mobile updateMobile(Long id, Mobile newMobile) {

        Mobile m = getMobileById(id);

        if (newMobile.getStock() < 0) {
            throw new BadRequestException("Stock cannot be negative");
        }

        m.setBrand(newMobile.getBrand());
        m.setModel(newMobile.getModel());
        m.setPrice(newMobile.getPrice());
        m.setStock(newMobile.getStock());

        return repo.save(m);
    }

    // ✅ DELETE
    public void deleteMobile(Long id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Mobile not found");
        }
        repo.deleteById(id);
    }

    // 🔥 CRITICAL METHOD (USED BY ORDER SERVICE)
    public void reduceStock(Long mobileId, int quantity) {

        Mobile mobile = getMobileById(mobileId);

        if (quantity <= 0) {
            throw new BadRequestException("Quantity must be greater than 0");
        }

        if (mobile.getStock() < quantity) {
            throw new BadRequestException("Not enough stock available");
        }

        mobile.setStock(mobile.getStock() - quantity);
        repo.save(mobile);
    }
}