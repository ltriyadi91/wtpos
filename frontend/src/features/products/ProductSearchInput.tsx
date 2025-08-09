import { forwardRef } from 'react';
import { TextInput, Loader } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

interface ProductSearchInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  status: "idle" | "loading" | "succeeded" | "failed";
}

export const ProductSearchInput = forwardRef<HTMLInputElement, ProductSearchInputProps>(({ value, onChange, onFocus, onBlur, status }, ref) => {
  return (
    <TextInput
      ref={ref}
      placeholder="Search products..."
      value={value}
      onChange={onChange}
      rightSection={
        status === "loading" ? (
          <Loader size="1rem" />
        ) : (
          <IconSearch size="1rem" />
        )
      }
      onFocus={onFocus}
      onBlur={onBlur}
      mb="md"
    />
  )
});

ProductSearchInput.displayName = 'ProductSearchInput';
