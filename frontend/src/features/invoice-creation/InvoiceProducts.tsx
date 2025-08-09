import {
  Table,
  Group,
  ActionIcon,
  Text,
  rem,
  Image,
  Flex,
  Box,
  Divider,
  NumberFormatter,
} from "@mantine/core";
import { IconTrash, IconPlus, IconMinus } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useAppDispatch } from "@/app/hooks";
import {
  removeItem,
  updateItemQuantity,
  InvoiceItem,
} from "@/slices/invoiceSlice";

interface InvoiceProductsProps {
  items: InvoiceItem[];
  total: number;
}

export function InvoiceProducts({ items, total }: InvoiceProductsProps) {
  const dispatch = useAppDispatch();

  const rows = items.map((item) => (
    <Table.Tr key={item.product.id}>
      <Table.Td>
        <Flex gap={16} align="center">
          <Box style={{ width: "72px" }}>
            <Image
              src={item.product.image}
              alt={item.product.name}
              fit="cover"
              radius="sm"
            />
          </Box>
          <Box>
            <Text fw={500}>{item.product.name}</Text>
            <Text size="xs" c="dimmed">
              <NumberFormatter value={item.product.price} prefix="$" thousandSeparator />
            </Text>
          </Box>
        </Flex>
      </Table.Td>
      <Table.Td>
        <Group gap={5} wrap="nowrap">
          <ActionIcon
            size="sm"
            variant="outline"
            onClick={() => {
              if (item.quantity > 1) {
                dispatch(
                  updateItemQuantity({
                    productId: item.product.id,
                    quantity: item.quantity - 1,
                  })
                );
              } else {
                dispatch(removeItem(item.product.id));
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
                dispatch(
                  updateItemQuantity({
                    productId: item.product.id,
                    quantity: item.quantity + 1,
                  })
                );
              } else {
                notifications.show({
                  title: "Insufficient Stock",
                  message: `Only ${item.product.stock} items available in stock`,
                  color: "yellow",
                });
              }
            }}
          >
            <IconPlus size={rem(12)} />
          </ActionIcon>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text fw={500}>
          <NumberFormatter value={item.quantity * item.product.price} prefix="$" thousandSeparator />
        </Text>
      </Table.Td>
      <Table.Td>
        <ActionIcon
          color="red"
          variant="light"
          onClick={() => dispatch(removeItem(item.product.id))}
        >
          <IconTrash size="1rem" />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  if (items.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="md">
        No products added. Search and add products to the invoice.
      </Text>
    );
  }

  return (
    <>
      <Table withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Product</Table.Th>
            <Table.Th>Qty</Table.Th>
            <Table.Th>Total</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Box mt="md" style={{ textAlign: "right" }}>
        <Divider mb="sm" />
        <Text size="lg" fw={700}>
          Total: <NumberFormatter value={total} prefix="$" thousandSeparator />
        </Text>
      </Box>
    </>
  );
}
