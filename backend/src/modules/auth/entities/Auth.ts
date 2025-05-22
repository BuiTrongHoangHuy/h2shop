interface AuthProps {
  id?: number | null;
  userId?: number | null;
  email?: string;
  salt?: string | null;
  password?: string | null;
  status?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for register user data in service
export interface RegisterUserData {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  role?: 'admin' | 'user';
}

// Interface for register user response in service
export interface RegisterUserResponse {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  gender?: string;
  role: string;
  address?: string;
}

// Interface for login credentials in service
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

// Interface for login response in service
export interface LoginResponse {
  token: string;
  user: UserData;
}

// Interface for user profile in service
export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  gender?: string;
  role: string;
  avatar?: any;
  address?: string;
  createdAt: Date;
}

class Auth {
  id: number | null;
  userId: number | null;
  email: string;
  salt: string | null;
  password: string | null;
  status: number;
  createdAt: Date;
  updatedAt: Date;

  constructor({
    id = null,
    userId = null,
    email = '',
    salt = null,
    password = null,
    status = 1,
    createdAt = new Date(),
    updatedAt = new Date()
  }: AuthProps = {}) {
    this.id = id;
    this.userId = userId;
    this.email = email;
    this.salt = salt;
    this.password = password;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Validate auth data
  validate(): boolean {
    if (!this.userId) {
      throw new Error('User ID is required');
    }

    if (!this.email) {
      throw new Error('Email is required');
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      throw new Error('Email format is invalid');
    }

    if (!this.password) {
      throw new Error('Password is required');
    }

    return true;
  }
}

export default Auth;
