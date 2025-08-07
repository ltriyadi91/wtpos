import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/app/hooks';
import { useDebouncedValue } from '@mantine/hooks';
import { TextInput, Loader, Box, Group, Text, Image, rem } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { searchProducts, selectAllProducts, selectProductStatus } from './productSlice';
import { addItem } from '../invoice/invoiceSlice';

export function ProductSearch() {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
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
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setOpened(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleProductSelect = (product: any) => {
    dispatch(addItem({ product, quantity: 1 }));
    setSearch('');
    setOpened(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  return (
    <Box style={{ position: 'relative' }} ref={searchRef}>
      <TextInput
        ref={inputRef}
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        onFocus={() => search.length >= 2 && setOpened(true)}
        rightSection={status === 'loading' ? <Loader size="1rem" /> : <IconSearch size="1rem" />}
        mb="md"
      />
      
      {opened && products.length > 0 && (
        <Box
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            zIndex: 1000,
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          {products.map((product) => (
            <Group
              key={product.id}
              p="sm"
              style={{
                borderBottom: '1px solid #f1f3f5',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#f8f9fa',
                },
              }}
              onClick={() => handleProductSelect(product)}
            >
              <Image
                src={product.image || '/placeholder-product.png'}
                alt={product.name}
                width={40}
                height={40}
                fit="contain"
                radius="sm"
              />
              <div style={{ flex: 1 }}>
                <Text size="sm" fw={500} lineClamp={1}>
                  {product.name}
                </Text>
                <Text size="xs" c="dimmed">
                  Stock: {product.stock}
                </Text>
              </div>
              <Text fw={700}>
                ${product.price.toFixed(2)}
              </Text>
            </Group>
          ))}
        </Box>
      )}
    </Box>
  );
}
