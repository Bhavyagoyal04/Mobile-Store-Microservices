package com.mobile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mobile.model.Mobile;

public interface MobileRepository extends JpaRepository<Mobile, Long> {
}