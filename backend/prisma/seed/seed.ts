import { PrismaClient, PaymentType } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { subMonths } from 'date-fns';

const prisma = new PrismaClient();

// --- Products Data ---
const designProducts = [
  'UI/UX Design Package',
  'Logo Design',
  'Brand Identity Kit',
  'Website Redesign',
  'Mobile App Design',
  'Social Media Graphics',
  'Print Design (Brochures, Flyers)',
  'Presentation Design',
  'Icon Set',
  'Illustration Pack'
];

const softwareProducts = [
  'Web Application Development',
  'Mobile App Development',
  'E-commerce Website',
  'Custom CMS',
  'API Development',
  'Database Design',
  'Cloud Migration',
  'DevOps Setup',
  'Progressive Web App',
  'Chatbot Development'
];

// --- Invoices Data ---
const customers = [
  'Acme Corp',
  'Globex Corporation',
  'Soylent Corp',
  'Initech',
  'Umbrella Corporation',
  'Wonka Industries',
  'Stark Industries',
  'Wayne Enterprises',
  'Cyberdyne Systems',
  'Olivia Pope & Associates'
];

const salesPeople = [
  'John Smith',
  'Sarah Johnson',
  'Michael Brown',
  'Emily Davis',
  'Robert Wilson',
  'Jennifer Lee'
];

const paymentTypes: PaymentType[] = [
  PaymentType.CASH,
  PaymentType.CREDIT_CARD,
  PaymentType.NOTCASHORCREDIT
];

const statuses = ['draft', 'sent', 'paid', 'overdue'];

// --- Helper Functions ---
function getRandomDate() {
  const threeMonthsAgo = subMonths(new Date(), 3);
  const today = new Date();
  return faker.date.between({ from: threeMonthsAgo, to: today });
}

function generateInvoiceNumber(index: number) {
  const year = new Date().getFullYear();
  const paddedNumber = String(index).padStart(5, '0');
  return `INV-${year}-${paddedNumber}`;
}


async function main() {
  console.log('🌱 Starting seed...');

  // --- Seed Products ---
  console.log('🌱 Seeding products...');
  const designProductsData = designProducts.map((name) => ({
    name,
    image: faker.image.urlPicsumPhotos({ width: 400, height: 300 }),
    stock: faker.number.int({ min: 5, max: 100 }),
    price: faker.number.float({ min: 100, max: 10000, fractionDigits: 0 }),
  }));

  const softwareProductsData = softwareProducts.map((name) => ({
    name,
    image: faker.image.urlPicsumPhotos({ width: 400, height: 300 }),
    stock: faker.number.int({ min: 1, max: 50 }),
    price: faker.number.float({ min: 500, max: 10000, fractionDigits: 0 }),
  }));

  const allProducts = [...designProductsData, ...softwareProductsData];

  await prisma.product.createMany({
    data: allProducts,
  });
  console.log('✅ Products seeded!');

  // --- Seed Invoices ---
  console.log('🌱 Seeding invoices...');
  const products = await prisma.product.findMany();
  if (products.length === 0) {
    console.error('No products found to create invoices. Exiting.');
    process.exit(1);
  }

  const invoiceCount = 50;
  for (let i = 0; i < invoiceCount; i++) {
    const invoiceDate = getRandomDate();
    const customer = faker.helpers.arrayElement(customers);
    const salesPerson = faker.helpers.arrayElement(salesPeople);
    const paymentType = faker.helpers.arrayElement(paymentTypes);
    const status = faker.helpers.arrayElement(statuses);
    const notes = faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 });

    const itemCount = faker.number.int({ min: 1, max: 5 });
    const selectedProducts = faker.helpers.arrayElements(products, itemCount);

    let totalAmount = 0;
    const items = selectedProducts.map(product => {
      const quantity = faker.number.int({ min: 1, max: 5 });
      const unitPrice = product.price;
      const itemTotal = quantity * unitPrice;
      totalAmount += itemTotal;

      return {
        productId: product.id,
        quantity,
        unitPrice,
        totalPrice: itemTotal
      };
    });

    await prisma.invoice.create({
      data: {
        invoiceNumber: generateInvoiceNumber(i + 1),
        date: invoiceDate,
        customer,
        salesPerson,
        notes,
        totalAmount,
        paymentType,
        status,
        items: {
          create: items
        },
        createdAt: invoiceDate,
        updatedAt: invoiceDate
      }
    });

    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }
    console.log(`✅ Created invoice ${i + 1}/${invoiceCount}`);
  }
  console.log('✅ Invoices seeded!');
  console.log('🌱 Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
