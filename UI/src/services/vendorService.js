import apiClient from './apiClient';
import { getLoggedInUser } from './authService';

const vendorService = {

  // Get all vendors
  getAllVendors: async () => {
    try {
      const response = await apiClient.get('/vendor');
      return response.data;
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw error;
    }
  },

  // Get vendor by ID
  getVendorById: async (id) => {
    try {
      const response = await apiClient.get(`/vendor/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vendor:', error);
      throw error;
    }
  },

  // // Create new vendor
  // createVendor: async (vendorData) => {
  //     try {
  //         const response = await apiClient.post('/vendor', vendorData);
  //         return response.data;
  //     } catch (error) {
  //         console.error('Error creating vendor:', error);
  //         throw error;
  //     }
  // },
  createVendor: async (formData) => {
    console.log('Sending request to create vendor');
    try {
      // First create the vendor
      const vendorResponse = await apiClient.post('/vendor', {
        name: formData.get('name'),
        email: formData.get('email')
      });

      const vendorId = vendorResponse.data.id;
      console.log('Vendor created with ID:', vendorId);

      // Then upload each document
      const documentsData = JSON.parse(formData.get('documents'));
      const files = formData.getAll('files');
      const fileIndices = formData.getAll('fileIndices');

      // Upload each document
      const documentPromises = files.map(async (file, index) => {
        const documentData = documentsData[fileIndices[index]];
        const documentFormData = new FormData();

        documentFormData.append('file', file);
        documentFormData.append('vendorId', vendorId);
        documentFormData.append('documentTypeId', documentData.documentTypeId);
        documentFormData.append('expiryDate', documentData.expiryDate);

        console.log('Uploading document:', {
          vendorId,
          documentTypeId: documentData.documentTypeId,
          expiryDate: documentData.expiryDate,
          fileName: file.name
        });

        return apiClient.post('/vendor/documents/upload', documentFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
      });

      // Wait for all documents to be uploaded
      const documentResponses = await Promise.all(documentPromises);
      console.log('All documents uploaded:', documentResponses);

      // Return the vendor response
      return vendorResponse;

    } catch (error) {
      console.error('Vendor creation error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  },

  // Update vendor
  updateVendor: (id, vendorData) => {
    return apiClient.put(`/vendor/${id}`, vendorData);
  },

  // Delete vendor
  deleteVendor: (id) => {
    return apiClient.delete(`/vendor/${id}`);
  },

  // Get expiry notifications
  getExpiryNotifications: () => {
    return apiClient.get('/vendor/test-scheduler');
  },
  // Add this method inside the vendorService object
  getVendorDetails: async (username) => {
    try {
      const response = await apiClient.get(`/vendor/details/${username}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vendor details:', error);
      throw error;
    }
  },
  updateVendorDocuments: async (formData) => {
    try {
      // Add username to formData
      const username = getLoggedInUser(); // from authService
      formData.append('username', username);

      const response = await apiClient.post('/vendor/documents/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('Error updating vendor documents:', error);
      throw error;
    }
  },
};

export default vendorService;