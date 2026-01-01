/**
 * User role enum - matches backend role values
 */
export enum UserRole {
    ADMIN = 'ADMIN',
    DOCTOR = 'DOCTOR',
    NURSE = 'NURSE',
    RECEPTIONIST = 'RECEPTIONIST',
    PHARMACIST = 'PHARMACIST',
    LAB_TECHNICIAN = 'LAB_TECHNICIAN',
    PATIENT = 'PATIENT',
    GUEST = 'GUEST',
}

/**
 * Display names for user roles (for UI)
 */
export const RoleDisplayName: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'Administrator',
    [UserRole.DOCTOR]: 'Doctor',
    [UserRole.NURSE]: 'Nurse',
    [UserRole.RECEPTIONIST]: 'Receptionist',
    [UserRole.PHARMACIST]: 'Pharmacist',
    [UserRole.LAB_TECHNICIAN]: 'Lab Technician',
    [UserRole.PATIENT]: 'Patient',
    [UserRole.GUEST]: 'Guest',
};
