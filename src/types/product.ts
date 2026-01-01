/**
 * Product - Frontend domain model
 */

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';

export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    status: ProductStatus;
    category?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Request payload for creating a product
 */
export interface CreateProductRequest {
    name: string;
    description?: string;
    price: number;
    quantity: number;
    status?: ProductStatus;
    category?: string;
}

/**
 * Request payload for updating a product
 */
export interface UpdateProductRequest extends Partial<CreateProductRequest> {
    id: number;
}
