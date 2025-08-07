import { Request, Response, NextFunction } from 'express';
import productService from '@/services/product.service';
import { AppError } from '@/middlewares/error.middleware';

export class ProductController {
  async searchProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { q, limit } = req.query;
      const searchTerm = typeof q === 'string' ? q : '';
      const limitNum = limit ? parseInt(limit as string, 10) : 10;
      
      const products = await productService.searchProducts(searchTerm, limitNum);
      res.json(products);
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const productId = parseInt(id, 10);
      
      if (isNaN(productId)) {
        throw new AppError('Invalid product ID', 400);
      }

      const product = await productService.getProductById(productId);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();
