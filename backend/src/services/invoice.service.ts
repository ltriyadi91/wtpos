import { PaymentType, Invoice, InvoiceItem } from '@prisma/client';
import invoiceRepository from '../repositories/invoice.repository';
import productService from './product.service';
import { AppError } from '../middlewares/error.middleware';

interface InvoiceWithItems extends Invoice {
  items: (InvoiceItem & { product?: any })[];
}

interface InvoiceItemInput {
  productId: number;
  quantity: number;
  unitPrice: number;
}

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export class InvoiceService {
  async createInvoice(
    customer: string,
    salesPerson: string,
    notes: string | undefined,
    paymentType: PaymentType,
    items: InvoiceItemInput[]
  ) {
    // Start a transaction
    const [invoiceNumber, ...products] = await Promise.all([
      invoiceRepository.generateInvoiceNumber(),
      ...items.map(item => 
        productService.getProductById(item.productId)
      )
    ]);

    // Check for sufficient stock before creating the invoice
    items.map((item, idx) =>  {
      const product = products[idx];

      if (!product) {
        throw new AppError(`Product with ID ${item.productId} not found.`, 404);
      }

      if (product.stock < item.quantity) {
        throw new AppError(
          `Insufficient stock for product "${product.name}". Only ${product.stock} left in stock.`,
          400
        );
      }
    })

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);

    // Prepare invoice items
    const invoiceItems = items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.quantity * item.unitPrice,
    }));

    // Create the invoice
    const invoice = await invoiceRepository.create({
      invoiceNumber,
      date: new Date(),
      customer,
      salesPerson,
      notes,
      totalAmount,
      paymentType,
      status: 'completed',
      items: {
        create: invoiceItems,
      },
    });

    await Promise.all(
      items.map(item => 
        productService.updateStock(item.productId, item.quantity)
      )
    );

    return invoice;
  }

  async getInvoiceById(id: number) {
    const invoice = await invoiceRepository.findById(id);
    if (!invoice) {
      throw new AppError('Invoice not found', 404);
    }
    return invoice;
  }

  async getInvoice(id: number): Promise<InvoiceWithItems> {
    const invoice = await invoiceRepository.findById(id);
    if (!invoice) {
      throw new AppError('Invoice not found', 404);
    }
    return invoice;
  }

  async getInvoices({ page = 1, limit = 10, search = '' }: PaginationParams) {
    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.min(100, Math.max(1, Number(limit) || 10));

    const { invoices, total } = await invoiceRepository.getInvoices(
      pageNumber,
      limitNumber,
      search
    );

    const totalPages = Math.ceil(total / limitNumber);

    return {
      data: invoices,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNumber,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },
    };
  }

  async getRevenue(range: 'day' | 'week' | 'month') {
    const revenueData = await invoiceRepository.getRevenueData(range);

    return revenueData.map(item => ({
      date: new Date(item.date).toDateString(),
      revenue: Number(item.revenue),
    }));
  }
}

export default new InvoiceService();
