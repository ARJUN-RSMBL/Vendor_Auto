package com.vendor.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class DocumentStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String storeFile(MultipartFile file, Long vendorId, String documentType) throws IOException {
        // Create directories if they don't exist
        String vendorDir = uploadDir + "/vendor_" + vendorId;
        Files.createDirectories(Paths.get(vendorDir));

        // Generate unique filename
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String storedFilename = documentType + "_" + timestamp + extension;

        // Store file
        Path targetLocation = Paths.get(vendorDir).resolve(storedFilename);
        Files.copy(file.getInputStream(), targetLocation);

        return targetLocation.toString();
    }

    public byte[] retrieveFile(String filePath) throws IOException {
        Path path = Paths.get(filePath);
        return Files.readAllBytes(path);
    }
}