import { Group, Stack, Text, NumberFormatter } from "@mantine/core";
import { Invoice } from "@/types/invoice";

interface InvoiceCardHeaderProps {
  invoice: Invoice;
}

export default function InvoiceCardHeader({ invoice }: InvoiceCardHeaderProps) {
  return (
    <Group justify="space-between">
      <Stack gap={0}>
        <Text fw={500}>{invoice.customer}</Text>
        <Text size="sm" c="dimmed">
          {invoice?.invoiceNumber} &bull; Sales: {invoice?.salesPerson}
        </Text>
      </Stack>
      <Stack gap={0} align="flex-end">
        <Text fw={700} size="lg">
          <NumberFormatter value={invoice?.totalAmount} prefix="$" thousandSeparator />
        </Text>
        <Text size="sm" c="dimmed">
          {new Date(invoice?.createdAt).toLocaleDateString()}
        </Text>
      </Stack>
    </Group>
  );
}
