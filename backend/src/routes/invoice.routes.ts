import { Router } from 'express';
import invoiceController from '@/controllers/invoice.controller';

const router = Router();

// Create a new invoice
router.post('/', invoiceController.createInvoice);

// Get revenue data
router.get('/revenue', invoiceController.getRevenue);

// Get all invoices with pagination and search
router.get('/', invoiceController.getInvoices);

// Get invoice by ID
router.get('/:id', invoiceController.getInvoice);


export default router;
