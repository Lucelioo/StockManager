'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { apiClient } from '@/lib/api';
import { formatCurrency, getStockStatus, debounce } from '@/lib/utils';
import { Produto } from '@/types/produto';

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0
  });

  // Debounced search
  const debouncedSearch = debounce((term: string) => {
    loadProdutos(term, categoryFilter, statusFilter);
  }, 500);

  useEffect(() => {
    loadCategories();
    loadStats();
    loadProdutos();
  }, []);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    loadProdutos(searchTerm, categoryFilter, statusFilter);
  }, [categoryFilter, statusFilter]);

  const loadProdutos = async (search = '', category = '', status = '') => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      if (search) params.append('nome', search);
      if (category) params.append('categoria', category);
      if (status) params.append('status', status);
      params.append('size', '100'); // Load more for client-side filtering

      const response = await apiClient.get(`/produtos?${params}`);

      if (response.success && response.data) {
        setProdutos(response.data.content || []);
      }
    } catch (error) {
      setError('Erro ao carregar produtos');
      console.error('Products error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await apiClient.get('/produtos/categorias');
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Categories error:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiClient.get('/produtos/stats');
      if (response.success && response.data) {
        setStats({
          total: response.data.totalProdutos || 0,
          lowStock: response.data.produtosEstoqueBaixo || 0,
          outOfStock: response.data.produtosEsgotados || 0,
          totalValue: response.data.valorTotalEstoque || 0
        });
      }
    } catch (error) {
      console.error('Stats error:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('nome', searchTerm);
      if (categoryFilter) params.append('categoria', categoryFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await apiClient.get(`/produtos/export?${params}`);
      if (response.success && response.data) {
        // Create and download JSON file
        const dataStr = JSON.stringify(response.data.data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `produtos_${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);
      }
    } catch (error) {
      setError('Erro ao exportar produtos');
      console.error('Export error:', error);
    }
  };

  const handleDelete = async (id: number, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir o produto "${nome}"?`)) {
      return;
    }

    try {
      const response = await apiClient.delete(`/produtos/${id}`);
      if (response.success) {
        loadProdutos(searchTerm, categoryFilter, statusFilter);
        loadStats();
      } else {
        setError('Erro ao excluir produto');
      }
    } catch (error) {
      setError('Erro ao excluir produto');
      console.error('Delete error:', error);
    }
  };

  const renderProductRow = (produto: Produto) => {
    const stockStatus = getStockStatus(produto.estoque, produto.estoqueMinimo);

    return (
      <tr key={produto.id}>
        <td>
          <span className="fw-semibold">{produto.codigo}</span>
        </td>
        <td>
          <div>
            <div className="fw-semibold">{produto.nome}</div>
            {produto.descricao && (
              <small className="text-muted">{produto.descricao}</small>
            )}
          </div>
        </td>
        <td>
          <span className="badge bg-secondary">{produto.categoria}</span>
        </td>
        <td className="text-end">
          <span className="fw-semibold">{formatCurrency(produto.preco)}</span>
        </td>
        <td className="text-center">
          <span className="fw-semibold">{produto.estoque}</span>
        </td>
        <td className="text-center">
          <span className={`badge bg-${stockStatus.color}`}>
            {stockStatus.label}
          </span>
        </td>
        <td>
          <div className="btn-group" role="group">
            <button
              className="btn btn-sm btn-outline-primary"
              title="Visualizar"
              onClick={() => alert(`Visualizar produto: ${produto.nome}`)}
            >
              <i className="bi bi-eye"></i>
            </button>
            <button
              className="btn btn-sm btn-outline-warning"
              title="Editar"
              onClick={() => alert(`Editar produto: ${produto.nome}`)}
            >
              <i className="bi bi-pencil"></i>
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              title="Excluir"
              onClick={() => handleDelete(produto.id, produto.nome)}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <DashboardLayout title="Produtos">
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0">{stats.total}</h4>
                  <small>Total de Produtos</small>
                </div>
                <i className="bi bi-box fs-2"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0">{stats.lowStock}</h4>
                  <small>Estoque Baixo</small>
                </div>
                <i className="bi bi-exclamation-triangle fs-2"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0">{stats.outOfStock}</h4>
                  <small>Esgotados</small>
                </div>
                <i className="bi bi-x-circle fs-2"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0">{formatCurrency(stats.totalValue)}</h4>
                  <small>Valor Total</small>
                </div>
                <i className="bi bi-currency-dollar fs-2"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <div className="row align-items-center">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Todas Categorias</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Todos Status</option>
                <option value="NORMAL">Normal</option>
                <option value="BAIXO">Estoque Baixo</option>
                <option value="ESGOTADO">Esgotado</option>
              </select>
            </div>
            <div className="col-md-4 text-end">
              <button
                className="btn btn-success me-2"
                onClick={() => alert('Formulário de novo produto será implementado')}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Novo Produto
              </button>
              <button
                className="btn btn-outline-primary"
                onClick={handleExport}
              >
                <i className="bi bi-download me-2"></i>
                Exportar
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger mx-3 mb-0" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        {/* Products Table */}
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th className="text-end">Preço</th>
                <th className="text-center">Estoque</th>
                <th className="text-center">Status</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    <div className="loading-spinner mx-auto"></div>
                    <p className="text-muted mt-2">Carregando produtos...</p>
                  </td>
                </tr>
              ) : produtos.length > 0 ? (
                produtos.map(renderProductRow)
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    <i className="bi bi-inbox text-muted fs-1"></i>
                    <p className="text-muted mb-0">
                      {searchTerm || categoryFilter || statusFilter
                        ? 'Nenhum produto encontrado com os filtros selecionados'
                        : 'Nenhum produto cadastrado'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}