import {Request, Response} from "express";

export interface IProductController {

    createProduct(req: Request, res: Response): Promise<void>;

    getProducts(req: Request, res: Response): Promise<void>;

    updateProduct(req: Request, res: Response): Promise<void>;

    deleteProduct(req: Request, res: Response): Promise<void>;

    getProduct(req: Request, res: Response): Promise<void>;

    addVariant(req: Request, res: Response): Promise<void>;

    updateVariant(req: Request, res: Response): Promise<void>;

    deleteVariant(req: Request, res: Response): Promise<void>;

    updateStock(req: Request, res: Response): Promise<void>;

    addImage(req: Request, res: Response): Promise<void>;

    deleteImage(req: Request, res: Response): Promise<void>;

}