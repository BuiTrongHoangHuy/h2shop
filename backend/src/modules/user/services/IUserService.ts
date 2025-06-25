import User from '../entities/User';

/**
 * Interface for User Service
 */
export interface IUserService {
  /**
   * Get user by ID
   * @param id - The user ID
   * @returns Promise resolving to the user
   */
  getUserById(id: number): Promise<User>;

  /**
   * Get user by phone number
   * @param phone - The phone number
   * @returns Promise resolving to the user
   */
  getUserByPhone(phone: string): Promise<User>;

  /**
   * Create a new user
   * @param userData - The user data for creation
   * @returns Promise resolving to the created user
   */
  createUser(userData: {
    fullName: string;
    phone?: string;
    gender?: 'male' | 'female' | 'other';
    role?: 'admin' | 'user';
    avatar?: any;
    address?: string;
    status?: number;
  }): Promise<User>;

  /**
   * Update an existing user
   * @param id - The user ID
   * @param userData - The user data to update
   * @returns Promise resolving to the updated user
   */
  updateUser(id: number, userData: {
    fullName?: string;
    phone?: string;
    gender?: 'male' | 'female' | 'other';
    role?: 'admin' | 'user';
    avatar?: any;
    address?: string;
    status?: number;
  }): Promise<User>;

  /**
   * Update user status
   * @param id - The user ID
   * @param status - The new status (1 for active, 0 for inactive)
   * @returns Promise resolving to void
   */
  updateUserStatus(id: number, status: number): Promise<void>;

  /**
   * Delete a user by ID (soft delete)
   * @param id - The user ID
   * @returns Promise resolving to true if successful
   */
  deleteUser(id: number): Promise<boolean>;

  /**
   * Get all users with pagination
   * @param page - The page number
   * @param limit - The number of items per page
   * @returns Promise resolving to users and pagination info
   */
  getAllUsers(page?: number, limit?: number): Promise<{
    users: User[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>;
}