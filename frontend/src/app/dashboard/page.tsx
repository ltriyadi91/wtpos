"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Title, Grid, Select, Group } from "@mantine/core";

import { invoicesApi } from "@/lib/api";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart, { RevenueData } from "@/components/dashboard/RevenueChart";

const timeRanges = [
  { value: "day", label: "Daily" },
  { value: "week", label: "Weekly" },
  { value: "month", label: "Monthly" },
];

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("day");

  const { data: revenueData, isLoading } = useQuery<{
    data: RevenueData[];
    status: string;
  }>({ 
    queryKey: ["revenue", timeRange], 
    queryFn: async () => {
      const response = await invoicesApi.getRevenue(timeRange);
      return response.data;
    } 
  });

  const totalRevenue =
    revenueData?.data?.reduce((sum, item) => sum + item.revenue, 0) || 0;
  const totalInvoices = revenueData?.data?.length || 0;
  const averageOrderValue =
    totalInvoices > 0 ? totalRevenue / totalInvoices : 0;

  return (
    <>
      <Group justify="space-between">
        <Title order={1} mb="md">Dashboard</Title>
        <Select
          value={timeRange}
          onChange={(value) => value && setTimeRange(value)}
          data={timeRanges}
          style={{ width: 140 }}
        />
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <StatCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            isLoading={isLoading}
            badgeText="+12% from last period"
            badgeColor="green"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <StatCard
            title="Total Invoices"
            value={`${totalInvoices}`}
            isLoading={isLoading}
            badgeText="+5% from last period"
            badgeColor="blue"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <StatCard
            title="Average Order Value"
            value={`$${averageOrderValue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            isLoading={isLoading}
            badgeText="+3% from last period"
            badgeColor="orange"
          />
        </Grid.Col>
      </Grid>
      <RevenueChart data={revenueData?.data || []} />
    </>
  );
};

export default Dashboard;
