package com.vendor.controller;

import com.vendor.entity.VendorDocument;
import com.vendor.service.VendorDocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/vendor/documents")
public class VendorDocumentController {

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

    @GetMapping("/{documentId}")
    public ResponseEntity<byte[]> getDocument(@PathVariable Long documentId) {
        VendorDocument document = documentService.getVendorDocuments(documentId).get(0);
        byte[] fileContent = documentService.getDocument(documentId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + document.getOriginalFilename() + "\"")
                .contentType(MediaType.parseMediaType(document.getContentType()))
                .body(fileContent);
    }
}