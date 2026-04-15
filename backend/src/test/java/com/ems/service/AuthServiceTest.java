package com.ems.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.ems.dto.AuthResponse;
import com.ems.dto.RegisterRequest;
import com.ems.entity.AppUser;
import com.ems.exception.ConflictException;
import com.ems.repository.AppUserRepository;
import com.ems.security.AppUserDetails;
import com.ems.security.CustomUserDetailsService;
import com.ems.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AppUserRepository appUserRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_throwsWhenUsernameTaken() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("admin");
        req.setPassword("secret12");
        when(appUserRepository.existsByUsername("admin")).thenReturn(true);
        assertThrows(ConflictException.class, () -> authService.register(req));
        verify(appUserRepository, never()).save(any());
    }

    @Test
    void register_returnsToken() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("newuser");
        req.setPassword("secret12");
        when(appUserRepository.existsByUsername("newuser")).thenReturn(false);
        when(passwordEncoder.encode("secret12")).thenReturn("ENC");
        when(appUserRepository.save(any(AppUser.class))).thenAnswer(inv -> inv.getArgument(0));
        AppUser stubUser = new AppUser();
        stubUser.setUsername("newuser");
        when(userDetailsService.loadUserByUsername("newuser")).thenReturn(new AppUserDetails(stubUser));
        when(jwtService.generateToken(any())).thenReturn("jwt-token");
        AuthResponse out = authService.register(req);
        assertEquals("jwt-token", out.getToken());
        assertEquals("newuser", out.getUsername());
    }
}
