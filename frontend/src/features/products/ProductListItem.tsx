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
import { Product } from "@/slices/productSlice";

interface ProductListItemProps {
  product: Product;
  disabled: boolean;
  onAddProduct: (product: Product) => void;
}

export function ProductListItem({
  product,
  onAddProduct,
  disabled,
}: ProductListItemProps) {

  const handleAddProduct = () => {
    if (disabled) return;
    onAddProduct(product);
  };

  const handleIconClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onAddProduct(product);
  };

  return (
    <Paper
      p="sm"
      withBorder
      style={{
        cursor: "pointer",
      }}
      onClick={handleAddProduct}
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
            <NumberFormatter
              value={product.price}
              prefix="$"
              thousandSeparator
            />
          </Text>
          <ActionIcon
            disabled={disabled}
            variant="light"
            color="blue"
            size="sm"
            onClick={handleIconClick}
          >
            <IconPlus size={16} />
          </ActionIcon>
        </Group>
      </Group>
    </Paper>
  );
}
