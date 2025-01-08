import apiClient from './apiClient';

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

    // Create new vendor
    createVendor: async (vendorData) => {
        try {
            const response = await apiClient.post('/vendor', vendorData);
            return response.data;
        } catch (error) {
            console.error('Error creating vendor:', error);
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
    }
};

export default vendorService;