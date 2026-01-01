/**
 * Auth API - Pure API calls for authentication
 */
import apiClient, { setAuthToken, removeAuthToken, STORAGE_KEYS } from './client';
import type { LoginResponseDTO } from '../types/dto/auth.dto';
import type { LoginRequest, SignupRequest, AuthResponse, AuthUser } from '../types/auth';
import { mapLoginResponseToAuth } from '../mappers/authMapper';

// ============================================================================
// Auth API Functions
// ============================================================================

/**
 * Login with username and password
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<LoginResponseDTO>('/auth/login', credentials);
    const authResponse = mapLoginResponseToAuth(response.data);

    // Store token and user data
    if (authResponse.token) {
        setAuthToken(authResponse.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authResponse.user));
    }

    return authResponse;
}

/**
 * Register a new user
 */
export async function signup(userData: SignupRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/signup', userData);

    // Auto login after signup
    if (response.data.token) {
        setAuthToken(response.data.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    }

    return response.data;
}

/**
 * Logout - clear tokens and user data
 */
export function logout(): void {
    removeAuthToken();
    window.location.href = '/signin';
}

/**
 * Get current logged in user from storage
 */
export function getStoredUser(): AuthUser | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (userStr) {
        try {
            return JSON.parse(userStr) as AuthUser;
        } catch {
            return null;
        }
    }
    return null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
}

/**
 * Get the current auth token
 */
export function getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

// ============================================================================
// Default Export
// ============================================================================

const authApi = {
    login,
    signup,
    logout,
    getStoredUser,
    isAuthenticated,
    getToken,
};

export default authApi;
