/**
 * User - Frontend domain model
 * Clean version for use in components
 */

import { UserRole } from "../constants/userRoles";

export interface User {
    id: number;
    username: string;
    role: UserRole | null;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string | null;
    country: string | null;
    postalCode: string | null;
    province: string | null;
    enabled: boolean;
    profilePicture: string | null;
    createdDate: Date;
    updatedDate: Date;
}

/**
 * Computed user display properties
 */
export interface UserDisplayInfo {
    fullName: string;
    initials: string;
    displayName: string;
    address: string;
}
