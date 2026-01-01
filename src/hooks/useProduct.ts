/**
 * useProduct - Custom hook for product CRUD operations
 */
import { useState, useCallback } from 'react';
import type { Product, CreateProductRequest, ProductStatus } from '../types/product';
import type { PaginatedResponse } from '../types/common';
import productApi from '../api/productApi';

interface UseProductListState {
    products: Product[];
    pagination: Omit<PaginatedResponse<Product>, 'content'> | null;
    isLoading: boolean;
    error: string | null;
}

interface UseProductListReturn extends UseProductListState {
    fetchProducts: (page?: number, size?: number) => Promise<void>;
    searchProducts: (query: string, page?: number, size?: number) => Promise<void>;
    fetchByStatus: (status: ProductStatus, page?: number, size?: number) => Promise<void>;
    createProduct: (data: CreateProductRequest) => Promise<Product>;
    updateProduct: (id: number, data: Partial<CreateProductRequest>) => Promise<Product>;
    deleteProduct: (id: number) => Promise<void>;
}

/**
 * Hook for product list operations
 */
export function useProductList(): UseProductListReturn {
    const [state, setState] = useState<UseProductListState>({
        products: [],
        pagination: null,
        isLoading: false,
        error: null,
    });

    const fetchProducts = useCallback(async (page = 0, size = 10) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await productApi.getAll(page, size);
            const { content, ...pagination } = response;
            setState({ products: content, pagination, isLoading: false, error: null });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
            setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
        }
    }, []);

    const searchProducts = useCallback(async (query: string, page = 0, size = 10) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await productApi.search(query, page, size);
            const { content, ...pagination } = response;
            setState({ products: content, pagination, isLoading: false, error: null });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to search products';
            setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
        }
    }, []);

    const fetchByStatus = useCallback(async (status: ProductStatus, page = 0, size = 10) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await productApi.getByStatus(status, page, size);
            const { content, ...pagination } = response;
            setState({ products: content, pagination, isLoading: false, error: null });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products by status';
            setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
        }
    }, []);

    const createProduct = useCallback(async (data: CreateProductRequest): Promise<Product> => {
        const product = await productApi.create(data);
        setState(prev => ({ ...prev, products: [product, ...prev.products] }));
        return product;
    }, []);

    const updateProduct = useCallback(async (id: number, data: Partial<CreateProductRequest>): Promise<Product> => {
        const updated = await productApi.update(id, data);
        setState(prev => ({
            ...prev,
            products: prev.products.map(p => p.id === id ? updated : p),
        }));
        return updated;
    }, []);

    const deleteProduct = useCallback(async (id: number): Promise<void> => {
        await productApi.remove(id);
        setState(prev => ({
            ...prev,
            products: prev.products.filter(p => p.id !== id),
        }));
    }, []);

    return {
        ...state,
        fetchProducts,
        searchProducts,
        fetchByStatus,
        createProduct,
        updateProduct,
        deleteProduct,
    };
}

export default useProductList;
