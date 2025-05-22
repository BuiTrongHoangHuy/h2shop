import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../../middlewares/authMiddleware';
import {AuthService} from "../services/AuthService";
import {inject} from "inversify";
import {TYPES} from "../../../types";
import {IAuthService} from "../services/IAuthService";
import {IAuthController} from "./IAuthController";

export class AuthController implements IAuthController{
  constructor(@inject(TYPES.IAuthService) private readonly authService: IAuthService) {
  }

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { fullName, email, password, phone, gender, address, role } = req.body;
      
      const result = await this.authService.register({
        fullName,
        email,
        password,
        phone,
        gender,
        address,
        role
      });
      
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      
      return res.status(400).json({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      
      const result = await this.authService.login({
        email,
        password
      });
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error: any) {
      console.error('Login error:', error);
      
      return res.status(401).json({
        success: false,
        message: error.message || 'Login failed'
      });
    }
  }

  async getProfile(req: Request, res: Response): Promise<Response> {
    try {
      const {userId} = req.body;
      console.log(userId);
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }
      
      const result = await this.authService.getUserProfile(userId);
      
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      console.error('Get profile error:', error);
      
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to get user profile'
      });
    }
  }
}
