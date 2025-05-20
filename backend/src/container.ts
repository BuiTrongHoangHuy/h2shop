import 'reflect-metadata';
import {Container} from 'inversify';
import {TYPES} from "./types";
import dotenv from "dotenv";
import {IUserRepository} from "./modules/user/repositories/IUserRepository";
import UserRepository from "./modules/user/repositories/UserRepository";
import {AuthService} from "./modules/auth/services/AuthService";
import {IUserService, UserService} from "./modules/user/services";
import AuthRepository from "./modules/auth/repositories/AuthRepository";
import {IAuthRepository} from "./modules/auth/repositories/IAuthRepository";
import {IAuthService} from "./modules/auth/services/IAuthService";
dotenv.config();
const container = new Container();


//Repository
container.bind<IAuthRepository>(TYPES.IAuthRepository).to(AuthRepository).inRequestScope();
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inRequestScope();


//Service
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService).inRequestScope();
container.bind<IUserService>(TYPES.IUserService).to(UserService).inRequestScope();


export {container};