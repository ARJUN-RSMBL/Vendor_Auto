import axios from "axios";
import { getToken } from "./authService";
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
export const uploadDocument = (file, vendorId, documentTypeId, expiryDate) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('vendorId', vendorId);
    formData.append('documentTypeId', documentTypeId);
    formData.append('expiryDate', expiryDate);
    
    return axios.post(`${BASE_REST_API_URL}/upload`, formData);
}

// Get all documents for a vendor
export const getVendorDocuments = (vendorId) => 
    axios.get(`${BASE_REST_API_URL}/vendor/${vendorId}`);


// Get single document (returns file content)
export const getDocument = (documentId) => 
    axios.get(`${BASE_REST_API_URL}/${documentId}`, {
        responseType: 'blob'  // Important for handling file downloads
    })
  
// export const getAllCounter = () => axios.get(BASE_REST_API_URL)

// export const addCounter = (counter) => axios.post(BASE_REST_API_URL, counter)

// export const getCounter = (id) => axios.get(BASE_REST_API_URL + '/' + id)

// export const updateCounter = (id, counter) => axios.put(BASE_REST_API_URL + '/' + id, counter)

// export const deleteCounter = (id) => axios.delete(BASE_REST_API_URL + '/' + id)

// export const setIsActive = (id) => axios.patch(BASE_REST_API_URL + '/' + id + '/toggle')
