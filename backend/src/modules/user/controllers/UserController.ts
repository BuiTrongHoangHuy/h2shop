import { Request, Response } from 'express';
import { IUserService } from '../services/IUserService';
import { inject } from "inversify";
import { TYPES } from "../../../types";
import { IUserController } from './IUserController';

export class UserController implements IUserController {

  constructor(@inject(TYPES.IUserService) private readonly userService: IUserService) {
  }

  async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
      }
      
      const result = await this.userService.getUserById(id);
      
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      console.error('Get user by ID error:', error);
      
      return res.status(error.message === 'User not found' ? 404 : 400).json({
        success: false,
        message: error.message || 'Failed to get user'
      });
    }
  }

  async getUserByPhone(req: Request, res: Response): Promise<Response> {
    try {
      const { phone } = req.params;
      
      if (!phone) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is required'
        });
      }
      
      const result = await this.userService.getUserByPhone(phone);
      
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      console.error('Get user by phone error:', error);
      
      return res.status(error.message === 'User not found' ? 404 : 400).json({
        success: false,
        message: error.message || 'Failed to get user'
      });
    }
  }

  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const { fullName, phone, gender, role, avatar, address, status } = req.body;
      
      const result = await this.userService.createUser({
        fullName,
        phone,
        gender,
        role,
        avatar,
        address,
        status
      });
      
      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: result
      });
    } catch (error: any) {
      console.error('Create user error:', error);
      
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to create user'
      });
    }
  }

  async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
      }
      
      const { fullName, phone, gender, role, avatar, address, status } = req.body;
      
      const result = await this.userService.updateUser(id, {
        fullName,
        phone,
        gender,
        role,
        avatar,
        address,
        status
      });
      
      return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: result
      });
    } catch (error: any) {
      console.error('Update user error:', error);
      
      return res.status(error.message === 'User not found' ? 404 : 400).json({
        success: false,
        message: error.message || 'Failed to update user'
      });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID'
        });
      }
      
      await this.userService.deleteUser(id);
      
      return res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error: any) {
      console.error('Delete user error:', error);
      
      return res.status(error.message === 'User not found' ? 404 : 400).json({
        success: false,
        message: error.message || 'Failed to delete user'
      });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return res.status(400).json({
          success: false,
          message: 'Invalid pagination parameters'
        });
      }
      
      const result = await this.userService.getAllUsers(page, limit);
      
      return res.status(200).json({
        success: true,
        data: result.users,
        pagination: result.pagination
      });
    } catch (error: any) {
      console.error('Get all users error:', error);
      
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to get users'
      });
    }
  }
}

export default UserController;