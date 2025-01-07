package com.vendor.service;

import com.vendor.entity.Vendor;
import com.vendor.exception.ResourceNotFoundException;
import com.vendor.repository.VendorRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class VendorService {

    private final VendorRepository vendorRepository;
    private final JavaMailSender javaMailSender;

    @Autowired
    public VendorService(VendorRepository vendorRepository, JavaMailSender javaMailSender) {
        this.vendorRepository = vendorRepository;
        this.javaMailSender = javaMailSender;
    }

    public Vendor createVendor(Vendor vendor) {
        System.out.println("Employee Created: " + vendor);
        return vendorRepository.save(vendor);
    }

   public Vendor getVendorById(Long id) {
        return vendorRepository.getVendorById(id);
   }

    public Vendor getVendorByName(String vendorName) {
        Vendor vendor = vendorRepository.findByNameIgnoreCase(vendorName);
        if(vendor == null) {
            throw new RuntimeException("Vendor not found with name: " + vendorName);
        }
        return vendor;
    }

    public Vendor updateVendor(Long id, Vendor updatedVendor) {

        // Retrieve the existing vendor
        Vendor existingVendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + id));

        // Update only the fields that are not null in the incoming object
        if (updatedVendor.getName() != null) {
            existingVendor.setName(updatedVendor.getName());
        }
        if (updatedVendor.getEmail() != null) {
            existingVendor.setEmail(updatedVendor.getEmail());
        }
        if (updatedVendor.getVendorLicense() != null) {
            existingVendor.setVendorLicense(updatedVendor.getVendorLicense());
        }
        if (updatedVendor.getExpiryDate() != null) {
            existingVendor.setExpiryDate(updatedVendor.getExpiryDate());
        }
        return vendorRepository.save(existingVendor);
    }

    public void deleteVendorById(Long id) {
        vendorRepository.deleteById(id);
    }


    public List<Vendor> getAllVendors() throws ResourceNotFoundException {
        try {
            List<Vendor> allVendors = vendorRepository.findAll();
            return allVendors;
        } catch (Exception e) {
            throw new ResourceNotFoundException("Couldn't fetch all Vendors");
        }

    }


    //@Scheduled(cron = "0 * * * * ?") // Runs every minute for testing;
    public void checkAndSendExpiryNotifications() {
        System.out.println("Check Expiry Notifications");
        List<Vendor> vendors = vendorRepository.findAll();
        LocalDate currentDate = LocalDate.now();

        // Collect vendors with expired license or licenses expiring within 30 days
        StringBuilder expiringVendorsList = new StringBuilder();
        for (Vendor vendor : vendors) {
            if (vendor.getExpiryDate() != null) {
                long daysDifference = ChronoUnit.DAYS.between(currentDate, vendor.getExpiryDate());
                if (daysDifference <= 30) {
                    expiringVendorsList.append(formatVendorDetails(vendor, daysDifference));
                }
            }
        }

        // If there are vendors to notify about, send the email
        if (!expiringVendorsList.isEmpty()) {
            sendLicenseExpiryNotification(expiringVendorsList.toString());
        }
    }

    private void sendLicenseExpiryNotification(String vendorDetails) {
        System.out.println("Sending license expiry notification");

        String notificationRecipient = "jithin.ramachandran@resemblesystems.com";
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(notificationRecipient);
        message.setSubject("License Expiry Notifications for Vendors");
        message.setText("The following vendors have licenses that are expired or will expire within 30 days:\n\n"
                + vendorDetails + "\n\n"
                + "Please take necessary actions to renew these licenses.\n\n"
                + "Thank you,\n"
                + "Vendor Management System");
        javaMailSender.send(message);

        System.out.println("License expiry notification sent to " + notificationRecipient);
    }

    private String formatVendorDetails(Vendor vendor, long daysDifference) {
        String status = daysDifference < 0 ? "Expired" : "Expiring in " + daysDifference + " days";
        return String.format("""
            Vendor Name: %s
            Vendor License: %s
            Email: %s
            License Expiry Date: %s
            Status: %s
            
            """,
                vendor.getName(),
                vendor.getVendorLicense(),
                vendor.getEmail(),
                vendor.getExpiryDate(),
                status);
    }

}
