'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { ApiResponse, PaginatedResponse } from '@/types/common';

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T = any>(
  apiCall: (...args: any[]) => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall(...args);

      if (response.success && response.data !== undefined) {
        setData(response.data);
        options.onSuccess?.(response.data);
        return response.data;
      } else {
        const errorMessage = response.error || 'Erro desconhecido';
        setError(errorMessage);
        options.onError?.(errorMessage);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro inesperado';
      setError(errorMessage);
      options.onError?.(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiCall, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

// Hook para paginação
export function usePagination<T = any>(
  apiCall: (page: number, size: number, filters?: any) => Promise<ApiResponse<PaginatedResponse<T>>>,
  initialPage: number = 0,
  initialSize: number = 10
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: initialPage,
    size: initialSize,
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: true,
  });

  const loadPage = useCallback(async (page: number = pagination.page, filters?: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall(page, pagination.size, filters);

      if (response.success && response.data) {
        setData(response.data.content);
        setPagination(prev => ({
          ...prev,
          page: response.data!.number,
          totalPages: response.data!.totalPages,
          totalElements: response.data!.totalElements,
          first: response.data!.first,
          last: response.data!.last,
        }));
      } else {
        const errorMessage = response.error || 'Erro ao carregar dados';
        setError(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro inesperado';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiCall, pagination.page, pagination.size]);

  const changePage = useCallback((newPage: number) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      loadPage(newPage);
    }
  }, [loadPage, pagination.totalPages]);

  const changePageSize = useCallback((newSize: number) => {
    setPagination(prev => ({
      ...prev,
      size: newSize,
      page: 0,
    }));
  }, []);

  const refresh = useCallback(() => {
    loadPage(pagination.page);
  }, [loadPage, pagination.page]);

  const reset = useCallback(() => {
    setData([]);
    setError(null);
    setPagination(prev => ({
      ...prev,
      page: initialPage,
      totalPages: 0,
      totalElements: 0,
      first: true,
      last: true,
    }));
  }, [initialPage]);

  return {
    data,
    loading,
    error,
    pagination,
    loadPage,
    changePage,
    changePageSize,
    refresh,
    reset,
  };
}

// Hook para debounce em buscas
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook para notificações toast
export function useToast() {
  const showSuccess = useCallback((message: string) => {
    // Implementar toast de sucesso
    alert(`Sucesso: ${message}`);
  }, []);

  const showError = useCallback((message: string) => {
    // Implementar toast de erro
    alert(`Erro: ${message}`);
  }, []);

  const showWarning = useCallback((message: string) => {
    // Implementar toast de aviso
    alert(`Aviso: ${message}`);
  }, []);

  const showInfo = useCallback((message: string) => {
    // Implementar toast informativo
    alert(`Info: ${message}`);
  }, []);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}

// Hook para localStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erro ao ler localStorage chave "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Erro ao salvar localStorage chave "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);

      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Erro ao remover localStorage chave "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}