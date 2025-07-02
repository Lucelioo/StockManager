// Dados simulados dos fornecedores
let suppliers = [
    {
        id: 1,
        code: '#F001',
        name: 'TechSupply Distribuidora Ltda',
        cnpj: '12.345.678/0001-90',
        phone: '(11) 98765-4321',
        email: 'contato@techsupply.com.br',
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zip: '01234-567',
        contact: 'Carlos Santos',
        status: 'Ativo',
        notes: 'Fornecedor principal de componentes eletrônicos. Prazo de entrega médio de 5 dias úteis.',
        products: [
            { code: '#P001', name: 'Notebook Dell Inspiron 15', category: 'Informática', price: 'R$ 2.500,00', lastPurchase: '25/05/2025' },
            { code: '#P015', name: 'Monitor Samsung 24"', category: 'Periféricos', price: 'R$ 450,00', lastPurchase: '20/05/2025' },
            { code: '#P023', name: 'SSD Kingston 480GB', category: 'Armazenamento', price: 'R$ 180,00', lastPurchase: '18/05/2025' }
        ]
    },
    {
        id: 2,
        code: '#F002',
        name: 'Digital Components S.A.',
        cnpj: '98.765.432/0001-10',
        phone: '(11) 91234-5678',
        email: 'vendas@digitalcomp.com.br',
        address: 'Av. Paulista, 1000',
        city: 'São Paulo',
        state: 'SP',
        zip: '01310-100',
        contact: 'Maria Oliveira',
        status: 'Ativo',
        notes: 'Especializada em componentes digitais de alta qualidade.',
        products: [
            { code: '#P005', name: 'Placa Mãe ASUS', category: 'Hardware', price: 'R$ 650,00', lastPurchase: '22/05/2025' },
            { code: '#P012', name: 'Processador Intel i7', category: 'Hardware', price: 'R$ 1.200,00', lastPurchase: '19/05/2025' }
        ]
    },
    {
        id: 3,
        code: '#F003',
        name: 'Periféricos & Acessórios Ltda',
        cnpj: '55.444.333/0001-22',
        phone: '(11) 95555-1234',
        email: 'comercial@perifericos.com.br',
        address: 'Rua dos Computadores, 456',
        city: 'São Paulo',
        state: 'SP',
        zip: '04567-890',
        contact: 'João Pedro',
        status: 'Inativo',
        notes: 'Fornecedor de periféricos diversos. Atualmente inativo devido a problemas de entrega.',
        products: [
            { code: '#P030', name: 'Mouse Logitech', category: 'Periféricos', price: 'R$ 85,00', lastPurchase: '10/05/2025' },
            { code: '#P031', name: 'Teclado Mecânico', category: 'Periféricos', price: 'R$ 250,00', lastPurchase: '08/05/2025' }
        ]
    }
];

let editingSupplier = null;

