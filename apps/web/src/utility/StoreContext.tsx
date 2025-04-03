'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Store,
  Category,
  Product,
  cheapProducts,
  StoreContextType,
} from '../types/types';

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStoreContext = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStoreContext must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [nearestStore, setNearestStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cheapProducts, setCheapProducts] = useState<cheapProducts[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (nearestStore?.id) {
      setLoading(true);
      setError(null);

      const fetchProducts = fetch(
        `http://localhost:8000/api/v1/products-store/${nearestStore.id}`,
      ).then((res) => res.json());

      const fetchCategories = fetch(
        `http://localhost:8000/api/v1/all-categories`,
      ).then((res) => res.json());

      const fetchCheapProducts = fetch(
        `http://localhost:8000/api/v1/cheap-products-store/${nearestStore.id}`,
      ).then((res) => res.json());

      Promise.all([fetchProducts, fetchCategories, fetchCheapProducts])
        .then(([productData, categoryData, cheapProductsData]) => {
          setProducts(productData.data);
          setCategories(categoryData.data);
          setCheapProducts(cheapProductsData.data);
        })
        .catch((error) => {
          console.error('Fetch error:', error);
          setError(`Failed to fetch data: ${error.message}`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [nearestStore]);

  return (
    <StoreContext.Provider
      value={{
        nearestStore,
        setNearestStore,
        cheapProducts,
        products,
        categories,
        loading,
        error,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
