import apiClient from './client';

// ============================================================================
// Types
// ============================================================================

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';

export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    status: ProductStatus;
    category?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateProductRequest {
    name: string;
    description?: string;
    price: number;
    quantity: number;
    status?: ProductStatus;
    category?: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
    id: number;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

// ============================================================================
// Product Service
// ============================================================================

const productService = {
    /**
     * Get all products with pagination
     */
    async getAll(page = 0, size = 10): Promise<PaginatedResponse<Product>> {
        const response = await apiClient.get<PaginatedResponse<Product>>('/products', {
            params: { page, size },
        });
        return response.data;
    },

    /**
     * Get a single product by ID
     */
    async getById(id: number): Promise<Product> {
        const response = await apiClient.get<Product>(`/products/${id}`);
        return response.data;
    },

    /**
     * Create a new product
     */
    async create(product: CreateProductRequest): Promise<Product> {
        const response = await apiClient.post<Product>('/products', product);
        return response.data;
    },

    /**
     * Update an existing product
     */
    async update(id: number, product: Partial<CreateProductRequest>): Promise<Product> {
        const response = await apiClient.put<Product>(`/products/${id}`, product);
        return response.data;
    },

    /**
     * Delete a product
     */
    async delete(id: number): Promise<void> {
        await apiClient.delete(`/products/${id}`);
    },

    /**
     * Search products by name or category
     */
    async search(query: string, page = 0, size = 10): Promise<PaginatedResponse<Product>> {
        const response = await apiClient.get<PaginatedResponse<Product>>('/products/search', {
            params: { query, page, size },
        });
        return response.data;
    },

    /**
     * Get products by status
     */
    async getByStatus(status: ProductStatus, page = 0, size = 10): Promise<PaginatedResponse<Product>> {
        const response = await apiClient.get<PaginatedResponse<Product>>('/products/status', {
            params: { status, page, size },
        });
        return response.data;
    },
};

export default productService;
