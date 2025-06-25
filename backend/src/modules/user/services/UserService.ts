import { inject, injectable } from "inversify";
import { IUserService } from "./IUserService";
import User from "../entities/User";
import { TYPES } from "../../../types";
import { IUserRepository } from "../repositories/IUserRepository";

@injectable()
export class UserService implements IUserService {

  constructor(@inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository) {
  }

  async getUserById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findById(id);

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserByPhone(phone: string): Promise<User> {
    try {
      const user = await this.userRepository.findByPhone(phone);

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async createUser(userData: {
    fullName: string;
    phone?: string;
    gender?: 'male' | 'female' | 'other';
    role?: 'admin' | 'user';
    avatar?: any;
    address?: string;
    status?: number;
  }): Promise<User> {
    try {
      // Validate input
      if (!userData.fullName) {
        throw new Error('Full name is required');
      }

      // Check if phone already exists (if provided)
      if (userData.phone) {
        const existingUser = await this.userRepository.findByPhone(userData.phone);
        if (existingUser) {
          throw new Error('Phone number already in use');
        }
      }

      // Create user
      const user = new User({
        fullName: userData.fullName,
        phone: userData.phone,
        gender: userData.gender || 'other',
        role: userData.role || 'user',
        avatar: userData.avatar,
        address: userData.address,
        status: userData.status || 1
      });

      // Validate user data
      user.validate();

      // Save user to database
      return await this.userRepository.create(user);
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: number, userData: {
    fullName?: string;
    phone?: string;
    gender?: 'male' | 'female' | 'other';
    role?: 'admin' | 'user';
    avatar?: any;
    address?: string;
    status?: number;
  }): Promise<User> {
    try {
      // Get existing user
      const existingUser = await this.userRepository.findById(id);

      if (!existingUser) {
        throw new Error('User not found');
      }

      // Check if phone already exists (if provided and changed)
      if (userData.phone && userData.phone !== existingUser.phone) {
        const userWithPhone = await this.userRepository.findByPhone(userData.phone);
        if (userWithPhone && userWithPhone.id !== id) {
          throw new Error('Phone number already in use');
        }
      }

      // Update user properties
      const updatedUser = new User({
        id: existingUser.id,
        fullName: userData.fullName || existingUser.fullName,
        phone: userData.phone || existingUser.phone,
        gender: userData.gender || existingUser.gender,
        role: userData.role || existingUser.role,
        avatar: userData.avatar !== undefined ? userData.avatar : existingUser.avatar,
        address: userData.address || existingUser.address,
        status: userData.status !== undefined ? userData.status : existingUser.status,
        createdAt: existingUser.createdAt,
        updatedAt: new Date()
      });

      // Validate user data
      updatedUser.validate();

      // Save user to database
      return await this.userRepository.update(updatedUser);
    } catch (error) {
      throw error;
    }
  }

  async updateUserStatus(id: number, status: number): Promise<void> {
    try {
      // Check if user exists
      const existingUser = await this.userRepository.findById(id);

      if (!existingUser) {
        throw new Error('User not found');
      }

      // Update user status
      await this.userRepository.updateUserStatus(id, status);
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      // Check if user exists
      const existingUser = await this.userRepository.findById(id);

      if (!existingUser) {
        throw new Error('User not found');
      }

      // Delete user
      return await this.userRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers(page?: number, limit?: number): Promise<{
    users: User[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    try {
      return await this.userRepository.findAll(page, limit);
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;