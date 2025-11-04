package com.stockmanager.dto.response;

import com.stockmanager.model.Usuario;

import java.time.LocalDateTime;

public class UserInfoResponse {

    private Long id;
    private String username;
    private String email;
    private String nomeCompleto;
    private Usuario.Role role;
    private LocalDateTime createdAt;

    public UserInfoResponse() {}

    public UserInfoResponse(Usuario usuario) {
        this.id = usuario.getId();
        this.username = usuario.getUsername();
        this.email = usuario.getEmail();
        this.nomeCompleto = usuario.getNomeCompleto();
        this.role = usuario.getRole();
        this.createdAt = usuario.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNomeCompleto() {
        return nomeCompleto;
    }

    public void setNomeCompleto(String nomeCompleto) {
        this.nomeCompleto = nomeCompleto;
    }

    public Usuario.Role getRole() {
        return role;
    }

    public void setRole(Usuario.Role role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}