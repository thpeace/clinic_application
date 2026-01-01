/**
 * Patient - Frontend domain model
 */
export interface Patient {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    dateOfBirth?: Date;
    address?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Request payload for creating a patient
 */
export interface CreatePatientRequest {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
}

/**
 * Request payload for updating a patient
 */
export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {
    id: number;
}
