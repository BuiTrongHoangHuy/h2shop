import User from '../../user/entities/User';
import { 
  RegisterUserData, 
  RegisterUserResponse, 
  LoginCredentials, 
  LoginResponse, 
  UserProfile 
} from '../entities/Auth';

export interface IAuthService {

  register(userData: RegisterUserData): Promise<RegisterUserResponse>;

  login(credentials: LoginCredentials): Promise<LoginResponse>;

  getUserProfile(userId: number): Promise<UserProfile>;
}