// Função para renderizar a tabela de fornecedores
function renderSuppliersTable() {
    const tbody = document.getElementById('suppliersTableBody');
    tbody.innerHTML = '';

    suppliers.forEach(supplier => {
        const statusClass = supplier.status === 'Ativo' ? 'bg-success' : 'bg-warning';
        const row = `
            <tr>
                <td>${supplier.code}</td>
                <td>${supplier.name}</td>
                <td>${supplier.cnpj}</td>
                <td>${supplier.phone}</td>
                <td>${supplier.email}</td>
                <td><span class="badge ${statusClass}">${supplier.status}</span></td>
                <td>
                    <button class="btn btn-success btn-sm me-1" onclick="viewSupplier(${supplier.id})" title="Visualizar">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-warning btn-sm me-1" onclick="editSupplier(${supplier.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteSupplier(${supplier.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Função para buscar fornecedores
function searchSuppliers(searchTerm) {
    const filteredSuppliers = suppliers.filter(supplier => 
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.cnpj.includes(searchTerm) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const tbody = document.getElementById('suppliersTableBody');
    tbody.innerHTML = '';

    filteredSuppliers.forEach(supplier => {
        const statusClass = supplier.status === 'Ativo' ? 'bg-success' : 'bg-warning';
        const row = `
            <tr>
                <td>${supplier.code}</td>
                <td>${supplier.name}</td>
                <td>${supplier.cnpj}</td>
                <td>${supplier.phone}</td>
                <td>${supplier.email}</td>
                <td><span class="badge ${statusClass}">${supplier.status}</span></td>
                <td>
                    <button class="btn btn-success btn-sm me-1" onclick="viewSupplier(${supplier.id})" title="Visualizar">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-warning btn-sm me-1" onclick="editSupplier(${supplier.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteSupplier(${supplier.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Função para visualizar detalhes do fornecedor
function viewSupplier(id) {
    const supplier = suppliers.find(s => s.id === id);
    if (!supplier) return;

    // Preencher dados básicos
    document.getElementById('viewCode').textContent = supplier.code;
    document.getElementById('viewName').textContent = supplier.name;
    document.getElementById('viewCNPJ').textContent = supplier.cnpj;
    document.getElementById('viewPhone').textContent = supplier.phone;
    document.getElementById('viewEmail').textContent = supplier.email;
    document.getElementById('viewAddress').textContent = supplier.address;
    document.getElementById('viewCity').textContent = supplier.city;
    document.getElementById('viewState').textContent = supplier.state;
    document.getElementById('viewZip').textContent = supplier.zip;
    document.getElementById('viewContact').textContent = supplier.contact;
    document.getElementById('viewNotes').textContent = supplier.notes;

    // Status com badge
    const statusClass = supplier.status === 'Ativo' ? 'bg-success' : 'bg-warning';
    document.getElementById('viewStatus').innerHTML = `<span class="badge ${statusClass}">${supplier.status}</span>`;

    // Tabela de produtos
    const productsTable = document.getElementById('supplierProductsTable');
    productsTable.innerHTML = '';
    
    supplier.products.forEach(product => {
        const row = `
            <tr>
                <td>${product.code}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.price}</td>
                <td>${product.lastPurchase}</td>
            </tr>
        `;
        productsTable.innerHTML += row;
    });

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('viewSupplierModal'));
    modal.show();
}

// Função para editar fornecedor
function editSupplier(id) {
    const supplier = suppliers.find(s => s.id === id);
    if (!supplier) return;

    editingSupplier = supplier;

    // Preencher formulário com dados do fornecedor
    document.getElementById('supplierName').value = supplier.name;
    document.getElementById('supplierCNPJ').value = supplier.cnpj;
    document.getElementById('supplierPhone').value = supplier.phone;
    document.getElementById('supplierEmail').value = supplier.email;
    document.getElementById('supplierAddress').value = supplier.address;
    document.getElementById('supplierCity').value = supplier.city;
    document.getElementById('supplierState').value = supplier.state;
    document.getElementById('supplierZip').value = supplier.zip;
    document.getElementById('supplierContact').value = supplier.contact;
    document.getElementById('supplierStatus').value = supplier.status;
    document.getElementById('supplierNotes').value = supplier.notes;

    // Alterar título do modal
    document.getElementById('modalTitle').textContent = 'Editar Fornecedor';

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('addSupplierModal'));
    modal.show();
}

// Função para editar a partir da visualização
function editSupplierFromView() {
    // Fechar modal de visualização
    const viewModal = bootstrap.Modal.getInstance(document.getElementById('viewSupplierModal'));
    viewModal.hide();

    // Encontrar o fornecedor pelo código exibido
    const code = document.getElementById('viewCode').textContent;
    const supplier = suppliers.find(s => s.code === code);
    
    if (supplier) {
        setTimeout(() => {
            editSupplier(supplier.id);
        }, 300);
    }
}

// Função para excluir fornecedor
function deleteSupplier(id) {
    const supplier = suppliers.find(s => s.id === id);
    if (!supplier) return;

    if (confirm(`Tem certeza que deseja excluir o fornecedor "${supplier.name}"?`)) {
        suppliers = suppliers.filter(s => s.id !== id);
        renderSuppliersTable();
        
        // Mostrar notificação de sucesso
        showNotification('Fornecedor excluído com sucesso!', 'success');
    }
}

// Função para salvar fornecedor (novo ou editado)
function saveSupplier() {
    const form = document.getElementById('supplierForm');
    
    // Validar formulário
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const supplierData = {
        name: document.getElementById('supplierName').value,
        cnpj: document.getElementById('supplierCNPJ').value,
        phone: document.getElementById('supplierPhone').value,
        email: document.getElementById('supplierEmail').value,
        address: document.getElementById('supplierAddress').value,
        city: document.getElementById('supplierCity').value,
        state: document.getElementById('supplierState').value,
        zip: document.getElementById('supplierZip').value,
        contact: document.getElementById('supplierContact').value,
        status: document.getElementById('supplierStatus').value,
        notes: document.getElementById('supplierNotes').value
    };

    if (editingSupplier) {
        // Editar fornecedor existente
        const index = suppliers.findIndex(s => s.id === editingSupplier.id);
        suppliers[index] = { ...suppliers[index], ...supplierData };
        showNotification('Fornecedor atualizado com sucesso!', 'success');
    } else {
        // Criar novo fornecedor
        const newId = Math.max(...suppliers.map(s => s.id)) + 1;
        const newCode = `#F${String(newId).padStart(3, '0')}`;
        
        const newSupplier = {
            id: newId,
            code: newCode,
            ...supplierData,
            products: []
        };
        
        suppliers.push(newSupplier);
        showNotification('Fornecedor cadastrado com sucesso!', 'success');
    }

    // Limpar formulário e fechar modal
    form.reset();
    editingSupplier = null;
    document.getElementById('modalTitle').textContent = 'Novo Fornecedor';
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('addSupplierModal'));
    modal.hide();
    
    // Atualizar tabela
    renderSuppliersTable();
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    // Remover automaticamente após 3 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Função para aplicar máscaras nos campos
function applyMasks() {
    const cnpjField = document.getElementById('supplierCNPJ');
    const phoneField = document.getElementById('supplierPhone');
    const zipField = document.getElementById('supplierZip');

    // Máscara para CNPJ
    cnpjField.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
        e.target.value = value;
    });

    // Máscara para telefone
    phoneField.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = value.slice(0, 15);
    });

    // Máscara para CEP
    zipField.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{5})(\d)/, '$1-$2');
        e.target.value = value.slice(0, 9);
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Renderizar tabela inicial
    renderSuppliersTable();
    
    // Aplicar máscaras
    applyMasks();
    
    // Event listener para busca
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.trim();
        if (searchTerm === '') {
            renderSuppliersTable();
        } else {
            searchSuppliers(searchTerm);
        }
    });

    // Event listener para limpar formulário ao fechar modal
    const addSupplierModal = document.getElementById('addSupplierModal');
    addSupplierModal.addEventListener('hidden.bs.modal', function() {
        document.getElementById('supplierForm').reset();
        editingSupplier = null;
        document.getElementById('modalTitle').textContent = 'Novo Fornecedor';
    });

    // Event listener para salvar com Enter
    document.getElementById('supplierForm').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveSupplier();
        }
    });
});

