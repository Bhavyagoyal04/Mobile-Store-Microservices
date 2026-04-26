package com.mobile.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mobile.dto.MobileDTO;
import com.mobile.model.Mobile;
import com.mobile.repository.MobileRepository;
import com.mobile.exception.ResourceNotFoundException;

import java.util.List;

@Service
public class MobileService {

    @Autowired
    private MobileRepository repo;

    public Mobile addMobile(MobileDTO dto) {
        Mobile m = new Mobile();
        m.setBrand(dto.getBrand());
        m.setModel(dto.getModel());
        m.setPrice(dto.getPrice());
        m.setStock(dto.getStock());
        return repo.save(m);
    }

    public List<Mobile> getAllMobiles() {
        return repo.findAll();
    }

    public Mobile getMobileById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mobile not found"));
    }

    public Mobile updateMobile(Long id, Mobile newMobile) {
        Mobile m = getMobileById(id);
        m.setBrand(newMobile.getBrand());
        m.setModel(newMobile.getModel());
        m.setPrice(newMobile.getPrice());
        m.setStock(newMobile.getStock());
        return repo.save(m);
    }

    public void deleteMobile(Long id) {
        repo.deleteById(id);
    }
}