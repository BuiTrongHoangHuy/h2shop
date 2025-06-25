import axiosInstance from './axiosInstance';

export interface Customer {
    id: number;
    fullName: string;
    phone: string;
    gender: 'male' | 'female' | 'other';
    role: 'admin' | 'user';
    avatar: any | null;
    address: string;
    status: number;
    createdAt: string;
    updatedAt: string;
}

export interface CustomerListResponse {
    success: boolean;
    data: Customer[];
}

export const fetchCustomers = async (): Promise<CustomerListResponse> => {
    const response = await axiosInstance.get('/user');
    return response.data;
};

export const updateUserStatus = async (userId: number, status: number) => {
    const response = await axiosInstance.patch(`/user/${userId}/status`, { status });
    return response.data;
};

