package com.stockmanager.repository;

import com.stockmanager.model.Fornecedor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FornecedorRepository extends JpaRepository<Fornecedor, Long> {

    Optional<Fornecedor> findByCnpj(String cnpj);

    boolean existsByCnpj(String cnpj);

    Page<Fornecedor> findByNomeContainingIgnoreCase(String nome, Pageable pageable);

    Page<Fornecedor> findByStatus(Fornecedor.Status status, Pageable pageable);

    @Query("SELECT f FROM Fornecedor f WHERE " +
           "(:nome IS NULL OR LOWER(f.nome) LIKE LOWER(CONCAT('%', :nome, '%'))) AND " +
           "(:cnpj IS NULL OR f.cnpj LIKE CONCAT('%', :cnpj, '%')) AND " +
           "(:status IS NULL OR f.status = :status)")
    Page<Fornecedor> findByFilters(@Param("nome") String nome,
                                   @Param("cnpj") String cnpj,
                                   @Param("status") Fornecedor.Status status,
                                   Pageable pageable);

    @Query("SELECT COUNT(f) FROM Fornecedor f WHERE f.status = :status")
    Long countByStatus(@Param("status") Fornecedor.Status status);
}