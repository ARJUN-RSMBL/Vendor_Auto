import apiClient from './apiClient';

const authService = {
    login: (credentials) => {
        return apiClient.post('/api/auth/login', credentials);
    },

    register: (userData) => {
        return apiClient.post('/api/auth/register', userData);
    }
};

export default authService;