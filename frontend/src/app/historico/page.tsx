'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';

export default function HistoricoPage() {
  return (
    <DashboardLayout title="Histórico">
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <i className="bi bi-clock-history text-info fs-1"></i>
          <h4 className="mt-3">Histórico de Relatórios</h4>
          <p className="text-muted">Visualização e geração de relatórios personalizados</p>
          <button className="btn btn-info">
            <i className="bi bi-file-earmark-text me-2"></i>
            Gerar Relatório
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}