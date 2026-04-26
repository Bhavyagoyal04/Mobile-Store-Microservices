package com.mobile.controller;

import org.springframework.beans.factory.annotation.Autowired;
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

    @PostMapping
    public Mobile addMobile(@Valid @RequestBody MobileDTO dto) {
        return service.addMobile(dto);
    }

    @GetMapping
    public List<Mobile> getAllMobiles() {
        return service.getAllMobiles();
    }

    @GetMapping("/{id}")
    public Mobile getMobile(@PathVariable Long id) {
        return service.getMobileById(id);
    }

    @PutMapping("/{id}")
    public Mobile updateMobile(@PathVariable Long id,
                               @RequestBody Mobile mobile) {
        return service.updateMobile(id, mobile);
    }

    @DeleteMapping("/{id}")
    public String deleteMobile(@PathVariable Long id) {
        service.deleteMobile(id);
        return "Mobile deleted successfully";
    }
}