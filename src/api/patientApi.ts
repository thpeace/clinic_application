/**
 * Patient API - Pure API calls for patient-related endpoints
 */
import apiClient from './client';
import type { PatientDTO } from '../types/dto/patient.dto';
import type { Patient, CreatePatientRequest } from '../types/patient';
import type { PaginatedResponse } from '../types/common';
import { mapPatientDTOToPatient, mapPatientDTOsToPatients } from '../mappers/patientMapper';

// ============================================================================
// Patient API Functions
// ============================================================================

/**
 * Get all patients with pagination
 */
export async function getAll(page = 0, size = 10): Promise<PaginatedResponse<Patient>> {
    const response = await apiClient.get<PaginatedResponse<PatientDTO>>('/patients', {
        params: { page, size },
    });

    return {
        ...response.data,
        content: mapPatientDTOsToPatients(response.data.content),
    };
}

/**
 * Get a single patient by ID
 */
export async function getById(id: number): Promise<Patient> {
    const response = await apiClient.get<PatientDTO>(`/patients/${id}`);
    return mapPatientDTOToPatient(response.data);
}

/**
 * Create a new patient
 */
export async function create(patient: CreatePatientRequest): Promise<Patient> {
    const response = await apiClient.post<PatientDTO>('/patients', patient);
    return mapPatientDTOToPatient(response.data);
}

/**
 * Update an existing patient
 */
export async function update(id: number, patient: Partial<CreatePatientRequest>): Promise<Patient> {
    const response = await apiClient.put<PatientDTO>(`/patients/${id}`, patient);
    return mapPatientDTOToPatient(response.data);
}

/**
 * Delete a patient
 */
export async function remove(id: number): Promise<void> {
    await apiClient.delete(`/patients/${id}`);
}

/**
 * Search patients by name or other criteria
 */
export async function search(query: string, page = 0, size = 10): Promise<PaginatedResponse<Patient>> {
    const response = await apiClient.get<PaginatedResponse<PatientDTO>>('/patients/search', {
        params: { query, page, size },
    });

    return {
        ...response.data,
        content: mapPatientDTOsToPatients(response.data.content),
    };
}

// ============================================================================
// Default Export
// ============================================================================

const patientApi = {
    getAll,
    getById,
    create,
    update,
    remove,
    search,
};

export default patientApi;
