package com.vendor.controller;

import com.vendor.dto.VendorDocumentDTO;
import com.vendor.entity.VendorDocument;
import com.vendor.exception.APIException;
import com.vendor.exception.ResourceNotFoundException;
import com.vendor.service.VendorDocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/vendor/documents")
public class VendorDocumentController {

    private static final Logger logger = LoggerFactory.getLogger(VendorDocumentController.class);

    @Autowired
    private VendorDocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<VendorDocument> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("vendorId") Long vendorId,
            @RequestParam("documentTypeId") Long documentTypeId,
            @RequestParam("expiryDate") LocalDate expiryDate) {

        VendorDocument document = documentService.uploadDocument(file, vendorId,
                documentTypeId, expiryDate);
        return ResponseEntity.ok(document);
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<VendorDocument>> getVendorDocuments(@PathVariable Long vendorId) {
        List<VendorDocument> documents = documentService.getVendorDocuments(vendorId);
        return ResponseEntity.ok(documents);
    }

//    @GetMapping("/{documentId}")
//    public ResponseEntity<byte[]> getDocument(@PathVariable Long documentId) {
//        VendorDocument document = documentService.getVendorDocuments(documentId).get(0);
//        byte[] fileContent = documentService.getDocument(documentId);
//
//        return ResponseEntity.ok()
//                .header(HttpHeaders.CONTENT_DISPOSITION,
//                        "attachment; filename=\"" + document.getOriginalFilename() + "\"")
//                .contentType(MediaType.parseMediaType(document.getContentType()))
//                .body(fileContent);
//    }
@GetMapping("/{documentId}")
public ResponseEntity<byte[]> getDocument(@PathVariable Long documentId) {
    try {
        VendorDocument document = documentService.getDocument(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));

        byte[] fileContent = documentService.getDocumentContent(documentId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + document.getOriginalFilename() + "\"")
                .contentType(MediaType.parseMediaType(document.getContentType()))
                .body(fileContent);
    } catch (ResourceNotFoundException e) {
        logger.error("Document not found: {}", documentId, e);
        return ResponseEntity.notFound().build();
    } catch (Exception e) {
        logger.error("Error downloading document: {}", documentId, e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}

    @GetMapping
    public ResponseEntity<?> getAllDocuments() {
        try {
            List<VendorDocumentDTO> documents = documentService.getAllDocumentsDTO();
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            logger.error("Error fetching documents: ", e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResourceNotFoundException(e.getMessage()));
        }
    }

}