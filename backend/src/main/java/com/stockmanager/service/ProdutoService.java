package com.stockmanager.service;

import com.stockmanager.model.Produto;
import com.stockmanager.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public Page<Produto> findAll(int page, int size, String sortBy, String sortDir, String nome, String categoria, String status) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        if (nome != null || categoria != null || status != null) {
            return produtoRepository.findByFilters(nome, categoria, status, pageable);
        }

        return produtoRepository.findAll(pageable);
    }

    public Optional<Produto> findById(Long id) {
        return produtoRepository.findById(id);
    }

    public Optional<Produto> findByCodigo(String codigo) {
        return produtoRepository.findByCodigo(codigo);
    }

    public Produto save(Produto produto) {
        // Verificar se código já existe (para novos produtos)
        if (produto.getId() == null) {
            if (produtoRepository.existsByCodigo(produto.getCodigo())) {
                throw new RuntimeException("Já existe um produto com este código");
            }
        } else {
            // Para produtos existentes, verificar se código já pertence a outro produto
            Optional<Produto> existing = produtoRepository.findByCodigo(produto.getCodigo());
            if (existing.isPresent() && !existing.get().getId().equals(produto.getId())) {
                throw new RuntimeException("Já existe outro produto com este código");
            }
        }

        return produtoRepository.save(produto);
    }

    public void deleteById(Long id) {
        // Verificar se existem movimentações associadas
        // TODO: Implementar verificação quando tiver movimentacao repository

        produtoRepository.deleteById(id);
    }

    public List<String> findAllCategorias() {
        return produtoRepository.findDistinctCategorias();
    }

    public boolean existsByCodigo(String codigo) {
        return produtoRepository.existsByCodigo(codigo);
    }

    public long countTotal() {
        return produtoRepository.count();
    }

    public long countEsgotados() {
        return produtoRepository.countEsgotados();
    }

    public long countEstoqueBaixo() {
        return produtoRepository.countEstoqueBaixo();
    }

    public Double getValorTotalEstoque() {
        return produtoRepository.calcularValorTotalEstoque();
    }

    public List<Produto> findByEstoqueBaixo() {
        return produtoRepository.findByEstoqueLessThanEqual(null);
    }

    public List<Produto> findByCategoria(String categoria) {
        return produtoRepository.findByCategoria(categoria, null).getContent();
    }

    public Page<Produto> findByNome(String nome, int page, int size) {
        return produtoRepository.findByNomeContainingIgnoreCase(nome, PageRequest.of(page, size));
    }

    public void atualizarEstoque(Long produtoId, Integer quantidade, String tipo) {
        Optional<Produto> produtoOpt = produtoRepository.findById(produtoId);
        if (produtoOpt.isEmpty()) {
            throw new RuntimeException("Produto não encontrado");
        }

        Produto produto = produtoOpt.get();

        if ("ENTRADA".equals(tipo)) {
            produto.setEstoque(produto.getEstoque() + quantidade);
        } else if ("SAIDA".equals(tipo)) {
            if (produto.getEstoque() < quantidade) {
                throw new RuntimeException("Estoque insuficiente para saída");
            }
            produto.setEstoque(produto.getEstoque() - quantidade);
        }

        produtoRepository.save(produto);
    }
}