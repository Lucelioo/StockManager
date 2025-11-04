import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, PaginatedResponse } from '@/types/common';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor para adicionar token JWT
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('accessToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor para tratar erros 401
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.client.post('/auth/refresh', {
                refreshToken,
              });

              const { accessToken } = response.data;
              localStorage.setItem('accessToken', accessToken);

              // Retentar a requisição original
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh token inválido, fazer logout
            if (typeof window !== 'undefined') {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              window.location.href = '/login';
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async handleResponse<T>(response: AxiosResponse): Promise<ApiResponse<T>> {
    try {
      const data = response.data;
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro ao processar resposta',
      };
    }
  }

  private async handleError(error: any): Promise<ApiResponse<any>> {
    if (error.response) {
      // Erro de resposta da API
      const status = error.response.status;
      const message = error.response.data?.message || this.getDefaultErrorMessage(status);

      return {
        success: false,
        error: message,
      };
    } else if (error.request) {
      // Erro de rede
      return {
        success: false,
        error: 'Erro de conexão. Verifique sua internet.',
      };
    } else {
      // Erro de configuração
      return {
        success: false,
        error: 'Erro ao configurar requisição.',
      };
    }
  }

  private getDefaultErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Requisição inválida.';
      case 401:
        return 'Não autorizado. Faça login novamente.';
      case 403:
        return 'Acesso negado.';
      case 404:
        return 'Recurso não encontrado.';
      case 409:
        return 'Conflito de dados.';
      case 422:
        return 'Dados inválidos.';
      case 500:
        return 'Erro interno do servidor.';
      default:
        return 'Ocorreu um erro. Tente novamente.';
    }
  }

  // Métodos HTTP genéricos
  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get(url, { params });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post(url, data);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put(url, data);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete(url);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Métodos para paginação
  async getPaginated<T>(url: string, params?: any): Promise<ApiResponse<PaginatedResponse<T>>> {
    try {
      const response = await this.client.get(url, { params });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Métodos para upload de arquivos
  async upload<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await this.client.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });

      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Métodos para download de arquivos
  async download(url: string, filename?: string): Promise<void> {
    try {
      const response = await this.client.get(url, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      throw error;
    }
  }

  // Método de logout
  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout');
    } catch (error) {
      // Ignora erro no logout, apenas limpa tokens
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
  }
}

export const apiClient = new ApiClient();