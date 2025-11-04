package com.stockmanager.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

@Entity
@Table(name = "produtos")
public class Produto extends BaseEntity {

    @Column(unique = true, nullable = false, length = 20)
    @NotBlank(message = "Código é obrigatório")
    private String codigo;

    @Column(nullable = false)
    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @Column(nullable = false, length = 100)
    @NotBlank(message = "Categoria é obrigatória")
    private String categoria;

    @Column(nullable = false, precision = 10, scale = 2)
    @DecimalMin(value = "0.01", message = "Preço deve ser maior que zero")
    @NotNull(message = "Preço é obrigatório")
    private BigDecimal preco;

    @Column(nullable = false)
    @Min(value = 0, message = "Estoque não pode ser negativo")
    private Integer estoque = 0;

    @Column(nullable = false)
    @Min(value = 0, message = "Estoque mínimo não pode ser negativo")
    private Integer estoqueMinimo = 0;

    @Column(length = 1000)
    private String descricao;

    public Produto() {}

    public Produto(String codigo, String nome, String categoria, BigDecimal preco, Integer estoque, Integer estoqueMinimo, String descricao) {
        this.codigo = codigo;
        this.nome = nome;
        this.categoria = categoria;
        this.preco = preco;
        this.estoque = estoque;
        this.estoqueMinimo = estoqueMinimo;
        this.descricao = descricao;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }

    public Integer getEstoque() {
        return estoque;
    }

    public void setEstoque(Integer estoque) {
        this.estoque = estoque;
    }

    public Integer getEstoqueMinimo() {
        return estoqueMinimo;
    }

    public void setEstoqueMinimo(Integer estoqueMinimo) {
        this.estoqueMinimo = estoqueMinimo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getStatusEstoque() {
        if (estoque == 0) return "ESGOTADO";
        if (estoque <= estoqueMinimo) return "BAIXO";
        return "NORMAL";
    }
}