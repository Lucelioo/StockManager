'use client';

import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onMenuToggle: () => void;
  pageTitle: string;
}

export default function Header({ onMenuToggle, pageTitle }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="d-flex align-items-center">
          <button
            className="mobile-menu-toggle me-3"
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            <i className="bi bi-list"></i>
          </button>
          <h1 className="h5 mb-0 me-4">{pageTitle}</h1>
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Notifications */}
          <div className="dropdown">
            <button
              className="btn btn-link text-dark position-relative p-2"
              type="button"
              id="notificationDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-bell fs-5"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
                <span className="visually-hidden">notificações não lidas</span>
              </span>
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="notificationDropdown"
              style={{ width: '300px' }}
            >
              <li className="dropdown-header">Notificações</li>
              <li><hr className="dropdown-divider" /></li>
              <li className="dropdown-item">
                <div className="d-flex">
                  <div className="flex-shrink-0">
                    <i className="bi bi-exclamation-triangle-fill text-warning"></i>
                  </div>
                  <div className="flex-grow-1 ms-2">
                    <small className="text-muted">Estoque baixo</small>
                    <div className="small">Notebook Dell Inspiring está com estoque baixo</div>
                  </div>
                </div>
              </li>
              <li className="dropdown-item">
                <div className="d-flex">
                  <div className="flex-shrink-0">
                    <i className="bi bi-check-circle-fill text-success"></i>
                  </div>
                  <div className="flex-grow-1 ms-2">
                    <small className="text-muted">Nova entrada</small>
                    <div className="small">50 unidades de Mouse Logitech recebidas</div>
                  </div>
                </div>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <a className="dropdown-item text-center text-primary" href="#">
                  Ver todas as notificações
                </a>
              </li>
            </ul>
          </div>

          {/* User Menu */}
          <div className="dropdown">
            <button
              className="btn btn-link text-dark d-flex align-items-center gap-2 p-2"
              type="button"
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div
                className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                style={{ width: '32px', height: '32px' }}
              >
                <i className="bi bi-person-fill text-primary"></i>
              </div>
              <span className="d-none d-md-inline">{user?.nomeCompleto || user?.username}</span>
              <i className="bi bi-chevron-down small"></i>
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="userDropdown"
            >
              <li className="dropdown-header">
                {user?.nomeCompleto || user?.username}
                <br />
                <small className="text-muted">{user?.email}</small>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <a className="dropdown-item" href="/configuracoes">
                  <i className="bi bi-gear me-2"></i>
                  Configurações
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  <i className="bi bi-person me-2"></i>
                  Meu Perfil
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  <i className="bi bi-question-circle me-2"></i>
                  Ajuda
                </a>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={logout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Sair
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}