// Dados simulados
let movimentacoes = [
    {
        id: 1,
        dataHora: '2025-06-01T14:30:00',
        tipo: 'entrada',
        produto: 'Notebook Dell Inspiron',
        quantidade: 50,
        valorUnitario: 2500.00,
        valorTotal: 125000.00,
        fornecedorCliente: 'TechSupply Ltda',
        responsavel: 'João Silva',
        observacoes: 'Pedido de reposição mensal'
    },
    {
        id: 2,
        dataHora: '2025-06-01T10:15:00',
        tipo: 'saida',
        produto: 'Mouse Logitech MX Master',
        quantidade: 25,
        valorUnitario: 350.00,
        valorTotal: 8750.00,
        fornecedorCliente: 'Cliente Corporativo XYZ',
        responsavel: 'Maria Santos',
        observacoes: 'Venda para escritório'
    },
    {
        id: 3,
        dataHora: '2025-05-31T16:45:00',
        tipo: 'entrada',
        produto: 'Teclado Mecânico Corsair',
        quantidade: 30,
        valorUnitario: 450.00,
        valorTotal: 13500.00,
        fornecedorCliente: 'Digital Components',
        responsavel: 'João Silva',
        observacoes: 'Novo fornecedor - teste'
    },
    {
        id: 4,
        dataHora: '2025-05-31T09:20:00',
        tipo: 'saida',
        produto: 'Cabo HDMI 2m',
        quantidade: 100,
        valorUnitario: 25.00,
        valorTotal: 2500.00,
        fornecedorCliente: 'Loja ABC Eletrônicos',
        responsavel: 'Carlos Lima',
        observacoes: 'Venda em atacado'
    }
];

let produtos = [
    'Notebook Dell Inspiron',
    'Mouse Logitech MX Master',
    'Teclado Mecânico Corsair',
    'Cabo HDMI 2m',
    'Monitor Samsung 24"',
    'SSD Kingston 480GB',
    'Memória RAM 8GB DDR4'
];

let nextId = 5;
let editingId = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadProdutos();
    loadMovimentacoes();
    updateStats();
    
    // Configurar data padrão para hoje
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    document.getElementById('dataHora').value = localDateTime;

    // Event listeners
    document.getElementById('quantidade').addEventListener('input', calculateTotal);
    document.getElementById('valorUnitario').addEventListener('input', calculateTotal);
    document.getElementById('searchInput').addEventListener('input', filterMovimentacoes);
});

function loadProdutos() {
    const produtoSelect = document.getElementById('produto');
    const filterProdutoSelect = document.getElementById('filterProduto');
    
    produtos.forEach(produto => {
        const option1 = new Option(produto, produto);
        const option2 = new Option(produto, produto);
        produtoSelect.add(option1);
        filterProdutoSelect.add(option2);
    });
}

function loadMovimentacoes() {
    const tbody = document.getElementById('movimentacoesTable');
    tbody.innerHTML = '';

    const filteredMovimentacoes = getFilteredMovimentacoes();

    filteredMovimentacoes.forEach(mov => {
        const row = createMovimentacaoRow(mov);
        tbody.appendChild(row);
    });
}

