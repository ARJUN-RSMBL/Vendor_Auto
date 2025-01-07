package com.vendor.repository;

import com.vendor.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VendorRepository extends JpaRepository<Vendor, Long> {

    Vendor findByNameIgnoreCase(String name);

   Vendor getVendorById(long id);
}
