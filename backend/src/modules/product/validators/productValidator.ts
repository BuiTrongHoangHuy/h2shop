import Joi from 'joi';
import { CreateProductData } from '../entities/Product';

export const validateCreateProduct = (data: any) => {
  const schema = Joi.object<CreateProductData>({
    name: Joi.string().required().min(3).max(100),
    description: Joi.string().required().min(10),
    categoryId: Joi.string().required(),
    price: Joi.number().required().min(0),
    stock: Joi.number().min(0),
    variants: Joi.array().items(
      Joi.object({
        sku: Joi.string().required(),
        color: Joi.string(),
        size: Joi.string(),
        price: Joi.number().required().min(0),
        stockQuantity: Joi.number().required().min(0)
      })
    )
  });

  return schema.validate(data);
};

export const validateUpdateProduct = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100),
    description: Joi.string().min(10),
    categoryId: Joi.string(),
    price: Joi.number().min(0),
    stock: Joi.number().min(0),
    variants: Joi.array().items(
      Joi.object({
        sku: Joi.string(),
        color: Joi.string(),
        size: Joi.string(),
        price: Joi.number().min(0),
        stockQuantity: Joi.number().min(0)
      })
    )
  });

  return schema.validate(data);
}; 