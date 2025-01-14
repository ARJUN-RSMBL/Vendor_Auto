import axios from "axios";
import { getLoggedInUser, getToken, isAdminUser } from "./authService";
import apiClient from './apiClient';

const BASE_REST_API_URL = `${apiClient}/vendor/documents`;

axios.interceptors.request.use(function (config) {
    
    config.headers['Authorization'] = getToken();

    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  // Upload document with multipart form data
export const uploadDocument = async (file, vendorId, documentTypeId, expiryDate) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('vendorId', vendorId);
        formData.append('documentTypeId', documentTypeId);
        formData.append('expiryDate', expiryDate);
        
        const response = await apiClient.post('/vendor/documents/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response;
    } catch (error) {
        console.error('Error uploading document:', error);
        throw error;
    }
};

// Get all documents for a vendor
// export const getVendorDocuments = async () => {
//     try {
//         const response = await apiClient.get('/vendor/documents');
//         return response;
//     } catch (error) {
//         console.error('Error fetching vendor documents:', error);
//         throw error;
//     }
// };
// ... existing imports ...

export const getVendorDocuments = async () => {
    try {
        const username = getLoggedInUser(); // Get the logged-in user's username
        const endpoint = isAdminUser() 
            ? '/vendor/documents'  // Admin endpoint to get all documents
            : `/vendor/documents/user/${username}`; // Vendor-specific endpoint

        const response = await apiClient.get(endpoint);
        return response;
    } catch (error) {
        console.error('Error fetching vendor documents:', error);
        throw error;
    }
};

// Get single document (returns file content)
export const getDocument = async (documentId) => {
    try {
        const response = await apiClient.get(`/vendor/documents/${documentId}`, {
            responseType: 'blob'  // Important for handling file downloads
        });
        return response;
    } catch (error) {
        console.error('Error downloading document:', error);
        throw error;
    }
};
  
export default {
    getVendorDocuments,
    getDocument,
    uploadDocument
};
// export const getAllCounter = () => axios.get(BASE_REST_API_URL)

// export const addCounter = (counter) => axios.post(BASE_REST_API_URL, counter)

// export const getCounter = (id) => axios.get(BASE_REST_API_URL + '/' + id)

// export const updateCounter = (id, counter) => axios.put(BASE_REST_API_URL + '/' + id, counter)

// export const deleteCounter = (id) => axios.delete(BASE_REST_API_URL + '/' + id)

// export const setIsActive = (id) => axios.patch(BASE_REST_API_URL + '/' + id + '/toggle')
