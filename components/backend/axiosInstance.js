// utils/axiosInstance.js

import axios from 'axios';
import { getAuthToken } from '../../utils/cookieHelper';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Get JWT token from cookies
    const token = getAuthToken();
    
    if (token) {
      // Add Authorization header with Bearer token
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added JWT token to request headers');
    } else {
      console.log('No JWT token found, making unauthenticated request');
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized responses
    if (error.response?.status === 401) {
      console.log('Received 401 Unauthorized - token may be expired or invalid');
      
      // Remove invalid token from cookies
      if (typeof document !== 'undefined') {
        document.cookie = 'authToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
      }
      
      // Optionally redirect to login page
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        console.log('Redirecting to login page due to authentication failure');
        // window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;