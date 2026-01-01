/**
 * API barrel export
 */

// API Client
export { default as apiClient, setAuthToken, getAuthToken, removeAuthToken, isAuthenticated } from './client';
export type { ApiError, ApiResponse } from './client';

// User API
export { default as userApi, getCurrentUser, getUserById } from './userApi';

// Auth API
export { default as authApi, login, signup, logout, getStoredUser, getToken } from './authApi';

// Patient API
export { default as patientApi } from './patientApi';

// Product API
export { default as productApi } from './productApi';
