import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserRepository from "../modules/user/repositories/UserRepository";

// Interface for JWT payload
interface JwtPayload {
  userId: number;
  role: string;
  [key: string]: any;
}

// Extend Express Request to include user property
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number | null;
    role: string;
    [key: string]: any;
  };
}

const userRepository = new UserRepository();

/**
 * Middleware to verify JWT token and authenticate users
 */
export const isAuthenticated = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<Response | void> => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    
    // Get the user from the database
    const user = await userRepository.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. User not found.' 
      });
    }
    
    // Attach the user to the request object
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

/**
 * Middleware to check if the user is an admin
 */
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

/**
 * Middleware to check if the user is the owner of the resource or an admin
 */
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
    
    // Extract the user ID from the request using the provided extractor function
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
};