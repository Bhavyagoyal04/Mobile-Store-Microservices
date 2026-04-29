package com.mobile.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.mobile.dto.MobileDTO;
import com.mobile.model.Mobile;
import com.mobile.service.MobileService;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/mobiles")
public class MobileController {

    @Autowired
    private MobileService service;

    // ✅ CREATE
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mobile addMobile(@Valid @RequestBody MobileDTO dto) {
        return service.addMobile(dto);
    }

    // ✅ GET ALL
    @GetMapping
    public List<Mobile> getAllMobiles() {
        return service.getAllMobiles();
    }

    // ✅ GET BY ID
    @GetMapping("/{id}")
    public Mobile getMobile(@PathVariable Long id) {
        return service.getMobileById(id);
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public Mobile updateMobile(@PathVariable Long id,
                               @Valid @RequestBody Mobile mobile) {
        return service.updateMobile(id, mobile);
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMobile(@PathVariable Long id) {
        service.deleteMobile(id);
    }

    // 🔥 CRITICAL FOR ORDER SERVICE
    @PutMapping("/reduce-stock")
    public void reduceStock(@RequestParam Long mobileId,
                            @RequestParam int quantity) {
        service.reduceStock(mobileId, quantity);
    }
}