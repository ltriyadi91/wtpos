import { useState } from "react";
import { useForm } from "@mantine/form";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/app/hooks";
import {
  Button,
  Paper,
  Title,
  Group,
  LoadingOverlay,
  Box,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import {
  createInvoice,
  InvoiceData,
  selectInvoiceItems,
  selectInvoiceTotal,
} from "./invoiceSlice";
import { ProductSearch } from "../products/ProductSearch";
import { CustomerForm } from "../../components/invoices/CustomerForm";
import { InvoiceItemsTable } from "../../components/invoices/InvoiceItemsTable";

export function InvoiceForm() {
  const dispatch = useAppDispatch();
  const items = useSelector(selectInvoiceItems);
  const total = useSelector(selectInvoiceTotal);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    initialValues: {
      customer: "",
      salesPerson: "",
      notes: "",
      paymentType: "CASH",
    },
    validate: {
      customer: (value) =>
        value.trim().length < 2 ? "Customer name is required" : null,
      salesPerson: (value) =>
        value.trim().length < 2 ? "Sales person name is required" : null,
      paymentType: (value) => (value ? null : "Payment type is required"),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (items.length === 0) {
      notifications.show({
        title: "Error",
        message: "Please add at least one product to the invoice",
        color: "red",
        icon: <IconX size="1.1rem" />,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const invoiceData: InvoiceData = {
        customer: values.customer,
        salesPerson: values.salesPerson,
        paymentType: values.paymentType,
        notes: values.notes,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.product.price,
          totalPrice: item.quantity * item.product.price,
          product: item.product,
        })),
      };

      await dispatch(createInvoice(invoiceData)).unwrap();

      notifications.show({
        title: "Success",
        message: "Invoice created successfully",
        color: "green",
        icon: <IconCheck size="1.1rem" />,
      });

      form.reset();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to create invoice. Please try again.",
        color: "red",
        icon: <IconX size="1.1rem" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box pos="relative">
      <LoadingOverlay visible={isSubmitting} overlayProps={{ blur: 2 }} />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <CustomerForm form={form} />

        <Paper p="md" mb="md" withBorder>
          <Title order={4} mb="md">
            Products
          </Title>
          <Box mb="md">
            <ProductSearch />
          </Box>

          <InvoiceItemsTable items={items} total={total} />
        </Paper>

        <Group justify="flex-end">
          <Button
            type="submit"
            size="lg"
            leftSection={<IconCheck size="1.2rem" />}
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
