package com.stockmanager.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "usuarios")
public class Usuario extends BaseEntity {

    @Column(unique = true, nullable = false, length = 50)
    @NotBlank(message = "Username é obrigatório")
    private String username;

    @Column(nullable = false)
    @NotBlank(message = "Password é obrigatório")
    private String password;

    @Email(message = "Email inválido")
    @Column(unique = true, nullable = false)
    @NotBlank(message = "Email é obrigatório")
    private String email;

    @Column(name = "nome_completo")
    private String nomeCompleto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    public enum Role {
        ADMIN,
        USER
    }

    public Usuario() {}

    public Usuario(String username, String password, String email, String nomeCompleto, Role role) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.nomeCompleto = nomeCompleto;
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}