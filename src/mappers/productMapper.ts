/**
 * Product Mapper - Converts ProductDTO to Product domain model
 */
import type { ProductDTO } from '../types/dto/product.dto';
import type { Product } from '../types/product';

/**
 * Maps ProductDTO from API to Product domain model
 */
export function mapProductDTOToProduct(dto: ProductDTO): Product {
    return {
        id: dto.id,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        quantity: dto.quantity,
        status: dto.status,
        category: dto.category,
        createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
        updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    };
}

/**
 * Maps array of ProductDTOs
 */
export function mapProductDTOsToProducts(dtos: ProductDTO[]): Product[] {
    return dtos.map(mapProductDTOToProduct);
}
