"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Button,
  Group,
  Title,
  Container,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import api from "@/lib/api";
import InvoiceList from "@/features/invoice-list/InvoiceList";
import { Invoice } from "@/types/invoice";

interface ApiResponse {
  status: string;
  data: Invoice[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

const fetchInvoices = async ({ pageParam = 1 }): Promise<ApiResponse> => {
  const response = await api.get(`/invoices?page=${pageParam}&limit=10`);
  return response.data;
};

export default function InvoicesPage() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,

    isFetchingNextPage,
    status,
  } = useInfiniteQuery<ApiResponse, Error>({
    queryKey: ["invoices"],
    queryFn: ({ pageParam }) => fetchInvoices({ pageParam: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.pagination.hasNextPage ? allPages.length + 1 : undefined;
    },
  });

  const invoices = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1}>Invoices</Title>
        <Button
          component={Link}
          href="/invoices/new"
          leftSection={<IconPlus size={16} />}
        >
          New Invoice
        </Button>
      </Group>

      <InvoiceList
        invoices={invoices}
        status={status}
        error={error}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </Container>
  );
}
