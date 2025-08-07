import { PaymentType } from '@prisma/client';
import invoiceRepository from '../repositories/invoice.repository';
import productService from './product.service';
import { AppError } from '../middlewares/error.middleware';

interface InvoiceItemInput {
  productId: number;
  quantity: number;
  unitPrice: number;
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
}

export default new InvoiceService();
