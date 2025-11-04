import { LoginRequest, LoginResponse, UserInfoResponse } from '@/types/auth';
import { apiClient } from './api';

class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly USER_KEY = 'user';

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);

    if (response.success && response.data) {
      this.setTokens(response.data);
      return response.data;
    } else {
      throw new Error(response.error || 'Erro ao fazer login');
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Ignora erro no logout do servidor
    } finally {
      this.clearTokens();
    }
  }

  async refreshToken(): Promise<LoginResponse | null> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return null;
    }

    try {
      const response = await apiClient.post<LoginResponse>('/auth/refresh', {
        refreshToken,
      });

      if (response.success && response.data) {
        this.setTokens(response.data);
        return response.data;
      }
    } catch (error) {
      // Erro no refresh, limpa tokens
      this.clearTokens();
    }

    return null;
  }

  async getCurrentUser(): Promise<UserInfoResponse | null> {
    try {
      const response = await apiClient.get<UserInfoResponse>('/auth/me');
      return response.success ? response.data || null : null;
    } catch (error) {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      // Decodifica o token JWT para verificar expiração
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;

      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getUser(): UserInfoResponse | null {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  private setTokens(data: LoginResponse): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem(this.ACCESS_TOKEN_KEY, data.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, data.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(data.userInfo));
  }

  private clearTokens(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Para compatibilidade com SSR
  getAuthHeaders(): Record<string, string> {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Verifica se o usuário tem determinada role
  hasRole(role: 'ADMIN' | 'USER'): boolean {
    const user = this.getUser();
    return user?.role === role;
  }

  // Verifica se o usuário é admin
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  // Formata informações do usuário para exibição
  getUserDisplayName(): string {
    const user = this.getUser();
    return user?.nomeCompleto || user?.username || 'Usuário';
  }

  getUserEmail(): string {
    const user = this.getUser();
    return user?.email || '';
  }

  // Método para ser usado em middleware de autenticação
  async requireAuth(): Promise<UserInfoResponse | null> {
    if (!this.isAuthenticated()) {
      const refreshed = await this.refreshToken();
      if (!refreshed) {
        return null;
      }
    }

    return this.getUser();
  }
}

export const authService = new AuthService();