import { ScrollArea, Stack, Text, Paper } from "@mantine/core";
import { ProductListItem } from "./ProductListItem";
import { Product } from "@/features/products/productSlice";

interface ProductListProps {
  products: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  onAddProduct: (product: Product) => void;
}

export function ProductList({ products, status, onAddProduct }: ProductListProps) {
  return (
    <Paper
      shadow="md"
      p="md"
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        zIndex: 1000,
        maxHeight: 400,
        overflow: "hidden",
      }}
    >
      {products.length > 0 ? (
        <ScrollArea.Autosize mah={350}>
          <Stack gap="xs">
            {products.map((product) => (
              <ProductListItem
                disabled={product.stock < 1}
                key={product.id}
                product={product}
                onAddProduct={onAddProduct}
              />
            ))}
          </Stack>
        </ScrollArea.Autosize>
      ) : (
        <Text c="dimmed" ta="center" py="md">
          {status === "loading" ? "Searching..." : "No products found"}
        </Text>
      )}
    </Paper>
  );
}
