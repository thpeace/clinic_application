/**
 * Patient Mapper - Converts PatientDTO to Patient domain model
 */
import type { PatientDTO } from '../types/dto/patient.dto';
import type { Patient } from '../types/patient';

/**
 * Maps PatientDTO from API to Patient domain model
 */
export function mapPatientDTOToPatient(dto: PatientDTO): Patient {
    return {
        id: dto.id,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        address: dto.address,
        createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
        updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    };
}

/**
 * Maps array of PatientDTOs
 */
export function mapPatientDTOsToPatients(dtos: PatientDTO[]): Patient[] {
    return dtos.map(mapPatientDTOToPatient);
}
