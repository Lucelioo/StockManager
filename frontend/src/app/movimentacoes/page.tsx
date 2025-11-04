'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';

export default function MovimentacoesPage() {
  return (
    <DashboardLayout title="Movimentações">
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <i className="bi bi-arrow-left-right text-primary fs-1"></i>
          <h4 className="mt-3">Movimentações de Estoque</h4>
          <p className="text-muted">Gerenciamento de entradas e saídas de produtos</p>
          <button className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>
            Nova Movimentação
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}