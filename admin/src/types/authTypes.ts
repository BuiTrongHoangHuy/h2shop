
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