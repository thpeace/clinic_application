/**
 * Product API - Pure API calls for product-related endpoints
 */
import apiClient from './client';
import type { ProductDTO, ProductStatusDTO } from '../types/dto/product.dto';
import type { Product, CreateProductRequest, ProductStatus } from '../types/product';
import type { PaginatedResponse } from '../types/common';
import { mapProductDTOToProduct, mapProductDTOsToProducts } from '../mappers/productMapper';

// ============================================================================
// Product API Functions
// ============================================================================

/**
 * Get all products with pagination
 */
export async function getAll(page = 0, size = 10): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get<PaginatedResponse<ProductDTO>>('/products', {
        params: { page, size },
    });

    return {
        ...response.data,
        content: mapProductDTOsToProducts(response.data.content),
    };
}

/**
 * Get a single product by ID
 */
export async function getById(id: number): Promise<Product> {
    const response = await apiClient.get<ProductDTO>(`/products/${id}`);
    return mapProductDTOToProduct(response.data);
}

/**
 * Create a new product
 */
export async function create(product: CreateProductRequest): Promise<Product> {
    const response = await apiClient.post<ProductDTO>('/products', product);
    return mapProductDTOToProduct(response.data);
}

/**
 * Update an existing product
 */
export async function update(id: number, product: Partial<CreateProductRequest>): Promise<Product> {
    const response = await apiClient.put<ProductDTO>(`/products/${id}`, product);
    return mapProductDTOToProduct(response.data);
}

/**
 * Delete a product
 */
export async function remove(id: number): Promise<void> {
    await apiClient.delete(`/products/${id}`);
}

/**
 * Search products by name or category
 */
export async function search(query: string, page = 0, size = 10): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get<PaginatedResponse<ProductDTO>>('/products/search', {
        params: { query, page, size },
    });

    return {
        ...response.data,
        content: mapProductDTOsToProducts(response.data.content),
    };
}

/**
 * Get products by status
 */
export async function getByStatus(status: ProductStatus, page = 0, size = 10): Promise<PaginatedResponse<Product>> {
    const response = await apiClient.get<PaginatedResponse<ProductDTO>>('/products/status', {
        params: { status, page, size },
    });

    return {
        ...response.data,
        content: mapProductDTOsToProducts(response.data.content),
    };
}

// ============================================================================
// Default Export
// ============================================================================

const productApi = {
    getAll,
    getById,
    create,
    update,
    remove,
    search,
    getByStatus,
};

export default productApi;
