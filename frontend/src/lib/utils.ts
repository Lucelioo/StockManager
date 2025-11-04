import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Formatação de datas
export const formatDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    return String(date);
  }
};

export const formatDateTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'dd/MM/yyyy HH:mm:ss', { locale: ptBR });
  } catch (error) {
    return String(date);
  }
};

export const formatDateTimeShort = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  } catch (error) {
    return String(date);
  }
};

// Formatação de moeda (Real Brasileiro)
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Formatação de números
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

// Parse de moeda
export const parseCurrency = (value: string): number => {
  if (!value) return 0;

  // Remove R$, espaços e outros caracteres não numéricos, exceto vírgula
  const cleanValue = value
    .replace(/R\$\s*/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.');

  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
};

// Validação de CNPJ
export const validateCNPJ = (cnpj: string): boolean => {
  const cleanCNPJ = cnpj.replace(/[^\d]/g, '');

  if (cleanCNPJ.length !== 14) return false;

  // Elimina CNPJs conhecidos como inválidos
  const invalidCNPJs = [
    '00000000000000', '11111111111111', '22222222222222',
    '33333333333333', '44444444444444', '55555555555555',
    '66666666666666', '77777777777777', '88888888888888',
    '99999999999999'
  ];

  if (invalidCNPJs.includes(cleanCNPJ)) return false;

  // Valida DVs
  let tamanho = cleanCNPJ.length - 2;
  let numeros = cleanCNPJ.substring(0, tamanho);
  let digitos = cleanCNPJ.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  tamanho = tamanho + 1;
  numeros = cleanCNPJ.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;

  return true;
};

// Formatação de CNPJ
export const formatCNPJ = (cnpj: string): string => {
  const cleanCNPJ = cnpj.replace(/[^\d]/g, '');

  if (cleanCNPJ.length !== 14) return cnpj;

  return cleanCNPJ.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    '$1.$2.$3/$4-$5'
  );
};

// Validação de email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Formatação de telefone
export const formatPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/[^\d]/g, '');

  if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  return phone;
};

// Formatação de CEP
export const formatCEP = (cep: string): string => {
  const cleanCEP = cep.replace(/[^\d]/g, '');

  if (cleanCEP.length === 8) {
    return cleanCEP.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  return cep;
};

// Status de estoque
export const getStockStatus = (stock: number, minStock: number): {
  status: 'NORMAL' | 'BAIXO' | 'ESGOTADO';
  color: string;
  label: string;
} => {
  if (stock === 0) {
    return {
      status: 'ESGOTADO',
      color: 'danger',
      label: 'Esgotado'
    };
  }

  if (stock <= minStock) {
    return {
      status: 'BAIXO',
      color: 'warning',
      label: 'Baixo'
    };
  }

  return {
    status: 'NORMAL',
    color: 'success',
    label: 'Normal'
  };
};

// Geração de cores para gráficos
export const generateChartColors = (count: number): string[] => {
  const colors = [
    '#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1',
    '#fd7e14', '#20c997', '#6c757d', '#e83e8c', '#17a2b8',
    '#343a40', '#007bff', '#28a745', '#ffc107', '#dc3545'
  ];

  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};

// Download de dados como CSV
export const downloadCSV = (data: any[], filename: string): void => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escapa valores com vírgulas ou aspas
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Download de dados como JSON
export const downloadJSON = (data: any, filename: string): void => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Debounce para inputs
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Tratamento de erros
export const handleApiError = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.response?.status) {
    const status = error.response.status;
    switch (status) {
      case 400: return 'Requisição inválida';
      case 401: return 'Não autorizado';
      case 403: return 'Acesso negado';
      case 404: return 'Recurso não encontrado';
      case 409: return 'Conflito de dados';
      case 422: return 'Dados inválidos';
      case 500: return 'Erro interno do servidor';
      default: return 'Ocorreu um erro inesperado';
    }
  }

  return 'Ocorreu um erro inesperado';
};

// Geração de ID único
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Capitalização de strings
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Truncamento de texto
export const truncate = (str: string, length: number, suffix: string = '...'): string => {
  if (str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
};