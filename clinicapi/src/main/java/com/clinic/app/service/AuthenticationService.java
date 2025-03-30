package com.clinic.app.service;

import org.springframework.security.core.userdetails.UserDetails;
import com.clinic.app.domain.dto.LoginRequestDTO;

public interface AuthenticationService {
    UserDetails authenticate(LoginRequestDTO loginRequestDTO) throws Exception;
}
