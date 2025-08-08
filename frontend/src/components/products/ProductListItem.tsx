import {
  Paper,
  Group,
  Flex,
  Box,
  Image,
  Text,
  ActionIcon,
  NumberFormatter,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { Product } from "@/features/products/productSlice";

interface ProductListItemProps {
  product: Product;
  onAddProduct: (product: Product) => void;
}

export function ProductListItem({
  product,
  onAddProduct,
}: ProductListItemProps) {
  return (
    <Paper
      p="sm"
      withBorder
      style={{
        cursor: "pointer",
      }}
      onClick={() => onAddProduct(product)}
    >
      <Group justify="space-between" wrap="nowrap">
        <Flex gap="sm" align="center">
          <Box style={{ width: "64px" }}>
            <Image
              src={product.image}
              alt={product.name}
              fit="cover"
              radius="sm"
            />
          </Box>

          <Box>
            <Text size="sm" fw={500}>
              {product.name}
            </Text>
            <Text size="xs" c="dimmed">
              Stock: {product.stock}
            </Text>
          </Box>
        </Flex>
        <Group gap="xs" wrap="nowrap">
          <Text fw={700}>
            <NumberFormatter value={product.price} prefix="$" thousandSeparator />
          </Text>
          <ActionIcon
            variant="light"
            color="blue"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddProduct(product);
            }}
          >
            <IconPlus size={16} />
          </ActionIcon>
        </Group>
      </Group>
    </Paper>
  );
}
