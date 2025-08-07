import { Product } from '@prisma/client';
import productRepository from '../repositories/product.repository';
import { AppError } from '../middlewares/error.middleware';

export class ProductService {
  async searchProducts(searchTerm: string, limit: number = 10): Promise<Product[]> {
    try {
      return await productRepository.findAll(searchTerm, limit);
    } catch (error) {
      throw new AppError('Error searching products', 500);
    }
  }

  async getProductById(id: number): Promise<Product | null> {
    try {
      const product = await productRepository.findById(id);
      if (!product) {
        throw new AppError('Product not found', 404);
      }
      return product;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error fetching product', 500);
    }
  }

  async updateStock(productId: number, quantity: number): Promise<Product> {
    try {
      const product = await productRepository.findById(productId);
      if (!product) {
        throw new AppError('Product not found', 404);
      }

      if (product.stock < quantity) {
        throw new AppError(`Insufficient stock. Only ${product.stock} items available`, 400);
      }

      return await productRepository.updateStock(productId, quantity);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating product stock', 500);
    }
  }
}

export default new ProductService();
