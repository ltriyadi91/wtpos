import {
  Paper,
  Title,
  Group,
  TextInput,
  Select,
  Textarea,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

interface CustomerFormProps {
  form: UseFormReturnType<{
    customer: string;
    salesPerson: string;
    notes: string;
    paymentType: string;
  }>;
}

export function CustomerForm({ form }: CustomerFormProps) {
  return (
    <Paper p="md" mb="md" withBorder>
      <Title order={4} mb="md">
        Customer Information
      </Title>
      <Group grow>
        <TextInput
          label="Customer Name"
          placeholder="Enter customer name"
          required
          {...form.getInputProps("customer")}
        />
        <TextInput
          label="Sales Person"
          placeholder="Enter sales person name"
          required
          {...form.getInputProps("salesPerson")}
        />
      </Group>
      <Select
        label="Payment Type"
        placeholder="Select payment type"
        data={[
          { value: "CASH", label: "Cash" },
          { value: "CREDIT_CARD", label: "Credit Card" },
          { value: "NOTCASHORCREDIT", label: "Not Cash Or Credit Card" },
        ]}
        required
        mt="md"
        {...form.getInputProps("paymentType")}
      />
      <Textarea
        label="Notes"
        placeholder="Additional notes (optional)"
        mt="md"
        {...form.getInputProps("notes")}
      />
    </Paper>
  );
}
