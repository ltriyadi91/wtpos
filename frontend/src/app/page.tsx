'use client';

import { MantineProvider, Container, Title, Text } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { InvoiceForm } from '@/features/invoice/InvoiceForm';

export default function Home() {
  return (
    <Provider store={store}>
      <MantineProvider>
        <Notifications position="top-right" />
        <Container size="lg" py="xl">
          <Title order={1} mb="md">Point of Sale</Title>
          <Text c="dimmed" mb="xl">Create a new invoice</Text>
          <InvoiceForm />
        </Container>
      </MantineProvider>
    </Provider>
  );
}
