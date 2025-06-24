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
import { ICategoryRepository } from './modules/category/repositories/ICategoryRepository';
import { ICategoryService } from './modules/category/services/ICategoryService';
import { CategoryService } from './modules/category/services/CategoryService';
import { CategoryRepository } from './modules/category/repositories/CategoryRepository';
import {IPaymentService} from "./modules/payment/services/IPaymentService";
import {PaymentService} from "./modules/payment/services/PaymentService";
import {IPaymentRepository} from "./modules/payment/repositories/IPaymentRepository";
import {PaymentRepository} from "./modules/payment/repositories/PaymentRepository";
import { IReviewRepository } from "./modules/review/repositories/IReviewRepository";
import { ReviewRepository } from "./modules/review/repositories/ReviewRepository";
import { IReviewService } from "./modules/review/services/IReviewService";
import { ReviewService } from "./modules/review/services/ReviewService";
dotenv.config();
const container = new Container();


//Repository
container.bind<IAuthRepository>(TYPES.IAuthRepository).to(AuthRepository).inRequestScope();
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inRequestScope();
container.bind<IProductRepository>(TYPES.IProductRepository).to(ProductRepository).inRequestScope();
container.bind<ICartRepository>(TYPES.ICartRepository).to(CartRepository).inRequestScope();
container.bind<IOrderRepository>(TYPES.IOrderRepository).to(OrderRepository).inRequestScope();
container.bind<ICategoryRepository>(TYPES.ICategoryRepository).to(CategoryRepository).inRequestScope();
container.bind<IPaymentRepository>(TYPES.IPaymentRepository).to(PaymentRepository);
container.bind<IReviewRepository>(TYPES.IReviewRepository).to(ReviewRepository).inRequestScope();

//Service
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService).inRequestScope();
container.bind<IUserService>(TYPES.IUserService).to(UserService).inRequestScope();
container.bind<IProductService>(TYPES.IProductService).to(ProductService).inRequestScope();
container.bind<ICartService>(TYPES.ICartService).to(CartService).inRequestScope();
container.bind<IOrderService>(TYPES.IOrderService).to(OrderService).inRequestScope();
container.bind<ICategoryService>(TYPES.ICategoryService).to(CategoryService).inRequestScope();
container.bind<IPaymentService>(TYPES.IPaymentService).to(PaymentService).inRequestScope();
container.bind<IReviewService>(TYPES.IReviewService).to(ReviewService).inRequestScope();


export {container};
