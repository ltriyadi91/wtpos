import { PrismaClient, Prisma, Invoice, InvoiceItem } from '@prisma/client';

const prisma = new PrismaClient();

interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[];
}

export class InvoiceRepository {
  async create(data: Prisma.InvoiceCreateInput): Promise<InvoiceWithItems> {
    return prisma.invoice.create({
      data: {
        ...data,
        items: {
          create: (data as any).items,
        },
      },
      include: {
        items: true,
      },
    });
  }

  async findById(id: number): Promise<InvoiceWithItems | null> {
    return prisma.invoice.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async generateInvoiceNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = String(today.getMonth() + 1).padStart(2, '0');
    
    const lastInvoice = await prisma.invoice.findFirst({
      orderBy: { id: 'desc' },
      select: { invoiceNumber: true },
    });

    let sequence = 1;
    if (lastInvoice?.invoiceNumber) {
      const lastSequence = parseInt(lastInvoice.invoiceNumber.split('-')[2] || '0');
      sequence = lastSequence + 1;
    }

    return `INV-${year}${month}-${String(sequence).padStart(4, '0')}`;
  }
}

export default new InvoiceRepository();
