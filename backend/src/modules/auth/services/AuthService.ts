import {inject, injectable} from "inversify";
import {IAuthService} from "./IAuthService";
import Auth, {
    RegisterUserData,
    RegisterUserResponse,
    LoginCredentials,
    LoginResponse,
    UserProfile,
    UserData
} from "../entities/Auth";
import User from "../../user/entities/User";
import {TYPES} from "../../../types";
import jwt from "jsonwebtoken";
import {IUserRepository} from "../../user/repositories/IUserRepository";
import {IAuthRepository} from "../repositories/IAuthRepository";


@injectable()
export class AuthService implements IAuthService {

    constructor(@inject(TYPES.IAuthRepository) private readonly authRepository: IAuthRepository,
                @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,) {
    }


    async register(userData: RegisterUserData): Promise<RegisterUserResponse> {
        try {
            if (!userData.fullName) {
                throw new Error('Full name is required');
            }

            if (!userData.email) {
                throw new Error('Email is required');
            }

            if (!userData.password) {
                throw new Error('Password is required');
            }

            if (userData.password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }

            const existingAuth = await this.authRepository.findByEmail(userData.email);
            if (existingAuth) {
                throw new Error('Email already in use');
            }

            if (userData.phone) {
                const existingUser = await this.userRepository.findByPhone(userData.phone);
                if (existingUser) {
                    throw new Error('Phone number already in use');
                }
            }

            const user = new User({
                fullName: userData.fullName,
                phone: userData.phone,
                gender: userData.gender || 'other',
                role: 'user',
                address: userData.address,
                status: 1
            });

            user.validate();

            const createdUser = await this.userRepository.create(user);

            const auth = new Auth({
                userId: createdUser.id,
                email: userData.email,
                password: userData.password,
                status: 1
            });

            auth.validate();

            // Save auth to database
            await this.authRepository.create(auth);

            return {
                id: createdUser.id as number,
                fullName: createdUser.fullName,
                email: userData.email,
                phone: createdUser.phone,
                gender: createdUser.gender,
                role: createdUser.role,
                address: createdUser.address
            };
        } catch (error) {
            throw error;
        }
    }

    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        try {
            if (!credentials.email) {
                throw new Error('Email is required');
            }

            if (!credentials.password) {
                throw new Error('Password is required');
            }

            const auth = await this.authRepository.verifyPassword(credentials.email, credentials.password);

            if (!auth) {
                throw new Error('Invalid email or password');
            }

            const user = await this.userRepository.findById(auth.userId as number);

            if (!user) {
                throw new Error('User not found');
            }

            if (user.status !== 1) {
                throw new Error('User account is inactive');
            }

            const jwtSecret = process.env.JWT_SECRET;
            const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

            if (!jwtSecret) {
                throw new Error('JWT_SECRET is not defined');
            }

            const token = jwt.sign(
                {
                    userId: user.id,
                    role: user.role
                },
                jwtSecret,
                { expiresIn: 60*60*24}
            );

            const userData: UserData = {
                id: user.id as number,
                fullName: user.fullName,
                email: auth.email,
                phone: user.phone,
                gender: user.gender,
                role: user.role,
                address: user.address
            };

            return {
                token,
                user: userData
            };
        } catch (error) {
            throw error;
        }
    }
    async getUserProfile(userId: number): Promise<UserProfile> {
        try {
            if (!userId) {
                throw new Error('User ID is required');
            }

            const user = await this.userRepository.findById(userId);

            if (!user) {
                throw new Error('User not found');
            }

            const auth = await this.authRepository.findByUserId(userId);

            if (!auth) {
                throw new Error('Auth record not found');
            }

            const userProfile: UserProfile = {
                id: user.id as number,
                fullName: user.fullName,
                email: auth.email,
                phone: user.phone,
                gender: user.gender,
                role: user.role,
                avatar: user.avatar,
                address: user.address,
                createdAt: user.createdAt
            };

            return userProfile;
        } catch (error) {
            throw error;
        }
    }
}