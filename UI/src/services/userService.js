import apiClient from './apiClient';

const userService = {
    getAllUsers: () => {
        return apiClient.get('/api/users');
    },
    toggleUserStatus: (userId) => {
        return apiClient.put(`/api/users/${userId}/toggle-status`);
    }
};

export default userService;