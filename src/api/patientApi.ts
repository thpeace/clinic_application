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
 * Get all patients (non-paginated)
 * Backend: GET /patients
 */
export async function getAll(): Promise<Patient[]> {
    const response = await apiClient.get<PatientDTO[]>('/patients');
    return mapPatientDTOsToPatients(response.data);
}

/**
 * Get all patients with pagination
 * Backend: GET /patients?page={page}&size={size}
 */
export async function getAllPaginated(page: number = 0, size: number = 10): Promise<PaginatedResponse<Patient>> {
    const response = await apiClient.get<PaginatedResponse<PatientDTO>>('/patients', {
        params: { page, size }
    });
    return {
        ...response.data,
        content: mapPatientDTOsToPatients(response.data.content)
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
 * Backend: GET /patients/total
 */
export async function getTotalPatients(): Promise<number> {
    const response = await apiClient.get<number>('/patients/total');
    return response.data;
}

/**
 * Get total number of patients registered today
 * Backend: GET /patients/total/today
 */
export async function getTotalPatientsToday(): Promise<number> {
    const response = await apiClient.get<number>('/patients/total/today');
    return response.data;
}

/**
 * Import patients from external source
 * Backend: POST /patients/import
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
    getAllPaginated,
    search,
    create,
    update,
    remove,
    getTotalPatients,
    getTotalPatientsToday,
    importPatients,
};

export default patientApi;

