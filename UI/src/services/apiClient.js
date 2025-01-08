import axios from 'axios';
import { getToken } from './authService';  // Make sure this import is present


// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
});


// Add a request interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Optionally redirect to login page or handle unauthorized access
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;