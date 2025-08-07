import { Router } from 'express';
import productController from '@/controllers/product.controller';

const router = Router();

// Search products
router.get('/search', productController.searchProducts);

// Get product by ID
router.get('/:id', productController.getProductById);

export default router;
