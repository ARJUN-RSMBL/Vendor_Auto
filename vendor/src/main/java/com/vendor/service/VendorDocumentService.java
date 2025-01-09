package com.vendor.service;

import com.vendor.dto.VendorDocumentDTO;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
public class VendorDocumentService {
    public VendorDocumentService(VendorDocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }
    private static final Logger logger = LoggerFactory.getLogger(VendorDocumentService.class);

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

    @Transactional(readOnly = true)
    public List<VendorDocument> getAllDocuments() {
        try {
            logger.debug("Fetching all vendor documents");
            List<VendorDocument> documents = documentRepository.findAll();

            // Validate and ensure all necessary relationships are loaded
            List<VendorDocument> validatedDocuments = new ArrayList<>();
            for (VendorDocument doc : documents) {
                try {
                    // Validate vendor information
                    if (doc.getVendor() == null) {
                        logger.warn("Document ID {} has no associated vendor", doc.getDocumentId());
                        continue;
                    }

                    // Validate document type information
                    if (doc.getDocumentType() == null) {
                        logger.warn("Document ID {} has no associated document type", doc.getDocumentId());
                        continue;
                    }

                    // Validate file path
                    if (doc.getFilePath() == null || doc.getFilePath().isEmpty()) {
                        logger.warn("Document ID {} has no file path", doc.getDocumentId());
                        continue;
                    }

                    // Add only valid documents to the result list
                    validatedDocuments.add(doc);
                } catch (Exception e) {
                    logger.error("Error processing document ID {}: {}", doc.getDocumentId(), e.getMessage());
                }
            }

            logger.info("Successfully fetched {} valid documents out of {} total documents",
                    validatedDocuments.size(), documents.size());

            return validatedDocuments;

        } catch (Exception e) {
            logger.error("Error fetching all documents: ", e);
            throw new RuntimeException("Failed to fetch vendor documents", e);
        }
    }

    // Optional: Add a method to return DTOs instead of entities
    @Transactional(readOnly = true)
    public List<VendorDocumentDTO> getAllDocumentsDTO() {
        List<VendorDocument> documents = getAllDocuments();
        return documents.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private VendorDocumentDTO convertToDTO(VendorDocument doc) {
        return VendorDocumentDTO.builder()
                .id(doc.getDocumentId())
                .vendorName(doc.getVendor().getName())
                .documentType(doc.getDocumentType().getTypeName())
                .fileName(doc.getOriginalFilename())
                .uploadDate(doc.getUploadDate())
                .expiryDate(doc.getExpiryDate())
                .status(doc.getStatus())
                .contentType(doc.getContentType())
                .fileSize(doc.getFileSize())
                .build();
    }

}