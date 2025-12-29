// API Client
export { default as apiClient, setAuthToken, getAuthToken, removeAuthToken, isAuthenticated } from './client';
export type { ApiError, ApiResponse } from './client';

// Auth Service
export { default as authService } from './authService';
export type { LoginRequest, SignupRequest, AuthResponse, User } from './authService';

// Patient Service
export { default as patientService } from './patientService';
export type { Patient, CreatePatientRequest, UpdatePatientRequest } from './patientService';

// Product Service
export { default as productService } from './productService';
export type { Product, CreateProductRequest, UpdateProductRequest, ProductStatus } from './productService';

// Common Types
export type { PaginatedResponse } from './patientService';
