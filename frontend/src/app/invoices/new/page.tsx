"use client";
import { Container, Title } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import { InvoiceForm } from "@/features/invoice-creation/InvoiceForm";

export default function NewInvoicePage() {
  return (
    <Provider store={store}>
      <Notifications position="top-right" />
      <Container size="lg" py="xl">
        <Title order={1} mb="md">
          Create New Invoice
        </Title>
        <InvoiceForm />
      </Container>
    </Provider>
  );
}
