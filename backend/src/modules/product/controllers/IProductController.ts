import {Request, Response} from "express";

export interface IProductController {

    createProduct(req: Request, res: Response): Promise<void>;

    getProducts(req: Request, res: Response): Promise<void>;


    getProduct(req: Request, res: Response): Promise<void>;



}