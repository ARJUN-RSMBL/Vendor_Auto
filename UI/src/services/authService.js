import axios from 'axios';
import apiClient from './apiClient';

const BASE_URL = 'http://localhost:8080';

// Create a separate axios instance for auth
const authClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// export const registerAPICall = (registerObj) => axios.post(apiClient + '/register', registerObj);
export const registerAPICall = (registerObj) => apiClient.post('/register', registerObj);

// export const loginAPICall = (usernameOrEmail, password) => axios.post(apiClient + '/login', { usernameOrEmail, password});
// export const loginAPICall = (usernameOrEmail, password) => apiClient.post('/login', { usernameOrEmail, password});
export const loginAPICall = (usernameOrEmail, password) => apiClient.post('/api/auth/login', 
    { usernameOrEmail, password }
);

// export const storeToken = (token) => localStorage.setItem("token", token);
export const storeToken = (token) => {
    if (!token || typeof token !== 'string') {
        console.warn('Invalid token format');
        return;
    }
    localStorage.setItem("token", token);
}

export const getToken = () => localStorage.getItem("token");

export const saveLoggedInUser = (username,role) => {
    sessionStorage.setItem("authenticatedUser", username);
    sessionStorage.setItem("role", role);
}

export const isUserLoggedIn = () => {

    const username = sessionStorage.getItem("authenticatedUser");

    if(username == null) {
        return false;
    }    
    else {
        return true;
    }   
}

export const getLoggedInUser = () => {
    const username = sessionStorage.getItem("authenticatedUser");
    return username;
}

export const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
}

export const isAdminUser = () => {
    let role  = sessionStorage.getItem("role");
    if(role != null && role === "ROLE_ADMIN") {  // Changed == to === and 'ADMIN' to 'ROLE_ADMIN'
        return true;
    } else {
        return false;
    }
}

export const hasRole = (requiredRole) => {
    const role = sessionStorage.getItem("role");
    return role === requiredRole;
};

export const isVendorUser = () => {
    return hasRole("ROLE_VENDOR");
};

export const hasVendorAccess = () => {
    return isAdminUser() || isVendorUser();
};