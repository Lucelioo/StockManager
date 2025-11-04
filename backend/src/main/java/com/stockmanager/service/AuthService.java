package com.stockmanager.service;

import com.stockmanager.dto.request.LoginRequest;
import com.stockmanager.dto.request.RefreshTokenRequest;
import com.stockmanager.dto.response.LoginResponse;
import com.stockmanager.dto.response.UserInfoResponse;
import com.stockmanager.model.RefreshToken;
import com.stockmanager.model.Usuario;
import com.stockmanager.repository.UsuarioRepository;
import com.stockmanager.security.JwtService;
import com.stockmanager.security.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Value("${jwt.access-expiration}")
    private long accessExpiration;

    public LoginResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Usuário ou senha inválidos");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        String accessToken = jwtService.generateToken(userDetails);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(request.getUsername());

        UserInfoResponse userInfo = new UserInfoResponse(usuario);

        return new LoginResponse(
                accessToken,
                refreshToken.getToken(),
                accessExpiration,
                userInfo
        );
    }

    public LoginResponse refreshAccessToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenService.refreshAccessToken(request.getRefreshToken());

        UserDetails userDetails = userDetailsService.loadUserByUsername(refreshToken.getUsuario().getUsername());
        Usuario usuario = refreshToken.getUsuario();

        String accessToken = jwtService.generateToken(userDetails);
        UserInfoResponse userInfo = new UserInfoResponse(usuario);

        return new LoginResponse(
                accessToken,
                refreshToken.getToken(),
                accessExpiration,
                userInfo
        );
    }

    public void logout(String token) {
        String refreshToken = token.replace("Bearer ", "");
        refreshTokenService.revokeToken(refreshToken);
    }

    public UserInfoResponse getCurrentUser(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
        return new UserInfoResponse(usuario);
    }

    public boolean existsByUsername(String username) {
        return usuarioRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }
}