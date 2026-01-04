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
        hn: dto.hn,
        pname: dto.pname,
        fname: dto.fname,
        lname: dto.lname,
        nname: dto.nname,
        sex: dto.sex,
        personalid: dto.personalid,
        birthday: dto.birthday,
        occupation: dto.occupation,
        nationality: dto.nationality,
        address1: dto.address1,
        address2: dto.address2,
        tel1: dto.tel1,
        tel2: dto.tel2,
        tel3: dto.tel3,
        email: dto.email,
        province: dto.province,
        zip: dto.zip,
        mode: dto.mode,
        dat: dto.dat,
        level: dto.level,
        stayin: dto.stayin,
        image: dto.image,
        vn: dto.vn,
        cn: dto.cn,
        facebook: dto.facebook,
        line: dto.line,
        status: dto.status,
        clinicname: dto.clinicname,
    };
}

/**
 * Maps array of PatientDTOs
 */
export function mapPatientDTOsToPatients(dtos: PatientDTO[]): Patient[] {
    return dtos.map(mapPatientDTOToPatient);
}
