package com.clinic.app.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.clinic.app.domain.dto.LoginRequestDTO;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("${api.endpoint.version}")
public class LoginController {

    private static final Logger logger = LoggerFactory.getLogger(LoginController.class);

    @PostMapping(value = "/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        try {
            return ResponseEntity.ok().body("result is success login");
        } catch (Exception e) {
            logger.error("" + e.getMessage());
            return ResponseEntity.status(500).body("Error during login: " + e.getMessage());
        }
    }

    @PostMapping(value = "/forgotPassword")
    public ResponseEntity<?> forgotPassword(@RequestBody LoginRequestDTO loginRequestDTO) {
        try {
            return ResponseEntity.ok().body("result is success forgot password");
        } catch (Exception e) {
            logger.error("" + e.getMessage());
            return ResponseEntity.status(500).body("Error during forgot password: " + e.getMessage());
        }
    }

    @PostMapping(value = "/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody LoginRequestDTO loginRequestDTO) {
        try {
            return ResponseEntity.ok().body("result is success change password");
        } catch (Exception e) {
            logger.error("" + e.getMessage());
            return ResponseEntity.status(500).body("Error during change password: " + e.getMessage());
        }
    }
    
}
