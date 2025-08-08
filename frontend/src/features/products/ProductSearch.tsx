import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/app/hooks";
import { useDebouncedValue } from "@mantine/hooks";
import { Box } from "@mantine/core";
import {
  searchProducts,
  selectAllProducts,
  selectProductStatus,
  Product,
} from "./productSlice";
import { addItem } from "../invoice/invoiceSlice";
import { ProductSearchInput } from "../../components/products/ProductSearchInput";
import { ProductList } from "../../components/products/ProductList";

export function ProductSearch() {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const [opened, setOpened] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductStatus);

  const [debouncedSearch] = useDebouncedValue(search, 300);

  useEffect(() => {
    if (debouncedSearch.length >= 2) {
      dispatch(searchProducts(debouncedSearch));
      setOpened(true);
    } else {
      setOpened(false);
    }
  }, [debouncedSearch, dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setOpened(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddProduct = (product: Product) => {
    dispatch(
      addItem({
        product,
        quantity: 1,
      })
    );
    setSearch("");
    setOpened(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Box pos="relative" ref={searchRef}>
      <ProductSearchInput
        ref={inputRef}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        status={status}
        onFocus={() => search.length >= 2 && setOpened(true)}
        onBlur={() => setTimeout(() => setOpened(false), 200)}
      />

      {opened && (
        <ProductList
          products={products}
          status={status}
          onAddProduct={handleAddProduct}
        />
      )}
    </Box>
  );
}
