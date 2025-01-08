import axios from "axios";
import { getToken } from "./authService";
import apiClient from './apiClient';

const DOCUMENT_TYPE_API_URL = `${apiClient}/api/document-types`;

axios.interceptors.request.use(function (config) {
    
    config.headers['Authorization'] = getToken();

    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  // Create new document type
export const createDocumentType = (documentType) => 
    axios.post(DOCUMENT_TYPE_API_URL, documentType);

// Update document type
export const updateDocumentType = (typeId, documentType) => 
    axios.put(`${DOCUMENT_TYPE_API_URL}/${typeId}`, documentType);

// Delete document type
export const deleteDocumentType = (typeId) => 
    axios.delete(`${DOCUMENT_TYPE_API_URL}/${typeId}`);

// Get single document type
export const getDocumentType = (typeId) => 
    axios.get(`${DOCUMENT_TYPE_API_URL}/${typeId}`);

// Get all document types
export const getAllDocumentTypes = () => 
    axios.get(DOCUMENT_TYPE_API_URL);

// Get document type by name
export const getDocumentTypeByName = (typeName) => 
    axios.get(`${DOCUMENT_TYPE_API_URL}/name/${typeName}`);

// Toggle mandatory status
export const toggleMandatory = (typeId) => 
    axios.patch(`${DOCUMENT_TYPE_API_URL}/${typeId}/toggle-mandatory`);

  // Upload document with multipart form data
  export const uploadDocument = (file, vendorId, documentTypeId, expiryDate) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('vendorId', vendorId);
    formData.append('documentTypeId', documentTypeId);
    formData.append('expiryDate', expiryDate);
    
    return axios.post(`${DOCUMENT_TYPE_API_URL}/upload`, formData);
}

// Get all documents for a vendor
export const getVendorDocuments = (vendorId) => 
    axios.get(`${DOCUMENT_TYPE_API_URL}/vendor/${vendorId}`);


// Get single document (returns file content)
export const getDocument = (documentId) => 
    axios.get(`${DOCUMENT_TYPE_API_URL}/${documentId}`, {
        responseType: 'blob'
    });
  

