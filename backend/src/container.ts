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
import {IProductRepository} from "./modules/product/repositories/IProductRepository";
import {ProductRepository} from "./modules/product/repositories/ProductRepository";
import {IProductService} from "./modules/product/services/IProductService";
import {ProductService} from "./modules/product/services/ProductService";
import {ICartRepository} from "./modules/cart/repositories/ICartRepository";
import {CartRepository} from "./modules/cart/repositories/CartRepository";
import {ICartService} from "./modules/cart/services/ICartService";
import {CartService} from "./modules/cart/services/CartService";
import {IOrderRepository} from "./modules/order/repositories/IOrderRepository";
import {OrderRepository} from "./modules/order/repositories/OrderRepository";
import {OrderService} from "./modules/order/services/OrderService";
import {IOrderService} from "./modules/order/services/IOrderService";
dotenv.config();
const container = new Container();


//Repository
container.bind<IAuthRepository>(TYPES.IAuthRepository).to(AuthRepository).inRequestScope();
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inRequestScope();
container.bind<IProductRepository>(TYPES.IProductRepository).to(ProductRepository).inRequestScope();
container.bind<ICartRepository>(TYPES.ICartRepository).to(CartRepository).inRequestScope();
container.bind<IOrderRepository>(TYPES.IOrderRepository).to(OrderRepository).inRequestScope();

//Service
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService).inRequestScope();
container.bind<IUserService>(TYPES.IUserService).to(UserService).inRequestScope();
container.bind<IProductService>(TYPES.IProductService).to(ProductService).inRequestScope();
container.bind<ICartService>(TYPES.ICartService).to(CartService).inRequestScope();
container.bind<IOrderService>(TYPES.IOrderService).to(OrderService).inRequestScope();


export {container};