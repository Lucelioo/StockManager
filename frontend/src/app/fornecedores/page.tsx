'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Fornecedor } from '@/types/fornecedor';

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadFornecedores();
  }, []);

  const loadFornecedores = async () => {
    try {
      setLoading(true);
      // Mock data - implement when fornecedor API is ready
      const mockFornecedores: Fornecedor[] = [
        {
          id: 1,
          codigo: '#F001',
          nome: 'TechSupply Distribuidora Ltda',
          cnpj: '12.345.678/0001-90',
          email: 'contato@techsupply.com.br',
          telefone: '(11) 98765-4321',
          endereco: 'Rua das Flores, 123',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567',
          contato: 'Carlos Santos',
          status: 'ATIVO',
          observacoes: 'Fornecedor principal de componentes eletrônicos.',
          createdAt: '2025-01-01T00:00:00',
          updatedAt: '2025-01-01T00:00:00'
        }
      ];
      setFornecedores(mockFornecedores);
    } catch (error) {
      console.error('Suppliers error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderFornecedorRow = (fornecedor: Fornecedor) => (
    <tr key={fornecedor.id}>
      <td className="fw-semibold">{fornecedor.codigo}</td>
      <td>
        <div>
          <div className="fw-semibold">{fornecedor.nome}</div>
          <small className="text-muted">{fornecedor.email}</small>
        </div>
      </td>
      <td>{fornecedor.cnpj}</td>
      <td>{fornecedor.telefone}</td>
      <td className="text-center">
        <span className={`badge ${
          fornecedor.status === 'ATIVO' ? 'bg-success' : 'bg-warning'
        }`}>
          {fornecedor.status}
        </span>
      </td>
      <td>
        <div className="btn-group" role="group">
          <button
            className="btn btn-sm btn-outline-primary"
            title="Visualizar"
            onClick={() => alert(`Visualizar fornecedor: ${fornecedor.nome}`)}
          >
            <i className="bi bi-eye"></i>
          </button>
          <button
            className="btn btn-sm btn-outline-warning"
            title="Editar"
            onClick={() => alert(`Editar fornecedor: ${fornecedor.nome}`)}
          >
            <i className="bi bi-pencil"></i>
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <DashboardLayout title="Fornecedores">
      <div className="card shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar fornecedores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 text-end">
              <button
                className="btn btn-primary"
                onClick={() => alert('Formulário de novo fornecedor será implementado')}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Novo Fornecedor
              </button>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>CNPJ</th>
                <th>Telefone</th>
                <th className="text-center">Status</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    <div className="loading-spinner mx-auto"></div>
                    <p className="text-muted mt-2">Carregando fornecedores...</p>
                  </td>
                </tr>
              ) : fornecedores.length > 0 ? (
                fornecedores.filter(f =>
                  f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  f.cnpj.includes(searchTerm)
                ).map(renderFornecedorRow)
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    <i className="bi bi-inbox text-muted fs-1"></i>
                    <p className="text-muted mb-0">Nenhum fornecedor cadastrado</p>
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