/**
 * Patient DTO - Matches backend response shape
 */
export interface PatientDTO {
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
