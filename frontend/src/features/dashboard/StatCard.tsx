import React from "react";
import { Card, Text, Title, Skeleton, Badge } from "@mantine/core";

interface StatCardProps {
  title: string;
  value: string;
  isLoading: boolean;
  badgeText: string;
  badgeColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  isLoading, 
  badgeText, 
  badgeColor 
}) => {
  return (
    <Card withBorder shadow="sm" radius="md">
      <Text size="sm" c="dimmed">
        {title}
      </Text>
      <Skeleton visible={isLoading}>
        <Title order={2} mt={4}>
          {value}
        </Title>
      </Skeleton>
      <Badge color={badgeColor} variant="light" mt="sm">
        {badgeText}
      </Badge>
    </Card>
  );
};

export default StatCard;
