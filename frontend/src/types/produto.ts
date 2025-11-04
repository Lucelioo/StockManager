export interface Produto {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
  estoqueMinimo: number;
  descricao?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProdutoRequest {
  codigo: string;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
  estoqueMinimo: number;
  descricao?: string;
}

export interface ProdutoFilters {
  nome?: string;
  categoria?: string;
  status?: 'NORMAL' | 'BAIXO' | 'ESGOTADO';
}

export interface ProdutoStats {
  totalProdutos: number;
  produtosBaixoEstoque: number;
  produtosEsgotados: number;
  totalCategorias: number;
  valorTotalEstoque: number;
}