package com.stockmanager.util;

public class CnpjValidator {

    public static boolean isValid(String cnpj) {
        cnpj = cnpj.replaceAll("[^\\d]", "");

        if (cnpj.length() != 14) return false;

        // Elimina CNPJs conhecidos como inválidos
        if (cnpj.equals("00000000000000") ||
            cnpj.equals("11111111111111") ||
            cnpj.equals("22222222222222") ||
            cnpj.equals("33333333333333") ||
            cnpj.equals("44444444444444") ||
            cnpj.equals("55555555555555") ||
            cnpj.equals("66666666666666") ||
            cnpj.equals("77777777777777") ||
            cnpj.equals("88888888888888") ||
            cnpj.equals("99999999999999"))
            return false;

        // Valida DVs
        int tamanho = cnpj.length() - 2;
        String numeros = cnpj.substring(0, tamanho);
        String digitos = cnpj.substring(tamanho);
        int soma = 0;
        int pos = tamanho - 7;

        for (int i = tamanho; i >= 1; i--) {
            soma += Integer.parseInt(numeros.charAt(tamanho - i) + "") * pos--;
            if (pos < 2) pos = 9;
        }

        int resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != Integer.parseInt(digitos.charAt(0) + "")) return false;

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;

        for (int i = tamanho; i >= 1; i--) {
            soma += Integer.parseInt(numeros.charAt(tamanho - i) + "") * pos--;
            if (pos < 2) pos = 9;
        }

        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != Integer.parseInt(digitos.charAt(1) + "")) return false;

        return true;
    }

    public static String format(String cnpj) {
        if (cnpj == null || cnpj.length() != 14) return cnpj;

        return cnpj.replaceAll("(\\d{2})(\\d{3})(\\d{3})(\\d{4})(\\d{2})", "$1.$2.$3/$4-$5");
    }

    public static String unformat(String cnpj) {
        return cnpj.replaceAll("[^\\d]", "");
    }
}