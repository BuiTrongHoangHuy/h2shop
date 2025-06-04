import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
});

// Gắn token từ localStorage/sessionStorage
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Xử lý lỗi 401
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
