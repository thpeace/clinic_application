/**
 * Auth DTOs - Matching backend response shapes
 */

/**
 * Backend login response structure
 */
export interface LoginResponseDTO {
    username: string;
    token: string;
    type?: string;
    expiresIn?: number;
    role?: string;
}

/**
 * Backend signup response structure
 */
export interface SignupResponseDTO {
    token: string;
    refreshToken?: string;
    user: {
        id?: number;
        username: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        role?: string;
    };
}
