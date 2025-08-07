import { Request, Response, NextFunction } from 'express';
import invoiceService from '@/services/invoice.service';
import { AppError } from '@/middlewares/error.middleware';

interface InvoiceItemRequest {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export class InvoiceController {
  async createInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer, salesPerson, notes, items, paymentType } = req.body;

      // Validate required fields
      if (!customer || !salesPerson || !items || !Array.isArray(items) || items.length === 0) {
        throw new AppError('Customer, sales person, and at least one item are required', 400);
      }

      // Validate items
      for (const item of items) {
        if (!item.productId || !item.quantity || item.quantity <= 0) {
          throw new AppError('Each item must have a valid product ID and quantity greater than 0', 400);
        }
      }

      const invoice = await invoiceService.createInvoice(
        customer,
        salesPerson,
        notes,
        paymentType,
        items as InvoiceItemRequest[]
      );

      res.status(201).json({
        status: 'success',
        data: {
          invoice,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const invoiceId = parseInt(id, 10);
      
      if (isNaN(invoiceId)) {
        throw new AppError('Invalid invoice ID', 400);
      }

      const invoice = await invoiceService.getInvoiceById(invoiceId);
      
      res.json({
        status: 'success',
        data: {
          invoice,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new InvoiceController();
