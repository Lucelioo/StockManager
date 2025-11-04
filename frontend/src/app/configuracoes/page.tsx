'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';

export default function ConfiguracoesPage() {
  return (
    <DashboardLayout title="Configurações">
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <i className="bi bi-gear text-secondary fs-1"></i>
          <h4 className="mt-3">Configurações do Sistema</h4>
          <p className="text-muted">Personalização e configurações da aplicação</p>
          <button className="btn btn-secondary">
            <i className="bi bi-gear-fill me-2"></i>
            Configurar
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}