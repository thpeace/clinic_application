/**
 * usePatient - Custom hook for patient CRUD operations
 */
import { useState, useCallback } from 'react';
import type { Patient, CreatePatientRequest } from '../types/patient';
import type { PaginatedResponse } from '../types/common';
import patientApi from '../api/patientApi';

interface UsePatientListState {
    patients: Patient[];
    pagination: Omit<PaginatedResponse<Patient>, 'content'> | null;
    isLoading: boolean;
    error: string | null;
}

interface UsePatientListReturn extends UsePatientListState {
    fetchPatients: (page?: number, size?: number) => Promise<void>;
    searchPatients: (query: string, page?: number, size?: number) => Promise<void>;
    createPatient: (data: CreatePatientRequest) => Promise<Patient>;
    updatePatient: (id: number, data: Partial<CreatePatientRequest>) => Promise<Patient>;
    deletePatient: (id: number) => Promise<void>;
}

/**
 * Hook for patient list operations
 */
export function usePatientList(): UsePatientListReturn {
    const [state, setState] = useState<UsePatientListState>({
        patients: [],
        pagination: null,
        isLoading: false,
        error: null,
    });

    const fetchPatients = useCallback(async (page = 0, size = 10) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await patientApi.getAllPaginated(page, size);
            const { content, ...pagination } = response;
            setState({ patients: content, pagination, isLoading: false, error: null });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch patients';
            setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
        }
    }, []);

    const searchPatients = useCallback(async (query: string, page = 0, size = 10) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await patientApi.search(query, page, size);
            const { content, ...pagination } = response;
            setState({ patients: content, pagination, isLoading: false, error: null });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to search patients';
            setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
        }
    }, []);

    const createPatient = useCallback(async (data: CreatePatientRequest): Promise<Patient> => {
        const patient = await patientApi.create(data);
        setState(prev => ({ ...prev, patients: [patient, ...prev.patients] }));
        return patient;
    }, []);

    const updatePatient = useCallback(async (id: number, data: Partial<CreatePatientRequest>): Promise<Patient> => {
        const updated = await patientApi.update(id, data);
        setState(prev => ({
            ...prev,
            patients: prev.patients.map(p => p.id === id ? updated : p),
        }));
        return updated;
    }, []);

    const deletePatient = useCallback(async (id: number): Promise<void> => {
        await patientApi.remove(id);
        setState(prev => ({
            ...prev,
            patients: prev.patients.filter(p => p.id !== id),
        }));
    }, []);

    return {
        ...state,
        fetchPatients,
        searchPatients,
        createPatient,
        updatePatient,
        deletePatient,
    };
}

export default usePatientList;
