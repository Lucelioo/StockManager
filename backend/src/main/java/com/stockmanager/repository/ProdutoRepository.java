package com.stockmanager.repository;

import com.stockmanager.model.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    Optional<Produto> findByCodigo(String codigo);

    boolean existsByCodigo(String codigo);

    Page<Produto> findByNomeContainingIgnoreCase(String nome, Pageable pageable);

    Page<Produto> findByCategoria(String categoria, Pageable pageable);

    Page<Produto> findByEstoqueLessThanEqual(Integer estoqueMaximo, Pageable pageable);

    @Query("SELECT p FROM Produto p WHERE " +
           "(:nome IS NULL OR LOWER(p.nome) LIKE LOWER(CONCAT('%', :nome, '%'))) AND " +
           "(:categoria IS NULL OR p.categoria = :categoria) AND " +
           "(:status IS NULL OR " +
           "  (:status = 'ESGOTADO' AND p.estoque = 0) OR " +
           "  (:status = 'BAIXO' AND p.estoque > 0 AND p.estoque <= p.estoqueMinimo) OR " +
           "  (:status = 'NORMAL' AND p.estoque > p.estoqueMinimo)" +
           ")")
    Page<Produto> findByFilters(@Param("nome") String nome,
                               @Param("categoria") String categoria,
                               @Param("status") String status,
                               Pageable pageable);

    @Query("SELECT COUNT(p) FROM Produto p WHERE p.estoque = 0")
    Long countEsgotados();

    @Query("SELECT COUNT(p) FROM Produto p WHERE p.estoque > 0 AND p.estoque <= p.estoqueMinimo")
    Long countEstoqueBaixo();

    @Query("SELECT SUM(p.estoque * p.preco) FROM Produto p")
    Double calcularValorTotalEstoque();

    List<String> findDistinctCategorias();
}