import { PrismaClient } from '@prisma/client';
import { Product } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductRepository {
  async findAll(searchTerm: string = '', limit: number = 10): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      take: limit,
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: number): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  async updateStock(id: number, quantity: number): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });
  }
}

export default new ProductRepository();
