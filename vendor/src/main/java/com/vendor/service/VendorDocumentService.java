package com.vendor.service;

import com.vendor.entity.DocumentType;
import com.vendor.entity.Vendor;
import com.vendor.entity.VendorDocument;
import com.vendor.repository.VendorDocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class VendorDocumentService {
    public VendorDocumentService(VendorDocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    @Autowired
    private VendorDocumentRepository documentRepository;

    @Autowired
    private DocumentStorageService storageService;

    @Autowired
    private DocumentTypeService documentTypeService;

    @Autowired
    private VendorService vendorService; // You'll need to inject VendorService

    public VendorDocument uploadDocument(MultipartFile file, Long vendorId,
                                         Long documentTypeId, LocalDate expiryDate) {
        try {
            // Get vendor details
            Vendor vendor = vendorService.getVendorById(vendorId);
            if (vendor == null) {
                throw new RuntimeException("Vendor not found");
            }

            // Get document type details
            DocumentType docType = documentTypeService.getDocumentType(documentTypeId);
            if (docType == null) {
                throw new RuntimeException("Document type not found");
            }

            // Store file with vendor name and document type
            String filePath = storageService.storeFile(
                    file,
                    vendorId,
                    vendor.getName(),
                    docType.getTypeName()  // assuming document type has a getName() method
            );

            VendorDocument document = new VendorDocument();
            document.setVendor(vendor);
            document.setDocumentType(docType);
            document.setOriginalFilename(file.getOriginalFilename());
            document.setStoredFilename(filePath.substring(filePath.lastIndexOf("/") + 1));
            document.setFilePath(filePath);
            document.setUploadDate(LocalDateTime.now());
            document.setExpiryDate(expiryDate);
            document.setFileSize(file.getSize());
            document.setContentType(file.getContentType());
            document.setStatus("Active");

            return documentRepository.save(document);
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    public List<VendorDocument> getVendorDocuments(Long vendorId) {
        return documentRepository.findByVendorId(vendorId);
    }

    public byte[] getDocument(Long documentId) {
        VendorDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        try {
            return storageService.retrieveFile(document.getFilePath());
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving file");
        }
    }
}