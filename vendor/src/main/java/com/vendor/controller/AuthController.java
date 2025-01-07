package com.vendor.controller;

import com.vendor.dto.LoginDto;
import com.vendor.dto.RegisterDto;
import com.vendor.dto.RoleDto;
import com.vendor.exception.ErrorResponse;
import com.vendor.service.Auth.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private AuthService authService;

    // Build Register REST API
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDto registerDto){
        String response = authService.register(registerDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        try {
            RoleDto roleDto = authService.login(loginDto);
            return ResponseEntity.ok(roleDto);
        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Invalid username or password"));
        }
    }

    public AuthController(AuthService authService) {
        this.authService = authService;
    }


}
