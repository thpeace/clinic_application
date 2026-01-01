/**
 * User Mapper - Converts UserDetailDTO to User domain model
 */
import type { UserDetailDTO } from '../types/dto/user.dto';
import type { User, UserDisplayInfo } from '../types/user';
import { UserRole } from '../constants/userRoles';

/**
 * Maps role name string from API to UserRole enum
 */
function mapRoleNameToEnum(roleName: string | null): UserRole | null {
    if (!roleName) return null;

    // Check if the role exists in the enum
    if (Object.values(UserRole).includes(roleName as UserRole)) {
        return roleName as UserRole;
    }

    // Fallback: return null for unknown roles
    return null;
}

/**
 * Maps UserDetailDTO from API to User domain model
 */
export function mapUserDetailDTOToUser(dto: UserDetailDTO): User {
    return {
        id: dto.id,
        username: dto.username,
        role: mapRoleNameToEnum(dto.roleName),
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        country: dto.country,
        postalCode: dto.postalCode,
        province: dto.province,
        enabled: dto.enabled,
        profilePicture: dto.profilePicture,
        createdDate: new Date(dto.createdDate),
        updatedDate: new Date(dto.updatedDate),
    };
}

/**
 * Get display info from User
 */
export function getUserDisplayInfo(user: User | null): UserDisplayInfo {
    if (!user) {
        return {
            fullName: '',
            initials: '?',
            displayName: 'Loading...',
            address: '',
        };
    }

    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    const initials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase()
        || user.username?.charAt(0).toUpperCase()
        || '?';
    const displayName = fullName || user.username;
    const address = [user.province, user.country].filter(Boolean).join(', ');

    return {
        fullName,
        initials,
        displayName,
        address,
    };
}
