import apiClient from './client';

// ============================================================================
// Types
// ============================================================================

export interface Patient {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreatePatientRequest {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
}

export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {
    id: number;
}

export interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

// ============================================================================
// Patient Service
// ============================================================================

const patientService = {
    /**
     * Get all patients with pagination
     */
    async getAll(page = 0, size = 10): Promise<PaginatedResponse<Patient>> {
        const response = await apiClient.get<PaginatedResponse<Patient>>('/patients', {
            params: { page, size },
        });
        return response.data;
    },

    /**
     * Get a single patient by ID
     */
    async getById(id: number): Promise<Patient> {
        const response = await apiClient.get<Patient>(`/patients/${id}`);
        return response.data;
    },

    /**
     * Create a new patient
     */
    async create(patient: CreatePatientRequest): Promise<Patient> {
        const response = await apiClient.post<Patient>('/patients', patient);
        return response.data;
    },

    /**
     * Update an existing patient
     */
    async update(id: number, patient: Partial<CreatePatientRequest>): Promise<Patient> {
        const response = await apiClient.put<Patient>(`/patients/${id}`, patient);
        return response.data;
    },

    /**
     * Delete a patient
     */
    async delete(id: number): Promise<void> {
        await apiClient.delete(`/patients/${id}`);
    },

    /**
     * Search patients by name or other criteria
     */
    async search(query: string, page = 0, size = 10): Promise<PaginatedResponse<Patient>> {
        const response = await apiClient.get<PaginatedResponse<Patient>>('/patients/search', {
            params: { query, page, size },
        });
        return response.data;
    },
};

export default patientService;
