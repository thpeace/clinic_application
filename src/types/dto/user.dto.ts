/**
 * User DTO - Matches UserDetailResponse from clinicapi backend
 * This is the exact shape returned by the API
 */
export interface UserDetailDTO {
    id: number;
    username: string;
    roleName: string | null;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string | null;
    country: string | null;
    postalCode: string | null;
    province: string | null;
    enabled: boolean;
    profilePicture: string | null;
    createdDate: string;
    updatedDate: string;
}
