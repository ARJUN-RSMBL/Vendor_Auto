package com.vendor.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Vendor {

    public Vendor(Long id, String name, String vendorLicense, String email, LocalDate expiryDate, String status) {
        this.id = id;
        this.name = name;
        this.vendorLicense = vendorLicense;
        this.email = email;
        this.expiryDate = expiryDate;
        this.status = status;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("vendorLicense")
    private String vendorLicense;

    @JsonProperty("email")
    private String email;

    @JsonProperty("expiryDate")
    private LocalDate expiryDate;

    //not needed since the status is dynamically calculated
    @Transient //this field won't be stored in the db
    private String status;

    public Vendor(Long vendorId) {
        this.id = vendorId;
    }

    public Vendor() {

    }

    public String getStatus() {
        //calculate status based on expiryDate
        if(expiryDate != null && expiryDate.isBefore(LocalDate.now())) {
            return "Expired";
        }
        return "Active";
    }

    @OneToOne(mappedBy = "vendor")
    private User user;

    // Add getter and setter for user
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getVendorLicense() {
        return vendorLicense;
    }

    public void setVendorLicense(String vendorLicense) {
        this.vendorLicense = vendorLicense;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
