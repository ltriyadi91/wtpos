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

      const invoice = await invoiceService.getInvoice(invoiceId);
      
      res.status(200).json({
        status: 'success',
        data: {
          invoice,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getInvoices(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || '';

      const result = await invoiceService.getInvoices({
        page,
        limit,
        search,
      });
      
      res.status(200).json({
        status: 'success',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRevenue(req: Request, res: Response, next: NextFunction) {
    console.log({ req })
    try {
      const range = req.query.range as 'day' | 'week' | 'month' || 'day';

      if (!['day', 'week', 'month'].includes(range)) {
        throw new AppError('Invalid range parameter. Use day, week, or month.', 400);
      }

      const revenueData = await invoiceService.getRevenue(range);

      res.status(200).json({
        status: 'success',
        data: revenueData,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new InvoiceController();
