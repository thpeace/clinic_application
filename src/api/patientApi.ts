/**
 * Patient API - Pure API calls for patient-related endpoints
 * Aligned with PatientController.java backend endpoints
 */
import apiClient from './client';
import type { PatientDTO } from '../types/dto/patient.dto';
import type { Patient, CreatePatientRequest } from '../types/patient';
import type { PaginatedResponse } from '../types/common';
import { mapPatientDTOsToPatients, mapPatientDTOToPatient } from '../mappers/patientMapper';

// ============================================================================
// Patient API Functions
// ============================================================================

/**
 * Get all patients with pagination
 * Backend: GET /api/patients?page={page}&size={size}
 * Note: Size must be one of: 10, 20, 50, 100, 500 (defaults to 10 if invalid)
 */
export async function getAll(page: number = 0, size: number = 10): Promise<PaginatedResponse<Patient>> {
    const response = await apiClient.get<any>('/patients', {
        params: { page, size }
    });

    // Backend returns Spring Page format
    return {
        content: mapPatientDTOsToPatients(response.data.content),
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages,
        size: response.data.size,
        number: response.data.number,
        numberOfElements: response.data.numberOfElements,
        first: response.data.first,
        last: response.data.last,
        empty: response.data.empty
    };
}



/**
 * Search patients by query
 * Backend: GET /patients/search?query={query}&page={page}&size={size}
 */
export async function search(query: string, page: number = 0, size: number = 10): Promise<PaginatedResponse<Patient>> {
    const response = await apiClient.get<PaginatedResponse<PatientDTO>>('/patients/search', {
        params: { query, page, size }
    });
    return {
        ...response.data,
        content: mapPatientDTOsToPatients(response.data.content)
    };
}

/**
 * Create a new patient
 * Backend: POST /patients
 */
export async function create(data: CreatePatientRequest): Promise<Patient> {
    const response = await apiClient.post<PatientDTO>('/patients', data);
    return mapPatientDTOToPatient(response.data);
}

/**
 * Update an existing patient
 * Backend: PUT /patients/{id}
 */
export async function update(id: number, data: Partial<CreatePatientRequest>): Promise<Patient> {
    const response = await apiClient.put<PatientDTO>(`/patients/${id}`, data);
    return mapPatientDTOToPatient(response.data);
}

/**
 * Delete a patient
 * Backend: DELETE /patients/{id}
 */
export async function remove(id: number): Promise<void> {
    await apiClient.delete(`/patients/${id}`);
}

/**
 * Get total number of patients
 * Backend: GET /api/patients/total
 * @returns Total count of patients (Long)
 */
export async function getTotalPatients(): Promise<number> {
    const response = await apiClient.get<number>('/patients/total');
    return response.data;
}

/**
 * Get total number of patients registered today
 * Backend: GET /api/patients/total/today
 * @returns Total count of patients created today (Long)
 */
export async function getTotalPatientsToday(): Promise<number> {
    const response = await apiClient.get<number>('/patients/total/today');
    return response.data;
}

/**
 * Import patients from external source
 * Backend: POST /api/patients/import
 * @param data PatientResponse object with data array
 * @returns Success message with count
 */
export async function importPatients(data: { status?: string; data: PatientDTO[]; total?: number; sql?: string }): Promise<string> {
    const response = await apiClient.post<string>('/patients/import', data);
    return response.data;
}

// ============================================================================
// Default Export
// ============================================================================

const patientApi = {
    getAll,
    search,
    create,
    update,
    remove,
    getTotalPatients,
    getTotalPatientsToday,
    importPatients,
};

export default patientApi;

