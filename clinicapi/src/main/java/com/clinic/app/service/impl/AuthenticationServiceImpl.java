package com.clinic.app.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import com.clinic.app.domain.dto.LoginRequestDTO;
import com.clinic.app.service.AuthenticationService;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {
        
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationServiceImpl.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    public UserDetails authenticate(LoginRequestDTO loginRequestDTO) throws Exception {
        
        Authentication authentication = null;
        try {
            UsernamePasswordAuthenticationToken authObject = new UsernamePasswordAuthenticationToken(loginRequestDTO.getUsername(), loginRequestDTO.getPassword());
            authentication = authenticationManager.authenticate(authObject);

        } catch (Exception e) {
            logger.error("Error during authentication: " + e.getMessage());
            throw new Exception("Authentication failed");
        }
        return (UserDetails) authentication.getPrincipal();
    }

   
}
