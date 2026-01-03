import type React from "react";
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import authApi from "../api/authApi";
import userApi from "../api/userApi";
import type { AuthUser, LoginRequest, SignupRequest, AuthResponse } from "../types/auth";
import { ApiError } from "../api/client";

// ============================================================================
// Types
// ============================================================================

export enum AuthErrorCode {
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    NETWORK_ERROR = 'NETWORK_ERROR',
    ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
    FORBIDDEN = 'FORBIDDEN',
    SESSION_EXPIRED = 'SESSION_EXPIRED',
    SERVER_ERROR = 'SERVER_ERROR',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AuthError {
    code: AuthErrorCode | string;
    message: string;
    status?: number;
}

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: AuthError | null;
    login: (credentials: LoginRequest) => Promise<AuthResponse>;
    signup: (userData: SignupRequest) => Promise<AuthResponse>;
    logout: () => void;
    clearError: () => void;
}

// ============================================================================
// Context
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// Provider
// ============================================================================

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<AuthError | null>(null);

    // Check for existing auth on mount and set up event listener
    useEffect(() => {
        const initAuth = async () => {
            try {
                // Get basic info from token
                const tokenUser = authApi.getStoredUser();
                if (tokenUser && authApi.isAuthenticated()) {
                    setUser(tokenUser);

                    // Fetch full profile from API
                    try {
                        const fullUser = await userApi.getCurrentUser();
                        // Merge token info (role) with backend profile
                        // Handle role type mismatch (UserRole | null vs string | undefined)
                        const role = fullUser.role || undefined;

                        setUser(prev => ({
                            ...prev!,
                            ...fullUser,
                            role: role
                        }));
                    } catch (err) {
                        console.error("Failed to fetch user profile", err);
                    }
                }
            } catch {
                // Invalid stored data, clear it
                authApi.logout();
            } finally {
                setIsLoading(false);
            }
        };

        const handleLogoutEvent = () => {
            setUser(null);
            setError(null);
            authApi.logout();
        };

        initAuth();
        window.addEventListener('auth:logout', handleLogoutEvent);

        return () => {
            window.removeEventListener('auth:logout', handleLogoutEvent);
        };
    }, []);

    const login = useCallback(async (credentials: LoginRequest): Promise<AuthResponse> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await authApi.login(credentials);
            setUser(response.user);

            // Fetch full profile immediately
            try {
                const fullUser = await userApi.getCurrentUser();
                const role = fullUser.role || undefined;
                const mergedUser = { ...response.user, ...fullUser, role };

                setUser(mergedUser);
                response.user = mergedUser;
            } catch (err) {
                console.error("Failed to fetch user profile after login", err);
            }

            return response;
        } catch (err) {
            const apiError = err as ApiError;

            // Map HTTP status to error codes
            console.log("apiError", apiError);
            let errorCode: AuthErrorCode;
            switch (apiError.status) {
                case 401:
                case 403:
                    errorCode = AuthErrorCode.INVALID_CREDENTIALS;
                    break;
                case 423:
                    errorCode = AuthErrorCode.ACCOUNT_LOCKED;
                    break;
                case 422:
                    errorCode = AuthErrorCode.VALIDATION_ERROR;
                    break;
                case 500:
                case 502:
                case 503:
                    errorCode = AuthErrorCode.SERVER_ERROR;
                    break;
                case 0:
                    errorCode = AuthErrorCode.NETWORK_ERROR;
                    break;
                default:
                    errorCode = AuthErrorCode.UNKNOWN_ERROR;
            }

            setError({
                code: errorCode,
                message: apiError.message || "Login failed",
                status: apiError.status,
            });
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const signup = useCallback(async (userData: SignupRequest): Promise<AuthResponse> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await authApi.signup(userData);
            setUser(response.user);

            // Fetch full profile immediately
            try {
                const fullUser = await userApi.getCurrentUser();
                const role = fullUser.role || undefined;
                const mergedUser = { ...response.user, ...fullUser, role };

                setUser(mergedUser);
                response.user = mergedUser;
            } catch (err) {
                console.error("Failed to fetch user profile after signup", err);
            }

            return response;
        } catch (err) {
            const apiError = err as ApiError;

            // Map HTTP status to error codes
            let errorCode: AuthErrorCode;
            switch (apiError.status) {
                case 403:
                    errorCode = AuthErrorCode.INVALID_CREDENTIALS;
                    break;
                case 409:
                    errorCode = AuthErrorCode.VALIDATION_ERROR; // Username already exists
                    break;
                case 422:
                    errorCode = AuthErrorCode.VALIDATION_ERROR;
                    break;
                case 500:
                case 502:
                case 503:
                    errorCode = AuthErrorCode.SERVER_ERROR;
                    break;
                case 0:
                    errorCode = AuthErrorCode.NETWORK_ERROR;
                    break;
                default:
                    errorCode = AuthErrorCode.UNKNOWN_ERROR;
            }

            setError({
                code: errorCode,
                message: apiError.message || "Signup failed",
                status: apiError.status,
            });
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setError(null);
        authApi.logout();
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const isAuthenticated = useMemo(() => !!user, [user]);

    const contextValue = useMemo<AuthContextType>(
        () => ({
            user,
            isAuthenticated,
            isLoading,
            error,
            login,
            signup,
            logout,
            clearError,
        }),
        [user, isAuthenticated, isLoading, error, login, signup, logout, clearError]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// ============================================================================
// Hook
// ============================================================================

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};
