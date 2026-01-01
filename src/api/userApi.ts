/**
 * User API - Pure API calls for user-related endpoints
 */
import apiClient from './client';
import type { UserDetailDTO } from '../types/dto/user.dto';
import type { User } from '../types/user';
import { mapUserDetailDTOToUser } from '../mappers/userMapper';

// ============================================================================
// API Endpoints
// ============================================================================

const USER_ENDPOINTS = {
    ME: '/users/me',
    BY_ID: (id: number) => `/users/${id}`,
} as const;

// ============================================================================
// User API Functions
// ============================================================================

/**
 * Get current logged-in user's details
 * Maps to: GET /api/users/me
 */
export async function getCurrentUser(): Promise<User> {
    const response = await apiClient.get<UserDetailDTO>(USER_ENDPOINTS.ME);
    return mapUserDetailDTOToUser(response.data);
}

/**
 * Get user details by ID
 * Maps to: GET /api/users/{id}
 */
export async function getUserById(id: number): Promise<User> {
    const response = await apiClient.get<UserDetailDTO>(USER_ENDPOINTS.BY_ID(id));
    return mapUserDetailDTOToUser(response.data);
}

// ============================================================================
// Default Export
// ============================================================================

const userApi = {
    getCurrentUser,
    getUserById,
};

export default userApi;
