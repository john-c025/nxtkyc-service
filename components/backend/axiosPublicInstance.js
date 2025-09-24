// Public axios instance for client-facing APIs (no authentication required)

import axios from 'axios';

const axiosPublicInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for public APIs
axiosPublicInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Public API error:', error);
    return Promise.reject(error);
  }
);

export default axiosPublicInstance;
