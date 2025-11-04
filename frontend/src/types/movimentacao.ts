export interface Movimentacao {
  id: number;
  dataHora: string;
  tipo: 'ENTRADA' | 'SAIDA';
  produto: Produto;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  fornecedorCliente?: string;
  responsavel: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MovimentacaoRequest {
  tipo: 'ENTRADA' | 'SAIDA';
  produtoId: number;
  quantidade: number;
  valorUnitario: number;
  fornecedorCliente?: string;
  responsavel: string;
  observacoes?: string;
}

export interface MovimentacaoFilters {
  busca?: string;
  tipo?: 'ENTRADA' | 'SAIDA';
  produtoId?: number;
  dataInicial?: string;
  dataFinal?: string;
}

export interface MovimentacaoStats {
  totalEntradas: number;
  totalSaidas: number;
  valorTotal: number;
  movimentacoesHoje: number;
}

export interface ChartDataPoint {
  x: string;
  y: number;
}

export interface DashboardStats {
  totalProdutos: number;
  totalFornecedores: number;
  totalMovimentacoesHoje: number;
  produtosBaixoEstoque: number;
  valorTotalEstoque: number;
  recentMovimentacoes: Movimentacao[];
  chartData: {
    entradas: ChartDataPoint[];
    saidas: ChartDataPoint[];
  };
}

import { Produto } from './produto';