package com.stockmanager.util;

import java.util.regex.Pattern;

public class ValidationUtils {

    private static final Pattern EMAIL_PATTERN =
        Pattern.compile("^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$");

    private static final Pattern TELEFONE_PATTERN =
        Pattern.compile("^\\d{10,11}$");

    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    public static boolean isValidTelefone(String telefone) {
        String telefoneLimpo = telefone != null ? telefone.replaceAll("[^\\d]", "") : "";
        return !telefoneLimpo.isEmpty() && TELEFONE_PATTERN.matcher(telefoneLimpo).matches();
    }

    public static String formatTelefone(String telefone) {
        if (telefone == null) return null;

        String telefoneLimpo = telefone.replaceAll("[^\\d]", "");

        if (telefoneLimpo.length() == 10) {
            return telefoneLimpo.replaceAll("(\\d{2})(\\d{4})(\\d{4})", "($1) $2-$3");
        } else if (telefoneLimpo.length() == 11) {
            return telefoneLimpo.replaceAll("(\\d{2})(\\d{5})(\\d{4})", "($1) $2-$3");
        }

        return telefone;
    }

    public static String formatCurrency(Double valor) {
        if (valor == null) return "R$ 0,00";
        return String.format("R$ %.2f", valor).replace(".", ",");
    }

    public static String formatInteger(Integer valor) {
        if (valor == null) return "0";
        return String.format("%d", valor);
    }

    public static Double parseCurrency(String valor) {
        if (valor == null || valor.trim().isEmpty()) return 0.0;

        String valorLimpo = valor.replaceAll("[^\\d,]", "");
        valorLimpo = valorLimpo.replace(",", ".");

        try {
            return Double.parseDouble(valorLimpo);
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    public static boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

    public static boolean isNotEmpty(String str) {
        return !isEmpty(str);
    }
}