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

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);

    // Prepare invoice items
    const invoiceItems = items.map((item, index) => ({
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

    // Update product stocks
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
    // Ensure page and limit are valid numbers
    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.min(100, Math.max(1, Number(limit) || 10)); // Cap at 100 items per page

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
}

export default new InvoiceService();
