-- Tabela de Usuários
CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    nome_completo VARCHAR(255),
    role ENUM('ADMIN', 'USER') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Tabela de Produtos
CREATE TABLE produtos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    estoque INT NOT NULL DEFAULT 0,
    estoque_minimo INT NOT NULL DEFAULT 0,
    descricao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_codigo (codigo),
    INDEX idx_categoria (categoria),
    INDEX idx_estoque (estoque)
);

-- Tabela de Fornecedores
CREATE TABLE fornecedores (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(14) UNIQUE NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(20),
    endereco TEXT,
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(9),
    contato VARCHAR(100),
    status ENUM('ATIVO', 'INATIVO') DEFAULT 'ATIVO',
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_codigo (codigo),
    INDEX idx_cnpj (cnpj),
    INDEX idx_status (status)
);

-- Tabela de Movimentações
CREATE TABLE movimentacoes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo ENUM('ENTRADA', 'SAIDA') NOT NULL,
    produto_id BIGINT NOT NULL,
    quantidade INT NOT NULL,
    valor_unitario DECIMAL(10,2) NOT NULL,
    valor_total DECIMAL(12,2) NOT NULL,
    fornecedor_cliente VARCHAR(255),
    responsavel VARCHAR(255) NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE RESTRICT,
    INDEX idx_data_hora (data_hora),
    INDEX idx_tipo (tipo),
    INDEX idx_produto_id (produto_id),
    INDEX idx_responsavel (responsavel)
);

-- Tabela de Refresh Tokens
CREATE TABLE refresh_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    usuario_id BIGINT NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_expiry_date (expiry_date)
);

-- Inserir usuário admin padrão (senha: 1234 criptografada com BCrypt)
INSERT INTO usuarios (username, password, email, nome_completo, role) VALUES
('Lucelio', '$2a$10$8K0O7gP8XqYj1.5J6Z3Q8uYqFjHk3nMvC5xZ2QwR7bLp4eA1n9D', 'lucelio@stockmanager.com', 'Lucelio Silva', 'ADMIN');

-- Inserir produtos de exemplo
INSERT INTO produtos (codigo, nome, categoria, preco, estoque, estoque_minimo, descricao) VALUES
('#001', 'Notebook Dell Inspiron', 'Eletrônicos', 2500.00, 15, 5, 'Notebook Dell Inspiron 15 3000, Intel Core i5, 8GB RAM, 256GB SSD'),
('#002', 'Mouse Logitech MX Master', 'Periféricos', 350.00, 8, 10, 'Mouse sem fio Logitech MX Master 3 com sensor Darkfield'),
('#003', 'Teclado Mecânico Corsair', 'Periféricos', 450.00, 0, 3, 'Teclado mecânico Corsair K70 RGB com switches Cherry MX'),
('#004', 'Monitor Samsung 24"', 'Eletrônicos', 800.00, 12, 5, 'Monitor Samsung 24" Full HD IPS com ajuste de altura'),
('#005', 'Cabo HDMI 2.0', 'Acessórios', 25.00, 50, 20, 'Cabo HDMI 2.0 de 1.5 metros com suporte a 4K');

-- Inserir fornecedores de exemplo
INSERT INTO fornecedores (codigo, nome, cnpj, email, telefone, endereco, cidade, estado, cep, contato, status, observacoes) VALUES
('#F001', 'TechSupply Distribuidora Ltda', '12345678000190', 'contato@techsupply.com.br', '(11) 98765-4321', 'Rua das Flores, 123', 'São Paulo', 'SP', '01234-567', 'Carlos Santos', 'ATIVO', 'Fornecedor principal de componentes eletrônicos. Prazo de entrega médio de 5 dias úteis.'),
('#F002', 'Digital Components S.A.', '98765432000110', 'vendas@digitalcomp.com.br', '(11) 91234-5678', 'Av. Paulista, 1000', 'São Paulo', 'SP', '01310-100', 'Maria Oliveira', 'ATIVO', 'Especializada em componentes digitais de alta qualidade.'),
('#F003', 'Periféricos & Acessórios Ltda', '55444333000122', 'comercial@perifericos.com.br', '(11) 95555-1234', 'Rua dos Computadores, 456', 'São Paulo', 'SP', '04567-890', 'João Pedro', 'INATIVO', 'Fornecedor de periféricos diversos. Atualmente inativo devido a problemas de entrega.');