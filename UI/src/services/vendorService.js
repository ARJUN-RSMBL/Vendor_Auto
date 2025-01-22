import apiClient from './apiClient';
import { getLoggedInUser } from './authService';

const vendorService = {

  // Get all vendors
  getAllVendors: async () => {
    try {
      const response = await apiClient.get('/vendor');
      console.log('Raw vendor response:', response);

      // Check if response.data exists
      if (!response.data) {
        console.error('No data received from vendor API');
        return [];
      }

      // Parse the string response if needed
      let vendors = response.data;
      if (typeof response.data === 'string') {
        try {
          // Remove the {"message":null} from the end of the string
          const cleanedData = response.data.split('{"message":null}')[0];
          vendors = JSON.parse(cleanedData);
        } catch (parseError) {
          console.error('Error parsing vendor data:', parseError);
          return [];
        }
      }

      // Ensure vendors is an array
      if (!Array.isArray(vendors)) {
        console.error('Vendors data is not an array:', vendors);
        return [];
      }

      console.log('Processed vendors before mapping:', vendors);

      // Map and filter out invalid vendors
      const mappedVendors = vendors
        .filter(vendor => {
          // Modified validation to check for user.name instead of name
          const isValid = vendor && vendor.id && vendor.user && vendor.user.name;
          if (!isValid) {
            console.log('Filtered out invalid vendor:', vendor);
          }
          return isValid;
        })
        .map(vendor => ({
          id: vendor.id,
          status: vendor.status || 'Unknown',
          name: vendor.user?.name || '', // Get name from user object
          vendorLicense: vendor.vendorLicense || '',
          email: vendor.user?.email || '', // Get email from user object if it exists
          expiryDate: vendor.expiryDate ? new Date(vendor.expiryDate).toISOString() : null,
        }));

      console.log('Final mapped vendors:', mappedVendors);
      return mappedVendors;

    } catch (error) {
      console.error('Error fetching vendors:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
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
  deleteVendor: async (id) => {
    try {
      const response = await apiClient.delete(`/vendor/${id}`);
      return response;
    } catch (error) {
      if (error.response?.status === 500) {
        throw new Error('Cannot delete vendor: It may be associated with a user account');
      }
      throw error;
    }
  },

  // Get expiry notifications
  getExpiryNotifications: () => {
    return apiClient.get('/vendor/test-scheduler');
  },
  // Add this method inside the vendorService object
  
  getVendorDetails: async (username) => {
    try {
      console.log('Making request to:', apiClient.defaults.baseURL + `/vendor/details/${username}`);
      const response = await apiClient.get(`/vendor/details/${username}`);
      console.log('Response received:', response);
      return response.data;
    } catch (error) {
      console.error('Error in getVendorDetails:', {
        url: apiClient.defaults.baseURL + `/vendor/details/${username}`,
        status: error.response?.status,
        errorData: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // updateVendorDocuments: async (formData) => {
  //   try {
  //     const username = getLoggedInUser();
  //     if (!formData.has('username')) {
  //       formData.append('username', username);
  //     }

  //     // Debug: Log all form data entries
  //     console.log('Form data contents:');
  //     for (let [key, value] of formData.entries()) {
  //       console.log(`${key}: ${value instanceof File ? `File: ${value.name}` : value}`);
  //     }

  //     // Parse and validate documents data
  //     const documentsData = JSON.parse(formData.get('documents'));
  //     console.log('Documents data:', documentsData);

  //     // Validate document structure
  //     if (!Array.isArray(documentsData)) {
  //       throw new Error('Invalid documents data format');
  //     }

  //     // Enhanced validation with detailed error messages
  //     documentsData.forEach((doc, index) => {
  //       const errors = [];
  //       if (!doc.documentTypeId) errors.push('documentTypeId is required');
  //       if (!doc.expiryDate) errors.push('expiryDate is required');

  //       if (errors.length > 0) {
  //         throw new Error(`Document ${index + 1} validation failed: ${errors.join(', ')}`);
  //       }
  //     });

  //     // Verify file attachments
  //     const files = formData.getAll('files');
  //     const fileIndices = formData.getAll('fileIndices');
  //     console.log('Files to upload:', files.map(f => f.name));
  //     console.log('File indices:', fileIndices);

  //     // Make the API call with enhanced error handling
  //     const response = await apiClient.post('/vendor/documents/update-with-file', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //       timeout: 30000,
  //       validateStatus: null, // Allow all status codes for better error handling
  //     });

  //     // Enhanced error handling based on status codes
  //     if (response.status !== 200) {
  //       const errorMessage = response.data?.message || 'Unknown server error';
  //       console.error('Server response:', {
  //         status: response.status,
  //         data: response.data,
  //         headers: response.headers
  //       });
  //       throw new Error(`Server error (${response.status}): ${errorMessage}`);
  //     }

  //     return response;
  //   } catch (error) {
  //     console.error('Document update error details:', {
  //       message: error.message,
  //       response: error.response?.data,
  //       status: error.response?.status
  //     });

  //     // Throw a user-friendly error with technical details
  //     throw new Error(
  //       `Failed to update documents: ${error.response?.data?.message || error.message}. ` +
  //       'Please check the console for technical details.'
  //     );
  //   }
  // }
  updateVendorDocuments: async (formData) => {
    try {
      console.log('Form data contents:');
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[0] === 'file' ? 'File: ' + pair[1].name : pair[1]}`);
      }
  
      const response = await apiClient.post('/vendor/documents/update-with-file', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
  
      return response;
    } catch (error) {
      console.error('Document update error details:', {
        message: error.response?.data?.error || 'Unknown server error',
        response: error.response?.data,
        status: error.response?.status
      });
      throw new Error(`Failed to update documents: ${error.response?.data?.error || 'Unknown error'}`);
    }
  }
};

export default vendorService;