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
        firstName: dto.fname ?? '',
        lastName: dto.lname ?? '',
        email: dto.email,
        phone: dto.tel1,
        dateOfBirth: dto.birthday ? new Date(dto.birthday) : undefined,
        address: dto.address1,
        createdAt: dto.dat ? new Date(dto.dat) : undefined,
        updatedAt: undefined,
    };
}

/**
 * Maps array of PatientDTOs
 */
export function mapPatientDTOsToPatients(dtos: PatientDTO[]): Patient[] {
    return dtos.map(mapPatientDTOToPatient);
}
