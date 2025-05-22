/*
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserRepository from "../modules/user/repositories/UserRepository";

// Interface for JWT payload
interface JwtPayload {
  userId: number;
  role: string;
  [key: string]: any;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number | null;
    role: string;
    [key: string]: any;
  };
}

const userRepository = new UserRepository();


export const isAuthenticated = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<Response | void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    
    const user = await userRepository.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. User not found.' 
      });
    }
    
    (req as AuthenticatedRequest).user = user;
    
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired. Please login again.' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. Please login again.' 
      });
    }
    
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error.' 
    });
  }
};


export const isAdmin = (
  req: Request, 
  res: Response, 
  next: NextFunction
): Response | void => {
  const authReq = req as AuthenticatedRequest;
  
  if (!authReq.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required.' 
    });
  }
  
  if (authReq.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin role required.' 
    });
  }
  
  next();
};


export const isOwnerOrAdmin = (
  userIdExtractor: (req: Request) => number
) => {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    const authReq = req as AuthenticatedRequest;
    
    if (!authReq.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required.' 
      });
    }
    
    const resourceUserId = userIdExtractor(req);
    
    if (authReq.user.role === 'admin' || authReq.user.id === resourceUserId) {
      next();
    } else {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. You do not have permission to access this resource.' 
      });
    }
  };
};*/
