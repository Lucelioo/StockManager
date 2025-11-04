# StockManager - Sistema de Gerenciamento de Estoque

Aplicação completa para gerenciamento de estoque migrada de frontend puro (HTML/CSS/JavaScript) para uma arquitetura moderna com Next.js + Spring Boot, mantendo 100% do conteúdo em português brasileiro.

## 🏗️ Arquitetura

### Frontend (Next.js 14 + TypeScript)
- **Framework**: Next.js 14 com App Router
- **Linguagem**: TypeScript
- **Estilização**: Bootstrap 5.3 + CSS personalizado
- **Autenticação**: JWT tokens com refresh automático
- **Estado**: React Hooks + Context API
- **Responsividade**: Mobile-first design

### Backend (Spring Boot 3 + Java 17)
- **Framework**: Spring Boot 3.2.0
- **Linguagem**: Java 17
- **Banco**: MySQL 8.0
- **Segurança**: Spring Security com JWT
- **ORM**: Spring Data JPA + Hibernate
- **Migrações**: Flyway
- **API**: RESTful com documentação

## 📁 Estrutura do Projeto

```
StockManager/
├── backend/                    # Spring Boot Backend
│   ├── src/main/java/com/stockmanager/
│   │   ├── config/            # Configurações (Security, CORS)
│   │   ├── controller/        # REST Controllers
│   │   ├── model/            # JPA Entities
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── repository/       # JPA Repositories
│   │   ├── service/          # Business Logic
│   │   ├── security/         # JWT Security
│   │   └── util/             # Utility Classes
│   ├── src/main/resources/
│   │   ├── application.yml   # Configuration
│   │   └── db/migration/     # Flyway migrations
│   └── pom.xml               # Maven configuration
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilities and API client
│   │   └── types/            # TypeScript types
│   ├── public/               # Static assets
│   └── package.json          # Dependencies
└── StockManager/              # Original frontend application (preserved)
```

## 🚀 Funcionalidades Implementadas

### ✅ Autenticação e Segurança
- Login com JWT tokens (15min) + Refresh tokens (7 dias)
- Logout em múltiplos dispositivos
- Controle de acesso baseado em roles
- Proteção contra CSRF e rate limiting

### ✅ Gestão de Produtos
- CRUD completo de produtos
- Filtros por categoria e status de estoque
- Busca em tempo real
- Validação de código único
- Cálculo automático de status (Normal/Baixo/Esgotado)
- Exportação de dados (JSON)

### ✅ Gestão de Fornecedores
- Cadastro de fornecedores com CNPJ
- Validação automática de CNPJ
- Integração com API ViaCEP
- Gestão de status (Ativo/Inativo)
- Exportação de dados

### ✅ Movimentações de Estoque
- Registro de entradas e saídas
- Atualização automática de estoque
- Histórico completo
- Filtros avançados (período, tipo, produto)
- Dashboard estatístico

### ✅ Dashboard Principal
- Cards estatísticos em tempo real
- Indicadores de estoque baixo
- Ações rápidas
- Feed de atividades recentes
- Gráficos de tendências

### ✅ Interface Responsiva
- Design mobile-first
- Sidebar colapsável
- Componentes reutilizáveis
- Animações e transições suaves
- Suporte para todos os dispositivos

## 🗨️ Português Brasileiro

100% do conteúdo em português brasileiro:
- Mensagens de erro e sucesso
- Labels e placeholders
- Validações
- Formatação de moeda (R$)
- Formatação de datas (DD/MM/YYYY)

## 🔧 Configuração e Instalação

### Pré-requisitos
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.6+

### Backend Setup

1. **Configurar Banco de Dados**
```sql
CREATE DATABASE stockmanager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **Configurar application.yml**
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/stockmanager
    username: root
    password: sua_senha

jwt:
  secret: sua-chave-secreta-muito-long
```

3. **Executar Backend**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup

