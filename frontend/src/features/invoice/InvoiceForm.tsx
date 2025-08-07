import { useState } from 'react';
import { useForm } from '@mantine/form';
import { useDispatch, useSelector } from 'react-redux';
import { 
  TextInput, 
  Button, 
  Paper, 
  Title, 
  Text, 
  Group, 
  Table, 
  ActionIcon, 
  NumberInput, 
  Textarea,
  LoadingOverlay,
  Divider,
  Box,
  rem
} from '@mantine/core';
import { 
  IconTrash, 
  IconPlus, 
  IconMinus, 
  IconCheck,
  IconX
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { createInvoice, selectInvoiceItems, selectInvoiceTotal } from './invoiceSlice';
import { ProductSearch } from '../products/ProductSearch';

export function InvoiceForm() {
  const dispatch = useDispatch();
  const items = useSelector(selectInvoiceItems);
  const total = useSelector(selectInvoiceTotal);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    initialValues: {
      customer: '',
      salesPerson: '',
      notes: '',
    },
    validate: {
      customer: (value) => (value.trim().length < 2 ? 'Customer name is required' : null),
      salesPerson: (value) => (value.trim().length < 2 ? 'Sales person name is required' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (items.length === 0) {
      notifications.show({
        title: 'Error',
        message: 'Please add at least one product to the invoice',
        color: 'red',
        icon: <IconX size="1.1rem" />,
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await dispatch(createInvoice({
        customer: values.customer,
        salesPerson: values.salesPerson,
        notes: values.notes,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      }) as any).unwrap();
      
      notifications.show({
        title: 'Success',
        message: 'Invoice created successfully',
        color: 'green',
        icon: <IconCheck size="1.1rem" />,
      });
      
      form.reset();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create invoice. Please try again.',
        color: 'red',
        icon: <IconX size="1.1rem" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const rows = items.map((item) => (
    <Table.Tr key={item.productId}>
      <Table.Td>
        <Group>
          <Image
            src={item.product.image || '/placeholder-product.png'}
            alt={item.product.name}
            width={40}
            height={40}
            fit="contain"
            radius="sm"
          />
          <Text fw={500}>{item.product.name}</Text>
        </Group>
      </Table.Td>
      <Table.Td>${item.unitPrice.toFixed(2)}</Table.Td>
      <Table.Td>
        <Group gap={5}>
          <ActionIcon 
            size="sm" 
            variant="outline" 
            onClick={() => {
              if (item.quantity > 1) {
                dispatch(updateItemQuantity({ 
                  productId: item.productId, 
                  quantity: item.quantity - 1 
                }));
              }
            }}
          >
            <IconMinus size={rem(12)} />
          </ActionIcon>
          <Text mx={5}>{item.quantity}</Text>
          <ActionIcon 
            size="sm" 
            variant="outline"
            onClick={() => {
              if (item.quantity < item.product.stock) {
                dispatch(updateItemQuantity({ 
                  productId: item.productId, 
                  quantity: item.quantity + 1 
                }));
              } else {
                notifications.show({
                  title: 'Insufficient Stock',
                  message: `Only ${item.product.stock} items available in stock`,
                  color: 'yellow',
                });
              }
            }}
          >
            <IconPlus size={rem(12)} />
          </ActionIcon>
        </Group>
      </Table.Td>
      <Table.Td>${item.totalPrice.toFixed(2)}</Table.Td>
      <Table.Td>
        <ActionIcon 
          color="red" 
          variant="subtle" 
          onClick={() => dispatch(removeItem(item.productId))}
        >
          <IconTrash size="1rem" />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box pos="relative">
      <LoadingOverlay visible={isSubmitting} overlayBlur={2} />
      
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Paper p="md" mb="md" withBorder>
          <Title order={4} mb="md">Customer Information</Title>
          <Group grow>
            <TextInput
              label="Customer Name"
              placeholder="Enter customer name"
              required
              {...form.getInputProps('customer')}
            />
            <TextInput
              label="Sales Person"
              placeholder="Enter sales person name"
              required
              {...form.getInputProps('salesPerson')}
            />
          </Group>
          <Textarea
            label="Notes"
            placeholder="Additional notes (optional)"
            mt="md"
            {...form.getInputProps('notes')}
          />
        </Paper>

        <Paper p="md" mb="md" withBorder>
          <Title order={4} mb="md">Products</Title>
          <ProductSearch />
          
          {items.length > 0 ? (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Product</Table.Th>
                  <Table.Th>Price</Table.Th>
                  <Table.Th>Quantity</Table.Th>
                  <Table.Th>Total</Table.Th>
                  <Table.Th></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
              <Table.Tfoot>
                <Table.Tr>
                  <Table.Th colSpan={3} ta="right">
                    <Text fw={700}>Total:</Text>
                  </Table.Th>
                  <Table.Th colSpan={2}>
                    <Text fw={700}>${total.toFixed(2)}</Text>
                  </Table.Th>
                </Table.Tr>
              </Table.Tfoot>
            </Table>
          ) : (
            <Text c="dimmed" ta="center" py="md">
              No products added. Search and add products to the invoice.
            </Text>
          )}
        </Paper>

        <Group justify="flex-end">
          <Button 
            type="submit" 
            leftSection={<IconCheck size="1rem" />}
            loading={isSubmitting}
            disabled={items.length === 0}
          >
            Create Invoice
          </Button>
        </Group>
      </form>
    </Box>
  );
}
