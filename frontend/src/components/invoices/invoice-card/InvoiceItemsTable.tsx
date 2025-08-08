import { Box, Group, NumberFormatter, Text } from "@mantine/core";
import { Invoice } from "@/types/invoice";

interface InvoiceItemsTableProps {
  invoice: Invoice;
}

export default function InvoiceItemsTable({ invoice }: InvoiceItemsTableProps) {
  return (
    <Box mt="md">
      {/* Header */}
      <Group justify="space-between" mb="xs">
        <Text fw={500} style={{ flex: 1 }}>
          Product
        </Text>
        <Text fw={500} style={{ width: "50px", textAlign: "right" }}>
          Qty
        </Text>
        <Text fw={500} style={{ width: "100px", textAlign: "right" }}>
          Unit Price
        </Text>
        <Text fw={500} style={{ width: "100px", textAlign: "right" }}>
          Total
        </Text>
      </Group>

      {/* Items */}
      {invoice?.items?.map((item) => (
        <Group key={item.id} justify="space-between" mb="xs" wrap="nowrap">
          <Text style={{ flex: 1 }}>{item.product.name}</Text>
          <Text style={{ width: "50px", textAlign: "right" }}>
            {item.quantity}
          </Text>
          <Text style={{ width: "100px", textAlign: "right" }}>
            <NumberFormatter value={item.product.price} prefix="$" thousandSeparator />
          </Text>
          <Text style={{ width: "100px", textAlign: "right" }}>
            <NumberFormatter value={item.totalPrice} prefix="$" thousandSeparator />
          </Text>
        </Group>
      ))}
    </Box>
  );
}
