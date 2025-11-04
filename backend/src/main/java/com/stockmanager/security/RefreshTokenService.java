package com.stockmanager.security;

import com.stockmanager.model.RefreshToken;
import com.stockmanager.model.Usuario;
import com.stockmanager.repository.RefreshTokenRepository;
import com.stockmanager.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import java.util.Optional;

@Service
@Transactional
public class RefreshTokenService {

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;

    private final RefreshTokenRepository refreshTokenRepository;
    private final UsuarioRepository usuarioRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository,
                               UsuarioRepository usuarioRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public RefreshToken createRefreshToken(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + username));

        // Revogar tokens anteriores do mesmo usuário
        revokeAllUserTokens(usuario.getId());

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUsuario(usuario);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plus(refreshExpiration, ChronoUnit.MILLIS));
        refreshToken.setRevoked(false);

        return refreshTokenRepository.save(refreshToken);
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findValidToken(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token expirado. Por favor, faça login novamente.");
        }
        return token;
    }

    @Transactional
    public RefreshToken refreshAccessToken(String refreshToken) {
        RefreshToken token = findByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Refresh token inválido"));

        verifyExpiration(token);

        // Criar novo refresh token
        RefreshToken newToken = createRefreshToken(token.getUsuario().getUsername());

        return newToken;
    }

    @Transactional
    public void revokeToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Refresh token não encontrado"));

        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);
    }

    @Transactional
    public void revokeAllUserTokens(Long userId) {
        refreshTokenRepository.revokeAllUserTokens(userId);
    }

    @Transactional
    public void cleanupExpiredTokens() {
        refreshTokenRepository.deleteExpiredTokens();
    }
}