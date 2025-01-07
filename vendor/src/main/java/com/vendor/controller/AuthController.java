package com.vendor.controller;

import com.vendor.dto.LoginDto;
import com.vendor.dto.RegisterDto;
import com.vendor.dto.RoleDto;
import com.vendor.service.Auth.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    // Build Login REST API
    @PostMapping("/login")
    public ResponseEntity<RoleDto> login(@RequestBody LoginDto loginDto){
        RoleDto response = authService.login(loginDto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public AuthController(AuthService authService) {
        this.authService = authService;
    }


}
