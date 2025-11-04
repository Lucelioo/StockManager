'use client';

import { useState } from 'react';
import { useRequireAuth } from '@/hooks/useAuth';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoading } = useRequireAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-3"></div>
          <p className="text-muted">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <main className={`main-content ${sidebarOpen ? 'expanded' : ''}`}>
        <Header onMenuToggle={toggleSidebar} pageTitle={title} />

        <div className="p-4">
          <div className="fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}