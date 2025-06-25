import { Request, Response } from 'express';


export interface IUserController {

  getUserById(req: Request, res: Response): Promise<Response>;

  getUserByPhone(req: Request, res: Response): Promise<Response>;

  createUser(req: Request, res: Response): Promise<Response>;

  updateUser(req: Request, res: Response): Promise<Response>;

  updateUserStatus(req: Request, res: Response): Promise<Response>;

  deleteUser(req: Request, res: Response): Promise<Response>;

  getAllUsers(req: Request, res: Response): Promise<Response>;
}