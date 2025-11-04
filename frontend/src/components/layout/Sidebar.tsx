'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: 'bi-speedometer2',
    },
    {
      href: '/produtos',
      label: 'Produtos',
      icon: 'bi-box',
    },
    {
      href: '/fornecedores',
      label: 'Fornecedores',
      icon: 'bi-people',
    },
    {
      href: '/movimentacoes',
      label: 'Movimentações',
      icon: 'bi-arrow-left-right',
    },
    {
      href: '/historico',
      label: 'Histórico',
      icon: 'bi-clock-history',
    },
    {
      href: '/configuracoes',
      label: 'Configurações',
      icon: 'bi-gear',
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="d-md-none overlay position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 999 }}
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'show' : ''} d-md-block`}>
        <div className="sidebar-header">
          <Link href="/dashboard" className="sidebar-logo">
            <i className="bi bi-box-seam"></i>
            <span>StockManager</span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <ul className="list-unstyled m-0">
            {menuItems.map((item) => (
              <li key={item.href} className="nav-item">
                <Link
                  href={item.href}
                  className={`nav-link ${
                    pathname === item.href ? 'active' : ''
                  }`}
                  onClick={() => {
                    // Close sidebar on mobile after navigation
                    if (window.innerWidth < 768) {
                      onToggle();
                    }
                  }}
                >
                  <i className={`bi ${item.icon}`}></i>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User info in sidebar */}
        <div className="sidebar-footer mt-auto p-3 border-top border-white border-opacity-10">
          <div className="d-flex align-items-center">
            <div className="flex-shrink-0">
              <div
                className="rounded-circle bg-white bg-opacity-20 d-flex align-items-center justify-content-center"
                style={{ width: '40px', height: '40px' }}
              >
                <i className="bi bi-person-fill text-white"></i>
              </div>
            </div>
            <div className="flex-grow-1 ms-3">
              <div className="fw-semibold text-white">Usuário</div>
              <div className="small text-white text-opacity-75">Administrador</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}