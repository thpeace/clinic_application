/**
 * Auth Mapper - Converts auth DTOs to domain models
 */
import type { LoginResponseDTO } from '../types/dto/auth.dto';
import type { AuthResponse, AuthUser } from '../types/auth';

/**
 * Maps LoginResponseDTO to AuthResponse
 */
export function mapLoginResponseToAuth(dto: LoginResponseDTO): AuthResponse {
    const user: AuthUser = {
        username: dto.username,
    };

    return {
        token: dto.token,
        user,
    };
}
