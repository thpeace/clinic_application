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
        return Promise.reject(error);
    }
);

// ============================================================================
// Response Interceptor - Handle errors globally
// ============================================================================

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - token expired
        if (error.response?.status === 401 && originalRequest) {
            // Clear tokens and redirect to login
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);

            // Redirect to login page
            window.location.href = '/signin';
        }

        // Format error response
        const apiError: ApiError = {
            message: error.response?.data?.message || error.message || 'An error occurred',
            status: error.response?.status || 500,
            errors: error.response?.data?.errors,
        };

        return Promise.reject(apiError);
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
