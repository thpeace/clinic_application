import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// ============================================================================
// Types
// ============================================================================

export interface ApiError {
    message: string;
    status: number;
    errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

// ============================================================================
// Configuration
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const STORAGE_KEYS = {
    TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
} as const;

// Status codes that trigger auto-logout
const LOGOUT_STATUS_CODES = new Set([
    401, // Unauthorized
    403, // Forbidden
]);

// ============================================================================
// Axios Instance
// ============================================================================

const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ============================================================================
// Request Interceptor - Add auth token to requests
// ============================================================================

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        throw error;
    }
);

// ============================================================================
// Response Interceptor - Handle errors globally
// ============================================================================

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config;

        // Handle 401 (Unauthorized), 403 (Forbidden), or Network Error (status 0/undefined)
        const isAuthRequest = originalRequest?.url?.includes('/auth/');
        const status = error.response?.status;

        // Check if we should logout:
        // 1. It's not a login/signup request (auth)
        // 2. Status is 401 (Unauthorized) or 403 (Forbidden)
        // Note: We don't logout on network errors (!status) as that would cause
        // unintended logouts when the backend is down or endpoints fail
        const shouldLogout =
            originalRequest &&
            !isAuthRequest &&
            status !== undefined &&
            LOGOUT_STATUS_CODES.has(status);

        if (shouldLogout) {
            // Clear tokens
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);

            // Dispatch logout event for AuthContext to handle
            window.dispatchEvent(new Event('auth:logout'));
        }

        // Format error response
        const apiError: ApiError = {
            message: error.response?.data?.message || error.message || 'An error occurred',
            status: error.response?.status || 500,
            errors: error.response?.data?.errors,
        };

        throw apiError;
    }
);

// ============================================================================
// Auth Token Helpers
// ============================================================================

export const setAuthToken = (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

export const getAuthToken = (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

export const removeAuthToken = (): void => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
};

export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};

// ============================================================================
// Export
// ============================================================================

export default apiClient;
export { STORAGE_KEYS };
