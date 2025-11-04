package com.stockmanager.service;

import com.stockmanager.model.Fornecedor;
import com.stockmanager.repository.FornecedorRepository;
import com.stockmanager.util.CnpjValidator;
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
public class FornecedorService {

    @Autowired
    private FornecedorRepository fornecedorRepository;

    public Page<Fornecedor> findAll(int page, int size, String sortBy, String sortDir, String nome, String cnpj, String status) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        if (nome != null || cnpj != null || status != null) {
            Fornecedor.Status statusEnum = status != null ? Fornecedor.Status.valueOf(status) : null;
            return fornecedorRepository.findByFilters(nome, cnpj, statusEnum, pageable);
        }

        return fornecedorRepository.findAll(pageable);
    }

    public Optional<Fornecedor> findById(Long id) {
        return fornecedorRepository.findById(id);
    }

    public Optional<Fornecedor> findByCnpj(String cnpj) {
        String cleanCnpj = CnpjValidator.unformat(cnpj);
        return fornecedorRepository.findByCnpj(cleanCnpj);
    }

    public Fornecedor save(Fornecedor fornecedor) {
        // Limpar e validar CNPJ
        String cleanCnpj = CnpjValidator.unformat(fornecedor.getCnpj());
        fornecedor.setCnpj(cleanCnpj);

        if (!CnpjValidator.isValid(cleanCnpj)) {
            throw new RuntimeException("CNPJ inválido");
        }

        // Gerar código automaticamente para novos fornecedores
        if (fornecedor.getId() == null && fornecedor.getCodigo() == null) {
            String codigo = gerarProximoCodigo();
            fornecedor.setCodigo(codigo);
        }

        // Verificar se CNPJ já existe (para novos fornecedores)
        if (fornecedor.getId() == null) {
            if (fornecedorRepository.existsByCnpj(cleanCnpj)) {
                throw new RuntimeException("Já existe um fornecedor com este CNPJ");
            }
        } else {
            // Para fornecedores existentes, verificar se CNPJ já pertence a outro fornecedor
            Optional<Fornecedor> existing = fornecedorRepository.findByCnpj(cleanCnpj);
            if (existing.isPresent() && !existing.get().getId().equals(fornecedor.getId())) {
                throw new RuntimeException("Já existe outro fornecedor com este CNPJ");
            }
        }

        return fornecedorRepository.save(fornecedor);
    }

    public void deleteById(Long id) {
        // TODO: Verificar se existem produtos ou movimentações associadas
        fornecedorRepository.deleteById(id);
    }

    public long countTotal() {
        return fornecedorRepository.count();
    }

    public long countByStatus(Fornecedor.Status status) {
        return fornecedorRepository.countByStatus(status);
    }

    public Page<Fornecedor> findByNome(String nome, int page, int size) {
        return fornecedorRepository.findByNomeContainingIgnoreCase(nome, PageRequest.of(page, size));
    }

    public Page<Fornecedor> findByStatus(Fornecedor.Status status, int page, int size) {
        return fornecedorRepository.findByStatus(status, PageRequest.of(page, size));
    }

    public boolean existsByCnpj(String cnpj) {
        String cleanCnpj = CnpjValidator.unformat(cnpj);
        return fornecedorRepository.existsByCnpj(cleanCnpj);
    }

    private String gerarProximoCodigo() {
        // Contar fornecedores existentes
        long count = fornecedorRepository.count();
        return String.format("#F%03d", count + 1);
    }

    public Fornecedor atualizarStatus(Long id, Fornecedor.Status novoStatus) {
        Optional<Fornecedor> fornecedorOpt = fornecedorRepository.findById(id);
        if (fornecedorOpt.isEmpty()) {
            throw new RuntimeException("Fornecedor não encontrado");
        }

        Fornecedor fornecedor = fornecedorOpt.get();
        fornecedor.setStatus(novoStatus);

        return fornecedorRepository.save(fornecedor);
    }

    public List<Fornecedor> findAtivos() {
        return fornecedorRepository.findByStatus(Fornecedor.Status.ATIVO, null).getContent();
    }

    public List<Fornecedor> findInativos() {
        return fornecedorRepository.findByStatus(Fornecedor.Status.INATIVO, null).getContent();
    }
}