// Função para buscar CEP (integração com API ViaCEP)
async function searchCEP(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
            document.getElementById('supplierAddress').value = data.logradouro;
            document.getElementById('supplierCity').value = data.localidade;
            document.getElementById('supplierState').value = data.uf;
        }
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
    }
}

// Event listener para busca automática de CEP
document.getElementById('supplierZip').addEventListener('blur', function(e) {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
        searchCEP(cep);
    }
});

// Funções de validação
function validateCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    
    if (cnpj === '') return false;
    if (cnpj.length !== 14) return false;
    
    // Elimina CNPJs conhecidos como inválidos
    if (cnpj === "00000000000000" || 
        cnpj === "11111111111111" || 
        cnpj === "22222222222222" || 
        cnpj === "33333333333333" || 
        cnpj === "44444444444444" || 
        cnpj === "55555555555555" || 
        cnpj === "66666666666666" || 
        cnpj === "77777777777777" || 
        cnpj === "88888888888888" || 
        cnpj === "99999999999999")
        return false;
        
    // Valida DVs
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) return false;
    
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(1))) return false;
    
    return true;
}

// Validação em tempo real do CNPJ
document.getElementById('supplierCNPJ').addEventListener('blur', function(e) {
    const cnpj = e.target.value;
    if (cnpj && !validateCNPJ(cnpj)) {
        e.target.setCustomValidity('CNPJ inválido');
        e.target.reportValidity();
    } else {
        e.target.setCustomValidity('');
    }
});

// Função para exportar dados dos fornecedores
function exportSuppliers() {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Código,Nome,CNPJ,Telefone,Email,Status,Cidade,Estado\n"
        + suppliers.map(supplier => 
            `${supplier.code},"${supplier.name}",${supplier.cnpj},${supplier.phone},${supplier.email},${supplier.status},"${supplier.city}",${supplier.state}`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "fornecedores.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Dados exportados com sucesso!', 'success');
}