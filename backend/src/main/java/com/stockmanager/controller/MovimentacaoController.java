package com.stockmanager.controller;

import com.stockmanager.model.Movimentacao;
import com.stockmanager.service.MovimentacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/movimentacoes")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class MovimentacaoController {

    @Autowired
    private MovimentacaoService movimentacaoService;

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dataHora") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String busca,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) Long produtoId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicial,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFinal) {

        try {
            Page<Movimentacao> movimentacoes = movimentacaoService.findAll(page, size, sortBy, sortDir, busca, tipo, produtoId, dataInicial, dataFinal);

            Map<String, Object> response = new HashMap<>();
            response.put("content", movimentacoes.getContent());
            response.put("totalElements", movimentacoes.getTotalElements());
            response.put("totalPages", movimentacoes.getTotalPages());
            response.put("size", movimentacoes.getSize());
            response.put("number", movimentacoes.getNumber());
            response.put("first", movimentacoes.isFirst());
            response.put("last", movimentacoes.isLast());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erro ao buscar movimentações: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Movimentacao> findById(@PathVariable Long id) {
        Optional<Movimentacao> movimentacao = movimentacaoService.findById(id);
        return movimentacao.map(ResponseEntity::ok)
                            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> create(@RequestBody Movimentacao movimentacao) {
        try {
            movimentacao.setId(null); // Garantir que é uma nova movimentação
            Movimentacao savedMovimentacao = movimentacaoService.save(movimentacao);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Movimentação registrada com sucesso");
            response.put("data", savedMovimentacao);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody Movimentacao movimentacao) {
        try {
            Optional<Movimentacao> existingMovimentacao = movimentacaoService.findById(id);
            if (existingMovimentacao.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Movimentação não encontrada");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            movimentacao.setId(id);
            Movimentacao updatedMovimentacao = movimentacaoService.save(movimentacao);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Movimentação atualizada com sucesso");
            response.put("data", updatedMovimentacao);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        try {
            Optional<Movimentacao> movimentacao = movimentacaoService.findById(id);
            if (movimentacao.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Movimentação não encontrada");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            movimentacaoService.deleteById(id);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Movimentação excluída com sucesso");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erro ao excluir movimentação: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEntradas", movimentacaoService.sumQuantidadeByTipo(Movimentacao.Tipo.ENTRADA));
        stats.put("totalSaidas", movimentacaoService.sumQuantidadeByTipo(Movimentacao.Tipo.SAIDA));
        stats.put("valorTotal", movimentacaoService.getValorTotal());
        stats.put("movimentacoesHoje", movimentacaoService.countToday());

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/recent")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Movimentacao>> findRecent() {
        List<Movimentacao> movimentacoes = movimentacaoService.findRecent();
        return ResponseEntity.ok(movimentacoes);
    }

    @GetMapping("/tipo/{tipo}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Page<Movimentacao>> findByTipo(
            @PathVariable String tipo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Movimentacao> movimentacoes = movimentacaoService.findByTipo(tipo, page, size);
        return ResponseEntity.ok(movimentacoes);
    }

    @GetMapping("/produto/{produtoId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Page<Movimentacao>> findByProdutoId(
            @PathVariable Long produtoId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Movimentacao> movimentacoes = movimentacaoService.findByProdutoId(produtoId, page, size);
        return ResponseEntity.ok(movimentacoes);
    }

    @GetMapping("/export")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> export(
            @RequestParam(required = false) String busca,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) Long produtoId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicial,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFinal) {

        try {
            Page<Movimentacao> movimentacoes = movimentacaoService.findAll(0, Integer.MAX_VALUE, "dataHora", "desc", busca, tipo, produtoId, dataInicial, dataFinal);

            Map<String, Object> response = new HashMap<>();
            response.put("data", movimentacoes.getContent());
            response.put("total", movimentacoes.getTotalElements());
            response.put("filename", "movimentacoes_" + System.currentTimeMillis() + ".csv");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erro ao exportar movimentações: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}