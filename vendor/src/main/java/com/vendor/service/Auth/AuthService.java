package com.vendor.service.Auth;

import com.vendor.dto.LoginDto;
import com.vendor.dto.RegisterDto;
import com.vendor.dto.RoleDto;
import com.vendor.entity.Role;
import com.vendor.entity.User;
import com.vendor.exception.APIException;
import com.vendor.repository.RoleRepository;
import com.vendor.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class AuthService {
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;
    private AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    public String register(RegisterDto registerDto) {

        // check username is already exists in database
        if(userRepository.existsByUsername(registerDto.getUsername())){
            throw new APIException(HttpStatus.BAD_REQUEST, "Username already exists!");
        }

        // check email is already exists in database
        if(userRepository.existsByEmail(registerDto.getEmail())){
            throw new APIException(HttpStatus.BAD_REQUEST, "Email is already exists!.");
        }

        User user = new User();
        user.setName(registerDto.getName());
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));

        Set<Role> roles = new HashSet<>();
//        Role userRole = roleRepository.findByName("ROLE_USER");
//        roles.add(userRole);
//
//        user.setRoles(roles);
        Role userRole;

        if (registerDto.getRole() != null) {
            userRole = roleRepository.findByName(registerDto.getRole());
        } else {
            // Default role if not provided in RegisterDto
            userRole = roleRepository.findByName("ROLE_USER");
        }

        roles.add(userRole);
        user.setRoles(roles);

        userRepository.save(user);

        return "User Registered Successfully!.";
    }


    public RoleDto login(LoginDto loginDto) {

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDto.getUsernameOrEmail(),
                loginDto.getPassword()
        ));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        Optional<User> userOptional = userRepository.findByUsernameOrEmail(loginDto.getUsernameOrEmail()
                ,loginDto.getUsernameOrEmail());

        String role = null;
        if (userOptional.isPresent()){
            User loggedInUser = userOptional.get();
            Optional<Role> optionalRole = loggedInUser.getRoles().stream().findFirst();

            if (optionalRole.isPresent()){
                Role userRole = optionalRole.get();
                role = userRole.getName();
            }

        }

        RoleDto roleDto = new RoleDto();
        roleDto.setRole(role);

        return roleDto;
    }
}
