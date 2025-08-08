import { Text } from "@mantine/core";
import { Invoice } from "@/types/invoice";

interface InvoiceNotesProps {
  invoice: Invoice;
}

export default function InvoiceNotes({ invoice }: InvoiceNotesProps) {
  if (!invoice.notes) return null;

  return (
    <Text size="sm" c="dimmed" mt="lg">
      <strong>Notes:</strong> {invoice.notes}
    </Text>
  );
}
