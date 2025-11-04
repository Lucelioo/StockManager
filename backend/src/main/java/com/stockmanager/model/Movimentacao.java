package com.stockmanager.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Entity
@Table(name = "movimentacoes")
public class Movimentacao extends BaseEntity {

    @Column(name = "data_hora", nullable = false)
    private java.time.LocalDateTime dataHora;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Tipo tipo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @Column(nullable = false)
    @NotNull(message = "Quantidade é obrigatória")
    @Min(value = 1, message = "Quantidade deve ser maior que zero")
    private Integer quantidade;

    @Column(name = "valor_unitario", nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Valor unitário é obrigatório")
    @Min(value = 0, message = "Valor unitário não pode ser negativo")
    private BigDecimal valorUnitario;

    @Column(name = "valor_total", nullable = false, precision = 12, scale = 2)
    private BigDecimal valorTotal;

    @Column(name = "fornecedor_cliente", length = 255)
    private String fornecedorCliente;

    @Column(nullable = false)
    @NotBlank(message = "Responsável é obrigatório")
    private String responsavel;

    @Column(length = 1000)
    private String observacoes;

    public enum Tipo {
        ENTRADA,
        SAIDA
    }

    public Movimentacao() {
        this.dataHora = java.time.LocalDateTime.now();
    }

    public Movimentacao(Tipo tipo, Produto produto, Integer quantidade,
                       BigDecimal valorUnitario, String fornecedorCliente,
                       String responsavel, String observacoes) {
        this.dataHora = java.time.LocalDateTime.now();
        this.tipo = tipo;
        this.produto = produto;
        this.quantidade = quantidade;
        this.valorUnitario = valorUnitario;
        this.fornecedorCliente = fornecedorCliente;
        this.responsavel = responsavel;
        this.observacoes = observacoes;
        this.calcularValorTotal();
    }

    @PrePersist
    @PreUpdate
    public void calcularValorTotal() {
        if (quantidade != null && valorUnitario != null) {
            this.valorTotal = valorUnitario.multiply(BigDecimal.valueOf(quantidade));
        }
    }

    public java.time.LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(java.time.LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public Tipo getTipo() {
        return tipo;
    }

    public void setTipo(Tipo tipo) {
        this.tipo = tipo;
    }

    public Produto getProduto() {
        return produto;
    }

    public void setProduto(Produto produto) {
        this.produto = produto;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
        this.calcularValorTotal();
    }

    public BigDecimal getValorUnitario() {
        return valorUnitario;
    }

    public void setValorUnitario(BigDecimal valorUnitario) {
        this.valorUnitario = valorUnitario;
        this.calcularValorTotal();
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    public String getFornecedorCliente() {
        return fornecedorCliente;
    }

    public void setFornecedorCliente(String fornecedorCliente) {
        this.fornecedorCliente = fornecedorCliente;
    }

    public String getResponsavel() {
        return responsavel;
    }

    public void setResponsavel(String responsavel) {
        this.responsavel = responsavel;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
}