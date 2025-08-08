import { PrismaClient, Prisma, Invoice, InvoiceItem } from '@prisma/client';

const prisma = new PrismaClient();

interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[];
}

export class InvoiceRepository {
  async create(data: Prisma.InvoiceCreateInput): Promise<InvoiceWithItems> {
    return prisma.invoice.create({
      data,
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

  async getInvoices(page: number = 1, limit: number = 10, search: string = ''): Promise<{ invoices: InvoiceWithItems[], total: number }> {
    const skip = (page - 1) * limit;
    
    const where: Prisma.InvoiceWhereInput = {};
    
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { customer: { contains: search, mode: 'insensitive' } },
        { salesPerson: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    return { invoices, total };
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

  async getRevenueData(range: 'day' | 'week' | 'month'): Promise<any[]> {
    let query: Prisma.Sql;

    switch (range) {
      case 'day':
        query = Prisma.sql`
          SELECT DATE_TRUNC('day', "date") as date, SUM("totalAmount") as revenue
          FROM "Invoice"
          GROUP BY date
          ORDER BY date ASC
        `;
        break;
      case 'week':
        query = Prisma.sql`
          SELECT DATE_TRUNC('week', "date") as date, SUM("totalAmount") as revenue
          FROM "Invoice"
          GROUP BY date
          ORDER BY date ASC
        `;
        break;
      case 'month':
        query = Prisma.sql`
          SELECT DATE_TRUNC('month', "date") as date, SUM("totalAmount") as revenue
          FROM "Invoice"
          GROUP BY date
          ORDER BY date ASC
        `;
        break;
      default:
        throw new Error('Invalid range type');
    }

    return prisma.$queryRaw(query);
  }
}

export default new InvoiceRepository();