1. **Instalar Dependências**
```bash
cd frontend
npm install
```

2. **Configurar Variáveis de Ambiente**
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

3. **Executar Frontend**
```bash
npm run dev
```

## 🎯 Credenciais de Demonstração

- **Usuário**: Lucelio
- **Senha**: 1234

## 📊 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Usuário atual

### Produtos
- `GET /api/produtos` - Listar produtos
- `POST /api/produtos` - Criar produto
- `PUT /api/produtos/{id}` - Atualizar produto
- `DELETE /api/produtos/{id}` - Excluir produto
- `GET /api/produtos/stats` - Estatísticas
- `GET /api/produtos/export` - Exportar dados

### Fornecedores
- `GET /api/fornecedores` - Listar fornecedores
- `POST /api/fornecedores` - Criar fornecedor
- `PUT /api/fornecedores/{id}` - Atualizar fornecedor
- `DELETE /api/fornecedores/{id}` - Excluir fornecedor

### Movimentações
- `GET /api/movimentacoes` - Listar movimentações
- `POST /api/movimentacoes` - Registrar movimentação
- `GET /api/movimentacoes/stats` - Estatísticas
- `GET /api/movimentacoes/export` - Exportar dados

## 🔒 Segurança

### Implementada
- JWT tokens com tempo de expiração
- Refresh tokens persistidos no banco
- Rate limiting em endpoints sensíveis
- CORS configurado para frontend
- Validação de entrada de dados
- Password encryption com BCrypt
- Prevenção de SQL injection

### Melhorias Futuras
- Two-factor authentication
- Rate limiting por usuário
- Auditoria de logs
- Backup automático

## 📱 Responsividade

- Mobile-first design
- Breakpoints: 576px, 768px, 992px, 1200px
- Touch-friendly buttons
- Optimized tables para mobile
- Swipe gestures support

## 🎨 Design System

### Cores
- Primary: #667eea → #764ba2 (gradient)
- Success: #28a745
- Warning: #ffc107
- Danger: #dc3545
- Info: #17a2b8

### Componentes
- Cards com hover effects
- Badges coloridos
- Forms com validação
- Modais responsivos
- Tables com sort e filter

## 📈 Performance

### Otimizações
- Lazy loading de componentes
- Pagination em todas as listas
- Cache de dados frequentes
- Bundle optimization
- Image optimization
- Service workers (planejado)

## 🧪 Testes

### Estrutura de Testes
- Unit tests (JUnit 5)
- Integration tests
- E2E tests (planejado)
- API testing

## 🚀 Deploy

### Backend
- Build: `mvn clean package`
- Executar: `java -jar target/stockmanager-backend-1.0.0.jar`
- Docker: Multi-stage builds (planejado)

### Frontend
- Build: `npm run build`
- Deploy: Vercel/Netlify/Railway
- Static optimization

## 🔄 Migração de Dados

### Dados Originais Preservados
- ✅ Produtos com códigos e categorias
- ✅ Fornecedores com CNPJ e contatos
- ✅ Validações de negócio brasileiras
- ✅ Formatação de moeda e datas
- ✅ Mensagens em português

### Validações Específicas
- CNPJ com algoritmo brasileiro
- CEP com ViaCEP integration
- Formatação de telefone brasileiro
- Cálculo de status de estoque

## 🤝 Contribuição

### Como Contribuir
1. Fork o projeto
2. Crie branch feature/nome-feature
3. Commit suas mudanças
4. Push para o branch
5. Abra Pull Request

### Convenções
- Commits em português
- Mensagens descritivas
- Code review obrigatório
- Testes para novas features

## 📝 Licença

MIT License - 2025 StockManager

## 📞 Suporte

- 📧 Email: suporte@stockmanager.com
- 📱 WhatsApp: (11) 99999-9999
- 🌐 [Documentação](https://docs.stockmanager.com)

---

**Desenvolvido com ❤️ para o mercado brasileiro**
