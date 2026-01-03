"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Product } from "@/types/product";
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  searchProducts,
} from "@/lib/firebase/products";

/** small helper to avoid setting state after unmount + avoid stale responses */
function useAliveFlag() {
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  return alive;
}

/**
 * Hook to fetch all products
 */
export function useProducts() {
  const alive = useAliveFlag();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProducts();
      if (!alive.current) return;
      setProducts(data);
    } catch (err) {
      if (!alive.current) return;
      setError("Failed to load products");
      console.error(err);
    } finally {
      if (!alive.current) return;
      setLoading(false);
    }
  }, [alive]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { products, loading, error, refetch };
}

/**
 * Hook to fetch a single product
 */
export function useProduct(productId: string | null) {
  const alive = useAliveFlag();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(!!productId);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!productId) {
      setProduct(null);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getProductById(productId);
      if (!alive.current) return;
      setProduct(data ?? null);
    } catch (err) {
      if (!alive.current) return;
      setError("Failed to load product");
      console.error(err);
    } finally {
      if (!alive.current) return;
      setLoading(false);
    }
  }, [productId, alive]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { product, loading, error, refetch };
}

/**
 * Hook to fetch products by category
 */
export function useProductsByCategory(category: string) {
  const alive = useAliveFlag();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProductsByCategory(category);
      if (!alive.current) return;
      setProducts(data);
    } catch (err) {
      if (!alive.current) return;
      setError("Failed to load products");
      console.error(err);
    } finally {
      if (!alive.current) return;
      setLoading(false);
    }
  }, [category, alive]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { products, loading, error, refetch };
}

/**
 * Hook to fetch featured products
 */
export function useFeaturedProducts(limit: number = 8) {
  const alive = useAliveFlag();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFeaturedProducts(limit);
      if (!alive.current) return;
      setProducts(data);
    } catch (err) {
      if (!alive.current) return;
      setError("Failed to load featured products");
      console.error(err);
    } finally {
      if (!alive.current) return;
      setLoading(false);
    }
  }, [limit, alive]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { products, loading, error, refetch };
}

/**
 * Hook to search products
 */
export function useProductSearch() {
  const alive = useAliveFlag();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (searchTerm: string) => {
      const term = searchTerm.trim();
      if (!term) {
        setProducts([]);
        setError(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await searchProducts(term);
        if (!alive.current) return;
        setProducts(data);
      } catch (err) {
        if (!alive.current) return;
        setError("Search failed");
        console.error(err);
      } finally {
        if (!alive.current) return;
        setLoading(false);
      }
    },
    [alive]
  );

  return { products, loading, error, search };
}
