import axios from "axios";
import apiClient from './apiClient';


export const registerAPICall = (registerObj) => axios.post(apiClient + '/register', registerObj);

export const loginAPICall = (usernameOrEmail, password) => axios.post(apiClient + '/login', { usernameOrEmail, password});

export const storeToken = (token) => localStorage.setItem("token", token);

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
    if(role !=null && role == "ADMIN"){
        return true
    }else {
        return false
    }
}