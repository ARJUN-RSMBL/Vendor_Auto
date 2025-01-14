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
      const username = getLoggedInUser();
      if (!formData.has('username')) {
        formData.append('username', username);
      }

      // Create a new FormData object with corrected parameter names
      const updatedFormData = new FormData();
      updatedFormData.append('username', username);
      
      // Add documents data
      const documentsData = JSON.parse(formData.get('documents'));
      updatedFormData.append('documents', formData.get('documents'));

      // Add file with correct parameter name
      const files = formData.getAll('files');
      const fileIndices = formData.getAll('fileIndices');
      
      if (files.length > 0) {
        updatedFormData.append('file', files[0]); // Server expects 'file' not 'files'
        updatedFormData.append('documentIndex', fileIndices[0]);
      }

      const response = await apiClient.post('/vendor/documents/update-with-file', updatedFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });

      // Enhanced error handling based on status codes
      if (response.status !== 200) {
        const errorMessage = response.data?.message || 'Unknown server error';
        console.error('Server response:', {
          status: response.status,
          data: response.data,
          headers: response.headers
        });
        throw new Error(`Server error (${response.status}): ${errorMessage}`);
      }

      return response;
    } catch (error) {
      console.error('Document update error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      // Throw a user-friendly error with technical details
      throw new Error(
        `Failed to update documents: ${error.response?.data?.message || error.message}. ` +
        'Please check the console for technical details.'
      );
    }
  }
};

export default vendorService;