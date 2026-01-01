/**
 * Patient API - Pure API calls for patient-related endpoints
 * Aligned with PatientController.java backend endpoints
 */
import apiClient from './client';
import type { PatientDTO } from '../types/dto/patient.dto';
import type { Patient } from '../types/patient';
import { mapPatientDTOsToPatients } from '../mappers/patientMapper';

// ============================================================================
// Patient API Functions
// ============================================================================

/**
 * Get all patients
 * Backend: GET /patients
 */
export async function getAll(): Promise<Patient[]> {
    const response = await apiClient.get<PatientDTO[]>('/patients');
    return mapPatientDTOsToPatients(response.data);
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
    getTotalPatients,
    getTotalPatientsToday,
    importPatients,
};

export default patientApi;
