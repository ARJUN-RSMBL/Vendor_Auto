package com.vendor.controller;

import com.vendor.entity.Vendor;
import com.vendor.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/vendor")
public class VendorController {

    public VendorController(VendorService vendorService) {
        this.vendorService = vendorService;
    }

    @Autowired
    private VendorService vendorService;

    @PostMapping
    public ResponseEntity<?> createVendor(@RequestBody Vendor vendor) {
        try {
            Vendor savedVendor = vendorService.createVendor(vendor);
            return new ResponseEntity<>(savedVendor, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vendor> getVendorById(@PathVariable Long id) {
        Vendor getVendor = vendorService.getVendorById(id);
        return new ResponseEntity<>(getVendor, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vendor> updatedVendor(@PathVariable Long id, @RequestBody Vendor vendor) {
        Vendor updatedVendor = vendorService.updateVendor(id, vendor);
        return new ResponseEntity<>(updatedVendor, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteVendor(@PathVariable Long id) {
        vendorService.deleteVendorById(id);
        return ResponseEntity.ok("Vendor Deleted Successfully");
    }

    @GetMapping
    public ResponseEntity<List<Vendor>> getAllVendors() {
        List<Vendor> vendors = vendorService.getAllVendors();
        return new ResponseEntity<>(vendors, HttpStatus.OK);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<Vendor> getVendorByName( @PathVariable String name) {
        Vendor vendor = vendorService.getVendorByName(name);
        return new ResponseEntity<>(vendor, HttpStatus.OK);
    }

    @GetMapping("/test-scheduler")
    public void testScheduler() {
        vendorService.checkAndSendExpiryNotifications();
    }

}