function createMovimentacaoRow(mov) {
    const row = document.createElement('tr');
    const dataFormatada = new Date(mov.dataHora).toLocaleString('pt-BR');
    const tipoClass = mov.tipo === 'entrada' ? 'bg-success' : 'bg-danger';
    const tipoIcon = mov.tipo === 'entrada' ? 'fa-arrow-down' : 'fa-arrow-up';
    const quantidadePrefix = mov.tipo === 'entrada' ? '+' : '-';

    row.innerHTML = `
        <td>#${mov.id.toString().padStart(3, '0')}</td>
        <td>${dataFormatada}</td>
        <td>
            <span class="badge ${tipoClass}">
                <i class="fas ${tipoIcon}"></i> ${mov.tipo.charAt(0).toUpperCase() + mov.tipo.slice(1)}
            </span>
        </td>
        <td>${mov.produto}</td>
        <td>${quantidadePrefix}${mov.quantidade}</td>
        <td>R$ ${mov.valorUnitario.toFixed(2).replace('.', ',')}</td>
        <td>R$ ${mov.valorTotal.toFixed(2).replace('.', ',')}</td>
        <td>${mov.fornecedorCliente}</td>
        <td>${mov.responsavel}</td>
        <td>${mov.observacoes || '-'}</td>
        <td>
            <button class="btn btn-outline-light btn-sm me-1" onclick="editMovimentacao(${mov.id})" title="Editar">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-outline-light btn-sm" onclick="deleteMovimentacao(${mov.id})" title="Excluir">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    return row;
}

function openModal(tipo = '') {
    editingId = null;
    document.getElementById('movimentacaoForm').reset();
    document.getElementById('movimentacaoId').value = '';
    document.getElementById('modalTitle').textContent = 'Nova Movimentação';
    
    if (tipo) {
        document.getElementById('tipo').value = tipo;
    }
    
    // Configurar data padrão
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    document.getElementById('dataHora').value = localDateTime;
    
    new bootstrap.Modal(document.getElementById('movimentacaoModal')).show();
}

function editMovimentacao(id) {
    const mov = movimentacoes.find(m => m.id === id);
    if (!mov) return;

    editingId = id;
    document.getElementById('movimentacaoId').value = mov.id;
    document.getElementById('modalTitle').textContent = 'Editar Movimentação';
    document.getElementById('tipo').value = mov.tipo;
    document.getElementById('dataHora').value = mov.dataHora;
    document.getElementById('produto').value = mov.produto;
    document.getElementById('quantidade').value = mov.quantidade;
    document.getElementById('valorUnitario').value = mov.valorUnitario;
    document.getElementById('valorTotal').value = mov.valorTotal;
    document.getElementById('fornecedorCliente').value = mov.fornecedorCliente;
    document.getElementById('responsavel').value = mov.responsavel;
    document.getElementById('observacoes').value = mov.observacoes || '';
    
    new bootstrap.Modal(document.getElementById('movimentacaoModal')).show();
}

function deleteMovimentacao(id) {
    if (confirm('Tem certeza que deseja excluir esta movimentação?')) {
        movimentacoes = movimentacoes.filter(m => m.id !== id);
        loadMovimentacoes();
        updateStats();
        showAlert('Movimentação excluída com sucesso!', 'success');
    }
}

function saveMovimentacao() {
    const form = document.getElementById('movimentacaoForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const movimentacao = {
        id: editingId || nextId++,
        dataHora: document.getElementById('dataHora').value,
        tipo: document.getElementById('tipo').value,
        produto: document.getElementById('produto').value,
        quantidade: parseInt(document.getElementById('quantidade').value),
        valorUnitario: parseFloat(document.getElementById('valorUnitario').value),
        valorTotal: parseFloat(document.getElementById('valorTotal').value),
        fornecedorCliente: document.getElementById('fornecedorCliente').value,
        responsavel: document.getElementById('responsavel').value,
        observacoes: document.getElementById('observacoes').value
    };

    if (editingId) {
        const index = movimentacoes.findIndex(m => m.id === editingId);
        if (index !== -1) {
            movimentacoes[index] = movimentacao;
        }
        showAlert('Movimentação atualizada com sucesso!', 'success');
    } else {
        movimentacoes.push(movimentacao);
        showAlert('Movimentação adicionada com sucesso!', 'success');
    }

    bootstrap.Modal.getInstance(document.getElementById('movimentacaoModal')).hide();
    loadMovimentacoes();
    updateStats();
}

function calculateTotal() {
    const quantidade = parseFloat(document.getElementById('quantidade').value) || 0;
    const valorUnitario = parseFloat(document.getElementById('valorUnitario').value) || 0;
    const valorTotal = quantidade * valorUnitario;
    document.getElementById('valorTotal').value = valorTotal.toFixed(2);
}

function getFilteredMovimentacoes() {
    let filtered = [...movimentacoes];
    
    // Filtro por busca
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(mov => 
            mov.produto.toLowerCase().includes(searchTerm) ||
            mov.fornecedorCliente.toLowerCase().includes(searchTerm) ||
            mov.responsavel.toLowerCase().includes(searchTerm) ||
            mov.observacoes?.toLowerCase().includes(searchTerm) ||
            mov.id.toString().includes(searchTerm)
        );
    }

    // Filtro por tipo
    const filterTipo = document.getElementById('filterTipo').value;
    if (filterTipo) {
        filtered = filtered.filter(mov => mov.tipo === filterTipo);
    }

    // Filtro por produto
    const filterProduto = document.getElementById('filterProduto').value;
    if (filterProduto) {
        filtered = filtered.filter(mov => mov.produto === filterProduto);
    }

    // Filtro por data inicial
    const filterDataInicial = document.getElementById('filterDataInicial').value;
    if (filterDataInicial) {
        filtered = filtered.filter(mov => {
            const movDate = new Date(mov.dataHora).toISOString().split('T')[0];
            return movDate >= filterDataInicial;
        });
    }

    // Filtro por data final
    const filterDataFinal = document.getElementById('filterDataFinal').value;
    if (filterDataFinal) {
        filtered = filtered.filter(mov => {
            const movDate = new Date(mov.dataHora).toISOString().split('T')[0];
            return movDate <= filterDataFinal;
        });
    }

    // Ordenar por data (mais recente primeiro)
    filtered.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));

    return filtered;
}

function filterMovimentacoes() {
    loadMovimentacoes();
}

function clearFilters() {
    document.getElementById('filterTipo').value = '';
    document.getElementById('filterDataInicial').value = '';
    document.getElementById('filterDataFinal').value = '';
    document.getElementById('filterProduto').value = '';
    document.getElementById('searchInput').value = '';
    loadMovimentacoes();
}

function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    
    let totalEntradas = 0;
    let totalSaidas = 0;
    let valorTotal = 0;
    let movimentacoesHoje = 0;

    movimentacoes.forEach(mov => {
        const movDate = new Date(mov.dataHora).toISOString().split('T')[0];
        
        if (mov.tipo === 'entrada') {
            totalEntradas += mov.quantidade;
        } else {
            totalSaidas += mov.quantidade;
        }
        
        valorTotal += mov.valorTotal;
        
        if (movDate === today) {
            movimentacoesHoje++;
        }
    });

    document.getElementById('totalEntradas').textContent = totalEntradas.toLocaleString('pt-BR');
    document.getElementById('totalSaidas').textContent = totalSaidas.toLocaleString('pt-BR');
    document.getElementById('valorTotal').textContent = 'R$ ' + valorTotal.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    document.getElementById('movimentacoesHoje').textContent = movimentacoesHoje;
}

function showAlert(message, type = 'info') {
    // Criar elemento de alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(alertDiv);

    // Remover automaticamente após 3 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 3000);
}

// Função para exportar dados (funcionalidade extra)
function exportMovimentacoes() {
    const filtered = getFilteredMovimentacoes();
    let csvContent = "ID,Data/Hora,Tipo,Produto,Quantidade,Valor Unitário,Valor Total,Fornecedor/Cliente,Responsável,Observações\n";
    
    filtered.forEach(mov => {
        const dataFormatada = new Date(mov.dataHora).toLocaleString('pt-BR');
        const row = [
            mov.id,
            dataFormatada,
            mov.tipo,
            `"${mov.produto}"`,
            mov.quantidade,
            mov.valorUnitario.toFixed(2).replace('.', ','),
            mov.valorTotal.toFixed(2).replace('.', ','),
            `"${mov.fornecedorCliente}"`,
            `"${mov.responsavel}"`,
            `"${mov.observacoes || ''}"`
        ].join(',');
        csvContent += row + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `movimentacoes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Event listeners adicionais para melhorar a experiência
document.addEventListener('keydown', function(e) {
    // Esc para fechar modal
    if (e.key === 'Escape') {
        const modal = bootstrap.Modal.getInstance(document.getElementById('movimentacaoModal'));
        if (modal) {
            modal.hide();
        }
    }
    
    // Ctrl+N para nova movimentação
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        openModal();
    }
});

// Função para adicionar alguns dados de exemplo extras (opcional)
function addSampleData() {
    const sampleMovimentacoes = [
        {
            id: nextId++,
            dataHora: '2025-05-30T14:20:00',
            tipo: 'entrada',
            produto: 'Monitor Samsung 24"',
            quantidade: 15,
            valorUnitario: 800.00,
            valorTotal: 12000.00,
            fornecedorCliente: 'Samsung Brasil',
            responsavel: 'Ana Costa',
            observacoes: 'Monitores para nova filial'
        },
        {
            id: nextId++,
            dataHora: '2025-05-30T11:30:00',
            tipo: 'saida',
            produto: 'SSD Kingston 480GB',
            quantidade: 20,
            valorUnitario: 280.00,
            valorTotal: 5600.00,
            fornecedorCliente: 'TechMart Solutions',
            responsavel: 'Pedro Oliveira',
            observacoes: 'Upgrade de sistemas'
        }
    ];
    
    movimentacoes.push(...sampleMovimentacoes);
    loadMovimentacoes();
    updateStats();
}

// Adicionar dados de exemplo ao carregar (remova esta linha se não quiser dados extras)
// setTimeout(addSampleData, 1000);