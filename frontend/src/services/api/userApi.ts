import axiosInstance from "@/services/api/axiosInstance";
import { toast } from 'react-toastify';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface User {
  id: number;
  fullName: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  role: 'admin' | 'user';
  avatar?: any;
  address: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  fullName: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  role?: 'admin' | 'user';
  avatar?: any;
  address?: string;
  status?: number;
}

export interface UpdateUserData {
  fullName?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  role?: 'admin' | 'user';
  avatar?: any;
  address?: string;
  status?: number;
}

export interface UserResponse {
  success: boolean;
  data?: User;
  message?: string;
}

export interface UsersListResponse {
  success: boolean;
  data: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const userApi = {
  // Get current user profile (authenticated users)
  getProfile: async (): Promise<UserResponse> => {
    try {
      const response = await axiosInstance.get(`${API_URL}/user/profile`);
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to get profile');
      throw error;
    }
  },

  // Update current user profile (authenticated users)
  updateProfile: async (userData: UpdateUserData): Promise<UserResponse> => {
    try {
      const response = await axiosInstance.put(`${API_URL}/user/profile`, userData);
      toast.success(response.data.message || 'Profile updated successfully');
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      throw error;
    }
  },

  // Admin endpoints (require admin authentication)

  // Get all users with pagination (admin only)
  getAllUsers: async (page: number = 1, limit: number = 10): Promise<UsersListResponse> => {
    try {
      const response = await axiosInstance.get(`${API_URL}/user`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to get users');
      throw error;
    }
  },

  // Get user by ID (admin only)
  getUserById: async (id: number): Promise<UserResponse> => {
    try {
      const response = await axiosInstance.get(`${API_URL}/user/${id}`);
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to get user');
      throw error;
    }
  },

  // Get user by phone (admin only)
  getUserByPhone: async (phone: string): Promise<UserResponse> => {
    try {
      const response = await axiosInstance.get(`${API_URL}/user/phone/${phone}`);
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to get user');
      throw error;
    }
  },

  // Create new user (admin only)
  createUser: async (userData: CreateUserData): Promise<UserResponse> => {
    try {
      const response = await axiosInstance.post(`${API_URL}/user`, userData);
      toast.success(response.data.message || 'User created successfully');
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create user');
      throw error;
    }
  },

  // Update user by ID (admin only)
  updateUser: async (id: number, userData: UpdateUserData): Promise<UserResponse> => {
    try {
      const response = await axiosInstance.put(`${API_URL}/user/${id}`, userData);
      toast.success(response.data.message || 'User updated successfully');
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user');
      throw error;
    }
  },

  // Delete user by ID (admin only)
  deleteUser: async (id: number): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/user/${id}`);
      toast.success(response.data.message || 'User deleted successfully');
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
      throw error;
    }
  }
};

export default userApi; 