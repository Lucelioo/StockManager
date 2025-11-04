package com.stockmanager.controller;

import com.stockmanager.model.Produto;
import com.stockmanager.service.ProdutoService;
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
@RequestMapping("/produtos")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "nome") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String status) {

        try {
            Page<Produto> produtos = produtoService.findAll(page, size, sortBy, sortDir, nome, categoria, status);

            Map<String, Object> response = new HashMap<>();
            response.put("content", produtos.getContent());
            response.put("totalElements", produtos.getTotalElements());
            response.put("totalPages", produtos.getTotalPages());
            response.put("size", produtos.getSize());
            response.put("number", produtos.getNumber());
            response.put("first", produtos.isFirst());
            response.put("last", produtos.isLast());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erro ao buscar produtos: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Produto> findById(@PathVariable Long id) {
        Optional<Produto> produto = produtoService.findById(id);
        return produto.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/codigo/{codigo}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Produto> findByCodigo(@PathVariable String codigo) {
        Optional<Produto> produto = produtoService.findByCodigo(codigo);
        return produto.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> create(@RequestBody Produto produto) {
        try {
            produto.setId(null); // Garantir que é um novo produto
            Produto savedProduto = produtoService.save(produto);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Produto criado com sucesso");
            response.put("data", savedProduto);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody Produto produto) {
        try {
            Optional<Produto> existingProduto = produtoService.findById(id);
            if (existingProduto.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Produto não encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            produto.setId(id);
            Produto updatedProduto = produtoService.save(produto);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Produto atualizado com sucesso");
            response.put("data", updatedProduto);

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
            Optional<Produto> produto = produtoService.findById(id);
            if (produto.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Produto não encontrado");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            produtoService.deleteById(id);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Produto excluído com sucesso");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erro ao excluir produto: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/categorias")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<String>> findAllCategorias() {
        List<String> categorias = produtoService.findAllCategorias();
        return ResponseEntity.ok(categorias);
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProdutos", produtoService.countTotal());
        stats.put("produtosEsgotados", produtoService.countEsgotados());
        stats.put("produtosEstoqueBaixo", produtoService.countEstoqueBaixo());
        stats.put("valorTotalEstoque", produtoService.getValorTotalEstoque());

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/estoque-baixo")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Produto>> findByEstoqueBaixo() {
        List<Produto> produtos = produtoService.findByEstoqueBaixo();
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/categoria/{categoria}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Produto>> findByCategoria(@PathVariable String categoria) {
        List<Produto> produtos = produtoService.findByCategoria(categoria);
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Page<Produto>> search(
            @RequestParam String nome,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Produto> produtos = produtoService.findByNome(nome, page, size);
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/export")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> export(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String status) {

        try {
            Page<Produto> produtos = produtoService.findAll(0, Integer.MAX_VALUE, "nome", "asc", nome, categoria, status);

            Map<String, Object> response = new HashMap<>();
            response.put("data", produtos.getContent());
            response.put("total", produtos.getTotalElements());
            response.put("filename", "produtos_" + System.currentTimeMillis() + ".json");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erro ao exportar produtos: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}