/**
 * Auth - Frontend domain types
 */

/**
 * Login request payload
 */
export interface LoginRequest {
    username: string;
    password: string;
}

/**
 * Signup request payload
 */
export interface SignupRequest {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

/**
 * Authenticated user info
 */
export interface AuthUser {
    id?: number;
    username: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
}

/**
 * Frontend auth response after login/signup
 */
export interface AuthResponse {
    token: string;
    refreshToken?: string;
    user: AuthUser;
}
