package com.mobile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mobile.model.Mobile;

import java.util.Optional;

public interface MobileRepository extends JpaRepository<Mobile, Long> {

    // Find by brand + model
    Optional<Mobile> findByBrandAndModel(String brand, String model);

    // Prevent duplicate mobiles
    boolean existsByBrandAndModel(String brand, String model);
}