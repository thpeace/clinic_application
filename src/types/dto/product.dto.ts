/**
 * Product DTO - Matches backend response shape
 */

export type ProductStatusDTO = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';

export interface ProductDTO {
    id: number;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    status: ProductStatusDTO;
    category?: string;
    createdAt?: string;
    updatedAt?: string;
}
