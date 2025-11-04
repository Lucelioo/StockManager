'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authService } from '@/lib/auth';
import { UserInfoResponse } from '@/types/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: UserInfoResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserInfoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof window !== 'undefined') {
          const currentUser = authService.getUser();
          if (currentUser && authService.isAuthenticated()) {
            setUser(currentUser);
          } else {
            // Tenta refresh token se existir
            const refreshed = await authService.refreshToken();
            if (refreshed) {
              setUser(refreshed.userInfo);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.login({ username, password });
      setUser(response.userInfo);
      router.push('/dashboard');
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, limpa autenticação localmente
      setUser(null);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        // Atualiza também no localStorage
        localStorage.setItem('user', JSON.stringify(currentUser));
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

// Hook para proteger rotas
export function useRequireAuth() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading, user };
}

// Hook para verificar permissões de admin
export function useRequireAdmin() {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/dashboard');
    }
  }, [isAdmin, isLoading, router]);

  return { isAdmin, isLoading };
}