import apiClient from './apiClient';

const vendorService = {
    // Get all vendors
    getAllVendors: () => {
        return apiClient.get('/vendor');
    },

    // Get vendor by ID
    getVendorById: (id) => {
        return apiClient.get(`/vendor/${id}`);
    },

    // Create new vendor
    createVendor: (vendorData) => {
        return apiClient.post('/vendor', vendorData);
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