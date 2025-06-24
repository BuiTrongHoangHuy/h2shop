import axios, { AxiosInstance } from 'axios';
import { RegisterUserData, RegisterUserResponse, LoginCredentials, LoginResponse, UserProfile } from '../../types/authTypes'; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Tạo instance axios
const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${API_URL}/auth`,
});

// Interceptor để thêm token vào header
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

// Interceptor để xử lý lỗi 401
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

class AuthApi {
  private baseUrl = `${API_URL}/auth`;

  // Register a new user
  async register(data: RegisterUserData): Promise<RegisterUserResponse> {
    try {
      const response = await axiosInstance.post('/register', data);
      return response.data.data; 
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Login
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axiosInstance.post('/login', credentials);
      return response.data.data; 
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get user profile
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await axiosInstance.get('/profile');
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      return new Error(message);
    }
    return error;
  }
}

export const authApi = new AuthApi();