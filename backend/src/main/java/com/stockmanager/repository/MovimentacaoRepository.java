package com.stockmanager.repository;

import com.stockmanager.model.Movimentacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MovimentacaoRepository extends JpaRepository<Movimentacao, Long> {

    Page<Movimentacao> findByTipo(Movimentacao.Tipo tipo, Pageable pageable);

    Page<Movimentacao> findByProdutoId(Long produtoId, Pageable pageable);

    @Query("SELECT m FROM Movimentacao m WHERE " +
           "(:busca IS NULL OR " +
           "  LOWER(m.produto.nome) LIKE LOWER(CONCAT('%', :busca, '%')) OR " +
           "  LOWER(m.fornecedorCliente) LIKE LOWER(CONCAT('%', :busca, '%')) OR " +
           "  LOWER(m.responsavel) LIKE LOWER(CONCAT('%', :busca, '%')) OR " +
           "  LOWER(m.observacoes) LIKE LOWER(CONCAT('%', :busca, '%')) OR " +
           "  CAST(m.id AS string) LIKE CONCAT('%', :busca, '%')) AND " +
           "(:tipo IS NULL OR m.tipo = :tipo) AND " +
           "(:produtoId IS NULL OR m.produto.id = :produtoId) AND " +
           "(:dataInicial IS NULL OR DATE(m.dataHora) >= DATE(:dataInicial)) AND " +
           "(:dataFinal IS NULL OR DATE(m.dataHora) <= DATE(:dataFinal))")
    Page<Movimentacao> findByFilters(@Param("busca") String busca,
                                     @Param("tipo") Movimentacao.Tipo tipo,
                                     @Param("produtoId") Long produtoId,
                                     @Param("dataInicial") LocalDateTime dataInicial,
                                     @Param("dataFinal") LocalDateTime dataFinal,
                                     Pageable pageable);

    @Query("SELECT COUNT(m) FROM Movimentacao m WHERE m.tipo = :tipo")
    Long countByTipo(@Param("tipo") Movimentacao.Tipo tipo);

    @Query("SELECT COUNT(m) FROM Movimentacao m WHERE DATE(m.dataHora) = CURRENT_DATE")
    Long countToday();

    @Query("SELECT SUM(m.valorTotal) FROM Movimentacao m")
    Double sumValorTotal();

    @Query("SELECT SUM(m.quantidade) FROM Movimentacao m WHERE m.tipo = :tipo")
    Long sumQuantidadeByTipo(@Param("tipo") Movimentacao.Tipo tipo);

    List<Movimentacao> findTop10ByOrderByDataHoraDesc();
}