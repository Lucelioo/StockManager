'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/lib/utils';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.username, formData.password);
      // Login successful, router will redirect in useAuth hook
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient"
         style={{
           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
         }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0 animate__animated animate__fadeInUp"
                 style={{ borderRadius: '16px' }}>
              <div className="card-body p-5">
                {/* Logo and Title */}
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <i className="bi bi-box-seam text-primary" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h2 className="fw-bold text-dark mb-2">StockManager</h2>
                  <p className="text-muted">Sistema de Gerenciamento de Estoque</p>
                </div>

                {/* Alert */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setError('')}
                    ></button>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="username" className="form-label fw-semibold">
                      Usuário
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-person text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Digite seu usuário"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">
                      Senha
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lock text-muted"></i>
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control border-start-0 border-end-0"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Digite sua senha"
                        required
                      />
                      <button
                        type="button"
                        className="input-group-text bg-light border-start-0"
                        onClick={togglePasswordVisibility}
                        tabIndex={-1}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="d-grid mb-4">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg fw-semibold"
                      disabled={isLoading}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none'
                      }}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Entrando...
                        </>
                      ) : (
                        'Entrar'
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      className="btn btn-link text-muted text-decoration-none"
                      onClick={() => alert('Funcionalidade de recuperação de senha será implementada em breve!')}
                    >
                      <small>Esqueceu sua senha?</small>
                    </button>
                  </div>
                </form>

                {/* Demo Credentials */}
                <div className="alert alert-info mt-4 mb-0" role="alert">
                  <h6 className="alert-heading fw-semibold">
                    <i className="bi bi-info-circle me-2"></i>
                    Credenciais de Demonstração
                  </h6>
                  <hr />
                  <div className="small">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Usuário:</span>
                      <code>Lucelio</code>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Senha:</span>
                      <code>1234</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-4 text-white">
              <small className="text-white-50">
                © 2025 StockManager. Todos os direitos reservados.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}