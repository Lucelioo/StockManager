package com.stockmanager.util;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class CepService {

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, String> buscarEnderecoPorCep(String cep) {
        try {
            String url = "https://viacep.com.br/ws/" + cep + "/json/";
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response != null && !response.containsKey("erro")) {
                Map<String, String> endereco = new HashMap<>();
                endereco.put("logradouro", (String) response.get("logradouro"));
                endereco.put("bairro", (String) response.get("bairro"));
                endereco.put("localidade", (String) response.get("localidade"));
                endereco.put("uf", (String) response.get("uf"));
                endereco.put("complemento", (String) response.get("complemento"));
                return endereco;
            }
        } catch (Exception e) {
            // Log erro em ambiente de produção
            System.err.println("Erro ao buscar CEP: " + e.getMessage());
        }

        return null;
    }

    public static String format(String cep) {
        if (cep == null || cep.length() != 8) return cep;

        return cep.replaceAll("(\\d{5})(\\d{3})", "$1-$2");
    }

    public static String unformat(String cep) {
        return cep.replaceAll("[^\\d]", "");
    }
}