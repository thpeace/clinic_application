/**
 * Common types shared across all modules
 */

/**
 * Generic paginated response from backend
 */
export interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

/**
 * Generic API error response
 */
export interface ApiError {
    message: string;
    status: number;
    timestamp?: string;
}
