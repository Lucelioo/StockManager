export interface Fornecedor {
  id: number;
  codigo: string;
  nome: string;
  cnpj: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  contato?: string;
  status: 'ATIVO' | 'INATIVO';
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FornecedorRequest {
  nome: string;
  cnpj: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  contato?: string;
  status: 'ATIVO' | 'INATIVO';
  observacoes?: string;
}

export interface FornecedorFilters {
  nome?: string;
  cnpj?: string;
  status?: 'ATIVO' | 'INATIVO';
}

export interface EnderecoViaCEP {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  complemento?: string;
}