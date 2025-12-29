import apiClient, { setAuthToken, removeAuthToken, STORAGE_KEYS } from './client';

// ============================================================================
// Types
// ============================================================================

export interface LoginRequest {
    username: string;
    password: string;
}

export interface SignupRequest {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

export interface AuthResponse {
    token: string;
    refreshToken?: string;
    user: User;
}

export interface User {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
}

// ============================================================================
// Auth Service
// ============================================================================

const authService = {
    /**
     * Login with username and password
     */
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

        // Store token and user data
        if (response.data.token) {
            setAuthToken(response.data.token);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
        }

        return response.data;
    },

    /**
     * Register a new user
     */
    async signup(userData: SignupRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/signup', userData);

        // Auto login after signup
        if (response.data.token) {
            setAuthToken(response.data.token);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
        }

        return response.data;
    },

    /**
     * Logout - clear tokens and user data
     */
    logout(): void {
        removeAuthToken();
        window.location.href = '/signin';
    },

    /**
     * Get current logged in user from storage
     */
    getCurrentUser(): User | null {
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        if (userStr) {
            try {
                return JSON.parse(userStr) as User;
            } catch {
                return null;
            }
        }
        return null;
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
    },

    /**
     * Get the current auth token
     */
    getToken(): string | null {
        return localStorage.getItem(STORAGE_KEYS.TOKEN);
    },
};

export default authService;
