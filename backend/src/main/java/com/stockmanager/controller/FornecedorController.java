package com.stockmanager.controller;

import com.stockmanager.model.Fornecedor;
import com.stockmanager.service.FornecedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/fornecedores")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class FornecedorController {

    @Autowired
    private FornecedorService fornecedorService;

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "nome") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String cnpj,
            @RequestParam(required = false) String status) {

        try {
            Page<Fornecedor> fornecedores = fornecedorService.findAll(page, size, sortBy, sortDir, nome, cnpj, status);

            Map<String, Object> response = new HashMap<>();
            response.put("content", fornecedores.getContent());
            response.put("totalElements", fornecedores.getTotalElements());
            response.put("totalPages", fornecedores.getTotalPages());
            response.put("size", fornecedores.getSize());
            response.put("number", fornecedores.getNumber());
            response.put("first", fornecedores.isFirst());
            response.put("last", fornecedores.isLast());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erro ao buscar fornecedores: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Fornecedor> findById(@PathVariable Long id) {
        Optional<Fornecedor> fornecedor = fornecedorService.findById(id);
        return fornecedor.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cnpj/{cnpj}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Fornecedor> findByCnpj(@PathVariable String cnpj) {
        Optional<Fornecedor> fornecedor = fornecedorService.findByCnpj(cnpj);
        return fornecedor.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> create(@RequestBody Fornecedor fornecedor) {
        try {
            Fornecedor savedFornecedor = fornecedorService.save(fornecedor);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Fornecedor criado com sucesso");
            response.put("data", savedFornecedor);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody Fornecedor fornecedor) {
        try {
            Optional<Fornecedor> existingFornecedor = fornecedorService.findById(id);
            if (existingFornecedor.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Fornecedor não encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            fornecedor.setId(id);
            Fornecedor updatedFornecedor = fornecedorService.save(fornecedor);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Fornecedor atualizado com sucesso");
            response.put("data", updatedFornecedor);

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
            Optional<Fornecedor> fornecedor = fornecedorService.findById(id);
            if (fornecedor.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Fornecedor não encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            fornecedorService.deleteById(id);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Fornecedor excluído com sucesso");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erro ao excluir fornecedor: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalFornecedores", fornecedorService.countTotal());
        stats.put("fornecedoresAtivos", fornecedorService.countByStatus(Fornecedor.Status.ATIVO));
        stats.put("fornecedoresInativos", fornecedorService.countByStatus(Fornecedor.Status.INATIVO));

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/ativos")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Fornecedor>> findAtivos() {
        List<Fornecedor> fornecedores = fornecedorService.findAtivos();
        return ResponseEntity.ok(fornecedores);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Page<Fornecedor>> search(
            @RequestParam String nome,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Fornecedor> fornecedores = fornecedorService.findByNome(nome, page, size);
        return ResponseEntity.ok(fornecedores);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            Fornecedor.Status novoStatus = Fornecedor.Status.valueOf(status);
            Fornecedor fornecedor = fornecedorService.atualizarStatus(id, novoStatus);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Status atualizado com sucesso");
            response.put("data", fornecedor);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}