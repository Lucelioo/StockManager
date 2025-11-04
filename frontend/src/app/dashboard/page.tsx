'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { apiClient } from '@/lib/api';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface DashboardStats {
  totalProdutos: number;
  totalFornecedores: number;
  totalMovimentacoesHoje: number;
  produtosBaixoEstoque: number;
  valorTotalEstoque: number;
  recentMovimentacoes: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load products stats
      const productStatsResponse = await apiClient.get('/produtos/stats');

      if (productStatsResponse.success && productStatsResponse.data) {
        const productData = productStatsResponse.data;

        setStats({
          totalProdutos: productData.totalProdutos || 0,
          totalFornecedores: 12, // Mock data - implement when fornecedor API is ready
          totalMovimentacoesHoje: 8, // Mock data - implement when movimentacao API is ready
          produtosBaixoEstoque: productData.produtosEstoqueBaixo || 0,
          valorTotalEstoque: productData.valorTotalEstoque || 0,
          recentMovimentacoes: [] // Mock data - implement when movimentacao API is ready
        });
      }
    } catch (error) {
      setError('Erro ao carregar dados do dashboard');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total de Produtos',
      value: formatNumber(stats?.totalProdutos || 0),
      icon: 'bi-box',
      color: 'primary',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Fornecedores',
      value: formatNumber(stats?.totalFornecedores || 0),
      icon: 'bi-people',
      color: 'success',
      change: '+2',
      changeType: 'positive'
    },
    {
      title: 'Movimentações Hoje',
      value: formatNumber(stats?.totalMovimentacoesHoje || 0),
      icon: 'bi-arrow-left-right',
      color: 'info',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Estoque Baixo',
      value: formatNumber(stats?.produtosBaixoEstoque || 0),
      icon: 'bi-exclamation-triangle',
      color: 'warning',
      change: '-3',
      changeType: 'negative'
    }
  ];

  const quickActions = [
    {
      title: 'Novo Produto',
      icon: 'bi-plus-circle',
      color: 'primary',
      href: '/produtos?action=novo'
    },
    {
      title: 'Nova Entrada',
      icon: 'bi-box-arrow-in-down',
      color: 'success',
      href: '/movimentacoes?action=entrada'
    },
    {
      title: 'Nova Saída',
      icon: 'bi-box-arrow-up',
      color: 'danger',
      href: '/movimentacoes?action=saida'
    },
    {
      title: 'Novo Fornecedor',
      icon: 'bi-person-plus',
      color: 'info',
      href: '/fornecedores?action=novo'
    }
  ];

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="text-center py-5">
          <div className="loading-spinner mx-auto mb-3"></div>
          <p className="text-muted">Carregando dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      {/* Welcome Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="bg-white rounded-3 p-4 shadow-sm">
            <h2 className="h4 fw-bold text-dark mb-2">
              Bem-vindo ao StockManager
            </h2>
            <p className="text-muted mb-0">
              Gerencie seu estoque de forma simples e eficiente.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        {statCards.map((card, index) => (
          <div key={index} className="col-md-6 col-lg-3 mb-3">
            <div className="stat-card">
              <div className="stat-card-header">
                <div className="stat-card-title">{card.title}</div>
                <div className={`stat-card-icon bg-${card.color} bg-opacity-10 text-${card.color}`}>
                  <i className={`bi ${card.icon}`}></i>
                </div>
              </div>
              <div className="stat-card-value">{card.value}</div>
              <div className={`stat-card-change ${
                card.changeType === 'positive' ? 'text-success' : 'text-danger'
              }`}>
                <i className={`bi bi-${card.changeType === 'positive' ? 'arrow-up' : 'arrow-down'} me-1`}></i>
                {card.change} vs mês anterior
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        {/* Quick Actions */}
        <div className="col-lg-4 mb-4">
          <div className="bg-white rounded-3 p-4 shadow-sm h-100">
            <h3 className="h5 fw-bold text-dark mb-4">
              <i className="bi bi-lightning-charge text-warning me-2"></i>
              Ações Rápidas
            </h3>
            <div className="row g-3">
              {quickActions.map((action, index) => (
                <div key={index} className="col-6">
                  <a
                    href={action.href}
                    className="btn btn-outline-secondary d-flex flex-column align-items-center p-3 h-100 text-decoration-none"
                  >
                    <i className={`bi ${action.icon} fs-4 mb-2 text-${action.color}`}></i>
                    <span className="small text-center">{action.title}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stock Value Card */}
        <div className="col-lg-8 mb-4">
          <div className="bg-white rounded-3 p-4 shadow-sm h-100">
            <h3 className="h5 fw-bold text-dark mb-4">
              <i className="bi bi-graph-up text-success me-2"></i>
              Valor Total em Estoque
            </h3>
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="display-4 fw-bold text-success">
                  {formatCurrency(stats?.valorTotalEstoque || 0)}
                </div>
                <p className="text-muted mb-0">
                  Valor total de todos os produtos em estoque
                </p>
              </div>
              <div className="text-center">
                <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center"
                     style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-currency-dollar text-success fs-1"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities and Charts Row */}
      <div className="row">
        {/* Recent Activities */}
        <div className="col-lg-6 mb-4">
          <div className="bg-white rounded-3 shadow-sm">
            <div className="p-4 border-bottom">
              <h3 className="h5 fw-bold text-dark mb-0">
                <i className="bi bi-clock-history text-info me-2"></i>
                Atividades Recentes
              </h3>
            </div>
            <div className="p-4">
              {stats?.recentMovimentacoes && stats.recentMovimentacoes.length > 0 ? (
                <div className="list-group list-group-flush">
                  {stats.recentMovimentacoes.map((activity, index) => (
                    <div key={index} className="list-group-item px-0">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <div className={`rounded-circle d-flex align-items-center justify-content-center ${
                            activity.tipo === 'ENTRADA' ? 'bg-success' : 'bg-danger'
                          } bg-opacity-10`} style={{ width: '32px', height: '32px' }}>
                            <i className={`bi bi-${activity.tipo === 'ENTRADA' ? 'arrow-down' : 'arrow-up'} ${
                              activity.tipo === 'ENTRADA' ? 'text-success' : 'text-danger'
                            }`}></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <div className="fw-semibold">{activity.produto?.nome}</div>
                          <small className="text-muted">
                            {activity.tipo === 'ENTRADA' ? 'Entrada' : 'Saída'} de {activity.quantidade} unidades
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-inbox text-muted fs-1"></i>
                  <p className="text-muted mb-0">Nenhuma atividade recente</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="col-lg-6 mb-4">
          <div className="bg-white rounded-3 shadow-sm">
            <div className="p-4 border-bottom">
              <h3 className="h5 fw-bold text-dark mb-0">
                <i className="bi bi-graph-up-arrow text-primary me-2"></i>
                Tendências do Estoque
              </h3>
            </div>
            <div className="p-4">
              <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                <div className="text-center">
                  <i className="bi bi-bar-chart text-muted fs-1"></i>
                  <p className="text-muted mb-0">Gráfico de tendências será implementado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}