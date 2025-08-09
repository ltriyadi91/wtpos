"use client";

import { Button, Center, Skeleton, Stack, Text } from "@mantine/core";
import InvoiceCard from "./InvoiceCard";
import { Invoice } from "@/types/invoice";

interface InvoiceListProps {
  invoices: Invoice[];
  status: string;
  error: Error | null;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export default function InvoiceList({
  invoices,
  status,
  error,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: InvoiceListProps) {
  if (status === 'pending') {
    return (
      <Stack gap="md">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} height={100} radius="md" />
        ))}
      </Stack>
    );
  }

  if (status === "error") {
    return <Text c="red">Error: {error?.message}</Text>;
  }

  if (invoices.length === 0) {
    return (
      <Center py="xl">
        <Text>No invoices found.</Text>
      </Center>
    );
  }

  return (
    <Stack gap="md">
      {invoices.map((invoice) => (
        <InvoiceCard key={invoice.id} invoice={invoice} />
      ))}

      {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()}
          loading={isFetchingNextPage}
          fullWidth
          variant="outline"
          mt="md"
        >
          {isFetchingNextPage ? "Loading more..." : "Load More"}
        </Button>
      )}
    </Stack>
  );
}
