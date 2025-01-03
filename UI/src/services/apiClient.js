import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default apiClient;