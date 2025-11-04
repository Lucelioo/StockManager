package com.stockmanager.service;

import com.stockmanager.model.Movimentacao;
import com.stockmanager.model.Produto;
import com.stockmanager.repository.MovimentacaoRepository;
import com.stockmanager.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MovimentacaoService {

    @Autowired
    private MovimentacaoRepository movimentacaoRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    public Page<Movimentacao> findAll(int page, int size, String sortBy, String sortDir, String busca, String tipo, Long produtoId, LocalDateTime dataInicial, LocalDateTime dataFinal) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        return movimentacaoRepository.findByFilters(busca,
            tipo != null ? Movimentacao.Tipo.valueOf(tipo) : null,
            produtoId, dataInicial, dataFinal, pageable);
    }

    public Optional<Movimentacao> findById(Long id) {
        return movimentacaoRepository.findById(id);
    }

    public Movimentacao save(Movimentacao movimentacao) {
        // Validar produto
        Optional<Produto> produtoOpt = produtoRepository.findById(movimentacao.getProduto().getId());
        if (produtoOpt.isEmpty()) {
            throw new RuntimeException("Produto não encontrado");
        }

        Produto produto = produtoOpt.get();

        // Validar e atualizar estoque
        if (movimentacao.getTipo() == Movimentacao.Tipo.ENTRADA) {
            produto.setEstoque(produto.getEstoque() + movimentacao.getQuantidade());
        } else if (movimentacao.getTipo() == Movimentacao.Tipo.SAIDA) {
            if (produto.getEstoque() < movimentacao.getQuantidade()) {
                throw new RuntimeException("Estoque insuficiente para saída");
            }
            produto.setEstoque(produto.getEstoque() - movimentacao.getQuantidade());
        }

        // Salvar produto atualizado
        produtoRepository.save(produto);

        // Configurar produto na movimentação
        movimentacao.setProduto(produto);

        // Configurar data/hora se não estiver definida
        if (movimentacao.getDataHora() == null) {
            movimentacao.setDataHora(LocalDateTime.now());
        }

        return movimentacaoRepository.save(movimentacao);
    }

    public void deleteById(Long id) {
        Optional<Movimentacao> movimentacaoOpt = movimentacaoRepository.findById(id);
        if (movimentacaoOpt.isEmpty()) {
            throw new RuntimeException("Movimentação não encontrada");
        }

        Movimentacao movimentacao = movimentacaoOpt.get();

        // Reverter estoque
        Produto produto = movimentacao.getProduto();
        if (movimentacao.getTipo() == Movimentacao.Tipo.ENTRADA) {
            produto.setEstoque(produto.getEstoque() - movimentacao.getQuantidade());
        } else if (movimentacao.getTipo() == Movimentacao.Tipo.SAIDA) {
            produto.setEstoque(produto.getEstoque() + movimentacao.getQuantidade());
        }

        produtoRepository.save(produto);
        movimentacaoRepository.deleteById(id);
    }

    public long countByTipo(Movimentacao.Tipo tipo) {
        return movimentacaoRepository.countByTipo(tipo);
    }

    public long countToday() {
        return movimentacaoRepository.countToday();
    }

    public Double getValorTotal() {
        return movimentacaoRepository.sumValorTotal();
    }

    public Long sumQuantidadeByTipo(Movimentacao.Tipo tipo) {
        Long quantidade = movimentacaoRepository.sumQuantidadeByTipo(tipo);
        return quantidade != null ? quantidade : 0L;
    }

    public List<Movimentacao> findRecent() {
        return movimentacaoRepository.findTop10ByOrderByDataHoraDesc();
    }

    public Page<Movimentacao> findByTipo(String tipo, int page, int size) {
        Movimentacao.Tipo tipoEnum = Movimentacao.Tipo.valueOf(tipo);
        return movimentacaoRepository.findByTipo(tipoEnum, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "dataHora")));
    }

    public Page<Movimentacao> findByProdutoId(Long produtoId, int page, int size) {
        return movimentacaoRepository.findByProdutoId(produtoId, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "dataHora")));
    }

    public boolean existsById(Long id) {
        return movimentacaoRepository.existsById(id);
    }
}