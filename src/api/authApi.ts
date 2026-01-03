import { jwtDecode } from "jwt-decode";
import apiClient, { setAuthToken, removeAuthToken, STORAGE_KEYS } from './client';
import type { LoginResponseDTO } from '../types/dto/auth.dto';
import type { LoginRequest, SignupRequest, AuthResponse, AuthUser } from '../types/auth';
import { mapLoginResponseToAuth } from '../mappers/authMapper';

// ============================================================================
// Types
// ============================================================================

interface JwtPayload {
    sub: string;
    role?: string;
    exp: number;
    iat: number;
}

// ============================================================================
// Auth API Functions
// ============================================================================

/**
 * Helper to get user from token
 */
function getUserFromToken(token: string): AuthUser | null {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        return {
            username: decoded.sub,
            role: decoded.role
        };
    } catch (error) {
        return null;
    }
}

/**
 * Login with username and password
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<LoginResponseDTO>('/auth/login', credentials);
    const authResponse = mapLoginResponseToAuth(response.data);

    // Store token only
    if (authResponse.token) {
        setAuthToken(authResponse.token);

        // Return user with role from token
        const tokenUser = getUserFromToken(authResponse.token);
        const finalUser = tokenUser ? { ...authResponse.user, ...tokenUser } : authResponse.user;
        authResponse.user = finalUser;

        // Remove old user data if exists
        localStorage.removeItem(STORAGE_KEYS.USER);
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

        // Return user with role from token
        const tokenUser = getUserFromToken(response.data.token);
        const finalUser = tokenUser ? { ...response.data.user, ...tokenUser } : response.data.user;
        response.data.user = finalUser;

        // Remove old user data if exists
        localStorage.removeItem(STORAGE_KEYS.USER);
    }

    return response.data;
}

/**
 * Logout - clear tokens and user data
 */
export function logout(): void {
    removeAuthToken();
    localStorage.removeItem(STORAGE_KEYS.USER); // Ensure cleanup
    window.location.href = '/signin';
}

/**
 * Get current logged in user from storage
 * REFACTORED: Validates against token ONLY
 */
export function getStoredUser(): AuthUser | null {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) return null;

    // Decode token to get current user info
    return getUserFromToken(token);
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
