// Interface for data required to register a new user
export interface RegisterUserData {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  role?: 'admin' | 'user';
}

// Interface for the response after registering a new user
export interface RegisterUserResponse {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  gender?: string;
  role: string;
  address?: string;
}

// Interface for login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Interface for user data in login response
export interface UserData {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  gender?: string;
  role: string;
  address?: string;
}

// Interface for the response after a successful login
export interface LoginResponse {
  token: string;
  user: UserData;
}

// Interface for user profile
export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  gender?: string;
  role: string;
  avatar?: string; // Changed from 'any' to 'string' for better type safety (assuming avatar is a URL)
  address?: string;
  createdAt: Date;
}