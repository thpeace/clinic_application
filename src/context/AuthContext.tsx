"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import authService, { User, LoginRequest, SignupRequest, AuthResponse } from "../api/authService";
import { ApiError } from "../api/client";

// ============================================================================
// Types
// ============================================================================

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
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
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check for existing auth on mount
    useEffect(() => {
        const initAuth = () => {
            try {
                const currentUser = authService.getCurrentUser();
                if (currentUser && authService.isAuthenticated()) {
                    setUser(currentUser);
                }
            } catch {
                // Invalid stored data, clear it
                authService.logout();
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = useCallback(async (credentials: LoginRequest): Promise<AuthResponse> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await authService.login(credentials);
            setUser(response.user);
            return response;
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || "Login failed");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const signup = useCallback(async (userData: SignupRequest): Promise<AuthResponse> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await authService.signup(userData);
            setUser(response.user);
            return response;
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || "Signup failed");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setError(null);
        authService.logout();
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
